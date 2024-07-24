import ShowLobbyController from '#app/controllers/http/lobby/show_lobby_controller'
import type { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'

export default function Home(props: Readonly<InferPageProps<ShowLobbyController, 'handle'>>) {
  console.log(props)

  return (
    <>
      <Head title="Show Lobby" />
      <div className="container">
        <h1>Show Lobby</h1>
        <p>Here is your lobby</p>
        <p>
          <b>lobby</b>
          {JSON.stringify(props.lobby)}
        </p>
        <p>
          <b>user</b>
          {JSON.stringify(props.user)}
        </p>
      </div>
    </>
  )
}
