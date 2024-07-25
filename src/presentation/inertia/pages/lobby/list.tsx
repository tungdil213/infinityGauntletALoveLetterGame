import ListLobbiesController from '#app/http/lobby/controllers/list_lobbies_controller'
import type { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'

export default function Home(props: Readonly<InferPageProps<ListLobbiesController, 'handle'>>) {
  return (
    <>
      <Head title="List Lobby" />
      <div className="container">
        <h1>List Lobby</h1>
        <p>Here is the lobbies</p>
        <p>
          <b>lobby</b>
          {JSON.stringify(props.lobbies)}
        </p>
        <p>
          <b>user</b>
          {JSON.stringify(props.user)}
        </p>
      </div>
    </>
  )
}
