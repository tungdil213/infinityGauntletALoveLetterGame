import { Head, Link, useForm } from '@inertiajs/react'
import { AuthContainer } from './_components/auth_container'

export default function SignInPage() {
  const form = useForm({
    email: '',
    password: '',
  })

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.post(window.location.href)
  }

  return (
    <AuthContainer>
      <Head title="Sign in" />
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={form.processing}
            value={form.data.email}
            onChange={(e) => form.setData('email', e.target.value)}
          />
          <small>{form.errors?.email}</small>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-blue-500 text-sm">
              Forgot your password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            disabled={form.processing}
            value={form.data.password}
            onChange={(e) => form.setData('password', e.target.value)}
          />
          <small>{form.errors?.password}</small>
        </div>
        <button id="loginButton" type="submit" className="w-full">
          Sign In
        </button>
        <div className="mb-6 mt-6 flex items-center justify-center">
          <div
            aria-hidden="true"
            className="h-px w-full bg-primary-foreground"
            data-orientation="horizontal"
            role="separator"
          ></div>
          <span className="mx-4 text-xs text-primary font-normal">OR</span>
          <div
            aria-hidden="true"
            className="h-px w-full bg-primary-foreground"
            data-orientation="horizontal"
            role="separator"
          ></div>
        </div>
      </form>
    </AuthContainer>
  )
}
