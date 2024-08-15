import ShowBackofficeController from '#features/backoffice/app/controllers/show_backoffice_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, router } from '@inertiajs/react'

export default function index(props: Readonly<InferPageProps<ShowBackofficeController, 'handle'>>) {
  function onSubmit(e: React.FormEvent<EventTarget>) {
    e.preventDefault()
    router.post('/logout')
  }

  return (
    <>
      <Head title="BackOffice" />
      <div className="container">
        <p>User: {JSON.stringify(props.user)}</p>
        <button onClick={onSubmit}>Logout</button>
      </div>
    </>
  )
}
