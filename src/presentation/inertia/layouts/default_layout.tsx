import { PropsWithChildren } from 'react'
import { BackOfficeHeader } from '../components/backoffice_header'
import Layout from './layout'

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
