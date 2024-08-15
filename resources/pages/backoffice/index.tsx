import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, router } from '@inertiajs/react'
import ShowBackofficeController from '../../../src/features/backoffice/app/controllers/show_backoffice_controller.js'

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
