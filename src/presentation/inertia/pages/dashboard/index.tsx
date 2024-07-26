import ShowDashboardController from '#app/http/dashboard/controllers/show_dashboard_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link, router } from '@inertiajs/react'

export default function index(props: Readonly<InferPageProps<ShowDashboardController, 'handle'>>) {
  function onClickLogout(e: React.FormEvent<EventTarget>) {
    e.preventDefault()
    router.post('/logout')
  }

  function onClickCreateLobby(e: React.FormEvent<EventTarget>) {
    e.preventDefault()
    router.post('/lobby/create')
  }

  return (
    <>
      <Head title="BackOffice" />
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/logout" onClick={onClickLogout}>
            Logout
          </Link>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
              <Link href="/">Home</Link>
              </li>
              <li>
              <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
              <Link href="/lobby/">Show lobbies</Link>
              </li>
              <li>
                <Link href="/lobby/create" onClick={onClickCreateLobby}>
                  Create lobby
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

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
        </div>
      </div>
    </>
  )
}
