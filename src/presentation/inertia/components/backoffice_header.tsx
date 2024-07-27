import { Link } from '@inertiajs/react'

export function BackOfficeHeader() {
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/logout" method="post" as="button">
          Logout
        </Link>
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
              <Link href="/lobby/create" method="post" as="button">
                Create lobby
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
