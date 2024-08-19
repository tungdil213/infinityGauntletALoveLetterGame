import type { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link, router } from '@inertiajs/react'

import ListLobbiesController from '#features/lobbies/app/controllers/list_lobbies_controller'

export default function Home(props: Readonly<InferPageProps<ListLobbiesController, 'handle'>>) {
  function onClickCreateLobby(e: React.FormEvent<EventTarget>) {
    e.preventDefault()
    router.post('/lobby/create')
  }
  return (
    <>
      <Head title="List Lobby" />
      <div className="container">
        <h1>List Lobby</h1>
        <p>Here is the lobbies</p>
        <b>user</b>

        <div>
          <div>
            <b>uuid : </b>
            <span>{props.user?.uuid}</span>
          </div>
          <div>
            <b>username : </b>
            <span>{props.user?.username}</span>
          </div>
          <div>
            <b>email : </b>
            <span>{props.user?.email}</span>
          </div>
        </div>
        <b>lobby</b>
        {props.lobbies?.map((lobby) => (
          <div key={lobby.uuid}>
            <Link href={`/lobby/${lobby.uuid}`}>
              <b>uuid : </b>
              {lobby.uuid}
            </Link>
            <div>
              <b>status : </b>
              <span>{lobby.status}</span>
            </div>
            <div>
              <b>Players : </b>
              <span>{lobby.players.length}</span>
            </div>
          </div>
        ))}
        <Link href="/lobby/create" onClick={onClickCreateLobby}>
          Create lobby
        </Link>
      </div>
    </>
  )
}
