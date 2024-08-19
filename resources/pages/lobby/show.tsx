import ShowLobbyController from '#features/lobbies/app/controllers/show_lobby_controller'
import type { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link, router } from '@inertiajs/react'
import { useEffect } from 'react'

export default function Home(props: Readonly<InferPageProps<ShowLobbyController, 'handle'>>) {
  useEffect(() => {
    return () => {
      Promise.all([
        router.visit('/lobby/leave', {
          method: 'post',
          data: { lobbyId: props.lobby?.uuid, playerUUID: props.user?.uuid },
          preserveScroll: true,
          only: [],
          onError: () => {
            console.error('Failed to leave the lobby.')
          },
        }),
      ])
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
