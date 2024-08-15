import { BackOfficeHeader } from '#presentation/lib/components/backoffice_header'
import { PropsWithChildren } from 'react'
import Layout from './layout.js'

export default function DefaultLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <Layout>
      <header>
        <BackOfficeHeader />
      </header>
      <article>{children}</article>
    </Layout>
  )
}
