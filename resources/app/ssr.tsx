import { createInertiaApp } from '@inertiajs/react'
import type { ReactNode } from 'react'
import ReactDOMServer from 'react-dom/server'
import DefaultLayout from '../layouts/default_layout.js'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      // eslint-disable-next-line
      const page = pages[`../pages/${name}.tsx`]
      // @ts-expect-error
      // eslint-disable-next-line
      page.default.layout ??= (page: ReactNode) => {
        return <DefaultLayout>{page}</DefaultLayout>
      }

      return page
    },
    setup: ({ App, props }) => <App {...props} />,
  })
}
