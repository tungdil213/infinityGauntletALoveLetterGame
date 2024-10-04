import ShowLobbyController from '#features/lobbies/app/controllers/show_lobby_controller'
import type { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link } from '@inertiajs/react'
import { useEffect } from 'react'

export default function Home(props: Readonly<InferPageProps<ShowLobbyController, 'handle'>>) {
  useEffect(() => {
    return () => {
      const data = {
        lobbyId: props.lobby?.uuid,
        playerUUID: props.user?.uuid,
      }

      // Convertir les données en une chaîne JSON
      const jsonData = JSON.stringify(data)

      // Créer un Blob avec le bon type MIME
      const blob = new Blob([jsonData], { type: 'application/json' })

      // Utiliser navigator.sendBeacon pour envoyer les données
      navigator.sendBeacon('/lobby/leave', blob)
    }
  }, [props.lobby?.uuid, props.user?.uuid])

  console.log('props', props)
  return (
    <>
      <Head title="Show Lobby" />
      <div className="container">
        <Link href="/lobby/">List Lobbies</Link>
        <h1>Show Lobby</h1>
        <p>Here is your lobby</p>
        <b>lobby</b>
        <p>{JSON.stringify(props.lobby)}</p>
      </div>
    </>
  )
}
