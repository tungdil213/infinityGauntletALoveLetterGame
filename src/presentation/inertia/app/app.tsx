/// <reference path="../../../../adonisrc.ts" />
/// <reference path="../../../../config/inertia.ts" />

import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '../css/app.css'
import DefaultLayout from '../layouts/default_layout'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page = await resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx')
    )
    // @ts-expect-error
    // eslint-disable-next-line
    page.default.layout ??= (page: ReactNode) => {
      return <DefaultLayout>{page}</DefaultLayout>
    }
    return page
  },

  setup({ el, App, props }) {
    hydrateRoot(el, <App {...props} />)
  },
})
