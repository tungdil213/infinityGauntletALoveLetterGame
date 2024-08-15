import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'

export default function index(props: Readonly<InferPageProps<ShowDashboardController, 'handle'>>) {
  return (
    <>
      <Head title="BackOffice" />

      <div className="container">
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h5 className="mb-2 text-2xl font-bold text-gray-900">User</h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{props.user.username}</p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{props.user.email}</p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {props.user.created_at}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {props.user.updated_at}
          </p>

          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {JSON.stringify(props.player)}
          </p>
        </div>
      </div>
    </>
  )
}
