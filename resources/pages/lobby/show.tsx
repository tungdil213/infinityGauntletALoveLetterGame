import ShowLobbyController from '#features/lobbies/app/controllers/show_lobby_controller'
import type { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { useLobbySSE } from '../../lib/hooks/useSSE'

export default function Home(props: Readonly<InferPageProps<ShowLobbyController, 'handle'>>) {
  const { currentLobby, setCurrentLobby, isConnected } = useLobbySSE(props.lobby?.uuid)
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  // Initialiser avec les données du serveur
  useEffect(() => {
    if (props.lobby) {
      setCurrentLobby(props.lobby)
    }
  }, [props.lobby, setCurrentLobby])

  // Nettoyage à la fermeture de la page
  useEffect(() => {
    return () => {
      if (props.lobby?.uuid && props.user?.uuid) {
        const data = {
          lobbyId: props.lobby.uuid,
        }
        const jsonData = JSON.stringify(data)
        const blob = new Blob([jsonData], { type: 'application/json' })
        setTimeout(() => {
          navigator.sendBeacon('/lobby/leave', blob)
        }, 100)
      }
    }
  }, [props.lobby?.uuid, props.user?.uuid])

  const lobby = currentLobby || props.lobby
  const isPlayerInLobby = lobby?.players?.some((p: any) => p.uuid === props.user?.uuid)
  const isCreator = lobby?.players?.[0]?.uuid === props.user?.uuid
  const canStartGame = isCreator && lobby?.players?.length >= 2

  const handleJoinLobby = async () => {
    if (!lobby?.uuid || isJoining) return
    
    setIsJoining(true)
    try {
      await fetch('/lobby/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ lobbyId: lobby.uuid }),
      })
    } catch (error) {
      console.error('Erreur lors de la connexion au lobby:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveLobby = async () => {
    if (!lobby?.uuid || isLeaving) return
    
    setIsLeaving(true)
    try {
      await fetch('/lobby/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ lobbyId: lobby.uuid }),
      })
      router.visit('/lobby')
    } catch (error) {
      console.error('Erreur lors de la déconnexion du lobby:', error)
    } finally {
      setIsLeaving(false)
    }
  }

  const handleStartGame = async () => {
    if (!lobby?.uuid || !canStartGame) return
    
    try {
      await fetch('/lobby/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ lobbyId: lobby.uuid }),
      })
    } catch (error) {
      console.error('Erreur lors du démarrage de la partie:', error)
    }
  }

  if (!lobby) {
    return (
      <>
        <Head title="Lobby introuvable" />
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Lobby introuvable</h1>
            <Link href="/lobby" className="text-blue-400 hover:text-blue-300">
              Retour à la liste des lobbies
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head title={`Lobby ${lobby.name || lobby.uuid.slice(0, 8)}`} />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/lobby" 
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              ← Retour aux lobbies
            </Link>
            
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`} />
              {isConnected ? 'Connecté' : 'Déconnecté'}
            </div>
          </div>

          {/* Lobby Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-white">
                🎯 {lobby.name || `Lobby ${lobby.uuid.slice(0, 8)}`}
              </h1>
              <div className="flex items-center space-x-2">
                <span className={`inline-block w-3 h-3 rounded-full ${
                  lobby.status === 'OPEN' ? 'bg-green-400' :
                  lobby.status === 'WAITING' ? 'bg-yellow-400' :
                  lobby.status === 'READY' ? 'bg-blue-400' :
                  lobby.status === 'FULL' ? 'bg-orange-400' :
                  'bg-gray-400'
                }`} />
                <span className="text-white capitalize">{lobby.status.toLowerCase()}</span>
              </div>
            </div>
            
            <div className="text-gray-300">
              <p>👥 {lobby.players?.length || 0}/4 joueurs</p>
              <p className="text-sm mt-1">ID: {lobby.uuid}</p>
            </div>
          </div>

          {/* Players List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">👥 Joueurs</h2>
            <div className="space-y-3">
              {lobby.players?.map((player: any, index: number) => (
                <div 
                  key={player.uuid} 
                  className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{player.nickName}</p>
                      {index === 0 && (
                        <p className="text-yellow-400 text-sm">👑 Créateur</p>
                      )}
                    </div>
                  </div>
                  {player.uuid === props.user?.uuid && (
                    <span className="text-blue-400 text-sm">Vous</span>
                  )}
                </div>
              )) || (
                <p className="text-gray-400">Aucun joueur dans ce lobby</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isPlayerInLobby ? (
                <button
                  onClick={handleJoinLobby}
                  disabled={isJoining || lobby.status === 'FULL'}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {isJoining ? 'Connexion...' : '🚀 Rejoindre le Lobby'}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleLeaveLobby}
                    disabled={isLeaving}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {isLeaving ? 'Déconnexion...' : '🚪 Quitter le Lobby'}
                  </button>
                  
                  {canStartGame && (
                    <button
                      onClick={handleStartGame}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      ⚡ Démarrer la Partie
                    </button>
                  )}
                </>
              )}
            </div>
            
            {!canStartGame && isPlayerInLobby && (
              <p className="text-center text-gray-400 mt-4">
                {lobby.players?.length < 2 
                  ? 'En attente d\'au moins 2 joueurs pour démarrer'
                  : !isCreator 
                  ? 'Seul le créateur peut démarrer la partie'
                  : 'Prêt à démarrer !'}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
