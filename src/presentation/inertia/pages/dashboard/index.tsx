import ShowDashboardController from '#app/http/dashboard/controllers/show_dashboard_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, router } from '@inertiajs/react'

export default function index(props: Readonly<InferPageProps<ShowDashboardController, 'handle'>>) {
  function onClickLogout(e: React.FormEvent<EventTarget>) {
    e.preventDefault()
    router.post('/logout')
  }

  function onClickCreateLobby(e: React.FormEvent<EventTarget>) {
    e.preventDefault()
    router.post('/lobby/create')
  }

  function onClickShowLobby(e: React.FormEvent<EventTarget>) {
    e.preventDefault()
    router.get('/lobby/')
  }

  return (
    <>
      <Head title="BackOffice" />
      <div className="container">
        <p>User: {JSON.stringify(props.user)}</p>
        <button onClick={onClickLogout}>onClickLogout</button>
        <button onClick={onClickCreateLobby}>onClickCreateLobby</button>
        <button onClick={onClickShowLobby}>onClickShowLobby</button>
      </div>
    </>
  )
}
