import { PropsWithChildren } from 'react'

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <main>
      {children}
      <footer></footer>
    </main>
  )
}
