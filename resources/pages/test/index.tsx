import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, router } from '@inertiajs/react'

export default function show_me_user(
  props: Readonly<InferPageProps<TestCompleteController, 'handle'>>
) {
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
      <Head title="Show me" />

      <div className="container">
        <button onClick={onClickLogout}>onClickLogout</button>
        <button onClick={onClickCreateLobby}>onClickCreateLobby</button>
        <button onClick={onClickShowLobby}>onClickShowLobby</button>
      </div>
    </>
  )
}
