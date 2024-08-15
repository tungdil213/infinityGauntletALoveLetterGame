import { PropsWithChildren } from 'react'
export function AuthContainer({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="bg-background relative flex items-center justify-center h-screen w-full">
      {children}
    </div>
  )
}
