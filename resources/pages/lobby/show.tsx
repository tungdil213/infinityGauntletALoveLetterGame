import ShowLobbyController from '#features/lobbies/app/controllers/show_lobby_controller'
import type { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link } from '@inertiajs/react'

export default function Home(props: Readonly<InferPageProps<ShowLobbyController, 'handle'>>) {
  return (
    <>
      <Head title="Show Lobby" />
      <div className="container">
        <Link href="/lobby/">List Lobbies</Link>
        <h1>Show Lobby</h1>
        <p>Here is your lobby</p>
        <p>
          <b>lobby</b>
          {JSON.stringify(props.lobby)}
        </p>
      </div>
    </>
  )
}
