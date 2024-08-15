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
        <p>
          <b>user</b>
          <div>
            <p>
              <b>id</b>
              {props.user?.id}
            </p>
            <p>
              <b>username</b>
              {props.user?.username}
            </p>
            <p>
              <b>email</b>
              {props.user?.email}
            </p>
            <p>
              <b>created_at</b>
              {props.user?.created_at}
            </p>
            <p>
              <b>updated_at</b>
              {props.user?.updated_at}
            </p>
          </div>
        </p>
        <b>lobby</b>
        {props.lobbies.map((lobby) => (
          <div key={lobby.uuid}>
            <Link href={`/lobby/${lobby.uuid}`}>
              <b>id</b>
              {lobby.uuid}
            </Link>
            <p>
              <b>status</b>
              {lobby.status}
            </p>
          </div>
        ))}
        <Link href="/lobby/create" onClick={onClickCreateLobby}>
          Create lobby
        </Link>
      </div>
    </>
  )
}
