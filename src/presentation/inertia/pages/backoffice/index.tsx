import { Head, router } from '@inertiajs/react'

export default function Home(props: Readonly<{ version: number }>) {
  function onSubmit(e: React.FormEvent<EventTarget>) {
    e.preventDefault()
    router.post('/logout')
  }

  return (
    <>
      <Head title="BackOffice" />

      <button className="btn btn-primary" onClick={onSubmit}>
        Logout
      </button>
    </>
  )
}
