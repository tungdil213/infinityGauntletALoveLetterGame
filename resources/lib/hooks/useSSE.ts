import { useEffect, useRef, useState } from 'react'

interface SSEOptions {
  onMessage?: (event: MessageEvent) => void
  onError?: (error: Event) => void
  onOpen?: (event: Event) => void
  onClose?: (event: Event) => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

interface SSEState {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  reconnectAttempts: number
}

export function useSSE(url: string, options: SSEOptions = {}) {
  const {
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options

  const [state, setState] = useState<SSEState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempts: 0,
  })

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReconnectRef = useRef(true)

  const connect = () => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const eventSource = new EventSource(url)
      eventSourceRef.current = eventSource

      eventSource.onopen = (event) => {
        setState({
          isConnected: true,
          isConnecting: false,
          error: null,
          reconnectAttempts: 0,
        })
        onOpen?.(event)
      }

      eventSource.onmessage = (event) => {
        onMessage?.(event)
      }

      eventSource.onerror = (event) => {
        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: 'Connection error',
        }))

        onError?.(event)

        // Tentative de reconnexion
        if (shouldReconnectRef.current && state.reconnectAttempts < maxReconnectAttempts) {
          setState((prev) => ({
            ...prev,
            reconnectAttempts: prev.reconnectAttempts + 1,
          }))

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      // Note: EventSource doesn't have onclose, it closes automatically on error
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }))
    }
  }

  const disconnect = () => {
    shouldReconnectRef.current = false
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      reconnectAttempts: 0,
    })
  }

  const reconnect = () => {
    disconnect()
    shouldReconnectRef.current = true
    setState((prev) => ({ ...prev, reconnectAttempts: 0 }))
    connect()
  }

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [url])

  return {
    ...state,
    connect,
    disconnect,
    reconnect,
  }
}

// Hook spécialisé pour les lobbies
export function useLobbySSE(lobbyId?: string) {
  const [lobbies, setLobbies] = useState<any[]>([])
  const [currentLobby, setCurrentLobby] = useState<any | null>(null)

  const url = lobbyId ? `/lobby/${lobbyId}/events` : '/lobby/events'

  const sse = useSSE(url, {
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data)
        
        switch (event.type) {
          case 'lobby_updated':
            if (lobbyId && data.lobby) {
              setCurrentLobby(data.lobby)
            }
            break
            
          case 'lobbies_updated':
            // Recharger la liste des lobbies
            fetch('/lobby')
              .then((res) => res.json())
              .then((lobbyData) => setLobbies(lobbyData.lobbies || []))
              .catch(console.error)
            break
            
          case 'player_joined':
            if (lobbyId && data.lobbyId === lobbyId) {
              // Mettre à jour le lobby actuel
              setCurrentLobby((prev: any) => {
                if (!prev) return prev
                return {
                  ...prev,
                  players: [...prev.players, data.player],
                }
              })
            }
            break
            
          case 'player_left':
            if (lobbyId && data.lobbyId === lobbyId) {
              setCurrentLobby((prev: any) => {
                if (!prev) return prev
                return {
                  ...prev,
                  players: prev.players.filter((p: any) => p.uuid !== data.playerUuid),
                }
              })
            }
            break
            
          case 'game_starting':
            if (lobbyId && data.lobbyId === lobbyId) {
              // Rediriger vers la partie
              window.location.href = `/game/${data.lobbyId}`
            }
            break
            
          default:
            console.log('SSE event received:', event.type, data)
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error)
      }
    },
    onError: (error) => {
      console.error('SSE connection error:', error)
    },
  })

  return {
    ...sse,
    lobbies,
    currentLobby,
    setLobbies,
    setCurrentLobby,
  }
}
