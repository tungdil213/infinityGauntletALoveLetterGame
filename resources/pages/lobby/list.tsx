import type { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link, router } from '@inertiajs/react'
import { useEffect } from 'react'

import ListLobbiesController from '#features/lobbies/app/controllers/list_lobbies_controller'
import { useLobbySSE } from '../../lib/hooks/useSSE'

export default function Home(props: Readonly<InferPageProps<ListLobbiesController, 'handle'>>) {
  const { lobbies, setLobbies, isConnected, error } = useLobbySSE()

  // Initialiser avec les données du serveur
  useEffect(() => {
    if (props.lobbies) {
      setLobbies(props.lobbies)
    }
  }, [props.lobbies, setLobbies])

  function onClickCreateLobby(e: React.FormEvent<EventTarget>) {
    e.preventDefault()
    router.post('/lobby/create')
  }

  const displayLobbies = lobbies.length > 0 ? lobbies : props.lobbies || []

  return (
    <>
      <Head title="Infinity Gauntlet - Lobbies" />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🎮 Infinity Gauntlet: Love Letter
            </h1>
            <p className="text-gray-300">Rejoignez ou créez un lobby pour commencer à jouer</p>
          </div>

          {/* Connection Status */}
          <div className="mb-6 flex items-center justify-center">
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
              isConnected 
                ? 'bg-green-500/20 text-green-400' 
                : error 
                ? 'bg-red-500/20 text-red-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-400' : error ? 'bg-red-400' : 'bg-yellow-400'
              }`} />
              {isConnected ? 'Connecté' : error ? 'Erreur de connexion' : 'Connexion...'}
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">👤 Profil Joueur</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
              <div>
                <span className="font-medium">Pseudo:</span> {props.user?.username}
              </div>
              <div>
                <span className="font-medium">Email:</span> {props.user?.email}
              </div>
              <div>
                <span className="font-medium">ID:</span> {props.user?.uuid?.slice(0, 8)}...
              </div>
            </div>
          </div>

          {/* Create Lobby Button */}
          <div className="text-center mb-8">
            <button
              onClick={onClickCreateLobby}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              ✨ Créer un Nouveau Lobby
            </button>
          </div>

          {/* Lobbies List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">🏛️ Lobbies Disponibles</h2>
            
            {displayLobbies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">Aucun lobby disponible pour le moment</p>
                <p className="text-gray-500 mt-2">Créez le premier lobby pour commencer à jouer !</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {displayLobbies.map((lobby) => (
                  <div
                    key={lobby.uuid}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/lobby/${lobby.uuid}`}
                          className="text-white hover:text-blue-300 transition-colors"
                        >
                          <h3 className="text-lg font-semibold mb-2">
                            🎯 {lobby.name || `Lobby ${lobby.uuid.slice(0, 8)}`}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              lobby.status === 'OPEN' ? 'bg-green-400' :
                              lobby.status === 'WAITING' ? 'bg-yellow-400' :
                              lobby.status === 'READY' ? 'bg-blue-400' :
                              lobby.status === 'FULL' ? 'bg-orange-400' :
                              'bg-gray-400'
                            }`} />
                            <span className="capitalize">{lobby.status.toLowerCase()}</span>
                          </div>
                          
                          <div className="flex items-center">
                            👥 {lobby.players?.length || 0}/4 joueurs
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        href={`/lobby/${lobby.uuid}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Rejoindre
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
