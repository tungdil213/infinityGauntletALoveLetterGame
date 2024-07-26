import ListLobbiesController from '#app/http/lobby/controllers/list_lobbies_controller'
import { LobbyInterface } from '#domain/gameHub/lobby/entities/lobby_interface'
import type { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link, router } from '@inertiajs/react'

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
              {props.user.id}
            </p>
            <p>
              <b>username</b>
              {props.user.username}
            </p>
            <p>
              <b>email</b>
              {props.user.email}
            </p>
            <p>
              <b>created_at</b>
              {props.user.created_at}
            </p>
            <p>
              <b>updated_at</b>
              {props.user.updated_at}
            </p>
          </div>
        </p>
        <b>lobby</b>
        {props.lobbies.map((lobby: LobbyInterface) => (
          <div key={lobby.id}>
            <Link href={`/lobby/${lobby.id}`}>
              <b>id</b>
              {lobby.id}
            </Link>
            <p>
              <b>status</b>
              {lobby.status}
            </p>
            <p>
              <b>created_at</b>
              {lobby.createdAt?.toDateString?.()}
            </p>
            <p>
              <b>updated_at</b>
              {lobby.updatedAt?.toDateString?.()}
            </p>
          </div>
        ))}
        <button onClick={onClickCreateLobby}>Create Lobby</button>
      </div>
    </>
  )
}
