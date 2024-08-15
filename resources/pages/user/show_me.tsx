import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import ShowMeUserController from '../../../src/features/users/app/controllers/show_me_user_controller.js'

export default function show_me_user(
  props: Readonly<InferPageProps<ShowMeUserController, 'handle'>>
) {
  return (
    <>
      <Head title="Show me" />

      <div className="container">
        <h1>Show me</h1>
        <p>Here is your profile</p>
        <p>{JSON.stringify(props)}</p>
      </div>
    </>
  )
}
