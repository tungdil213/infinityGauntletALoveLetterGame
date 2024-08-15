import { Head, Link, useForm } from '@inertiajs/react'
import { AuthContainer } from './_components/auth_container.js'

export default function SignInPage() {
  const form = useForm({
    lastName: '',
    firstName: '',
    nickName: '',
    email: '',
    password: '',
  })

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.post('/register')
  }
  return (
    <AuthContainer>
      <Head title="Sign up" />
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="firstName">Firstname</label>
          <input
            id="firstName"
            placeholder="John"
            required
            disabled={form.processing}
            value={form.data.firstName}
            onChange={(e) => form.setData('firstName', e.target.value)}
          />
          <small>{form.errors?.firstName}</small>
        </div>

        <div className="grid gap-2">
          <label htmlFor="lastName">Lastname</label>
          <input
            id="lastName"
            placeholder="Doe"
            required
            disabled={form.processing}
            value={form.data.lastName}
            onChange={(e) => form.setData('lastName', e.target.value)}
          />
          <small>{form.errors?.lastName}</small>
        </div>

        <div className="grid gap-2">
          <label htmlFor="nickName">NickName</label>
          <input
            id="nickName"
            placeholder="JoD"
            required
            disabled={form.processing}
            value={form.data.nickName}
            onChange={(e) => form.setData('nickName', e.target.value)}
          />
          <small>{form.errors?.lastName}</small>
        </div>

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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            disabled={form.processing}
            value={form.data.password}
            onChange={(e) => form.setData('password', e.target.value)}
          />
          <small>{form.errors?.password}</small>
        </div>
        <button id="registerButton" type="submit" className="w-full">
          Register
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

      <p className="text-xs text-slate-11 font-normal mt-4">
        By signing up, you agree to our{' '}
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          href="/legal/terms-of-service"
        >
          terms
        </Link>
        ,{' '}
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          href="/legal/acceptable-use"
        >
          acceptable use
        </Link>
        , and{' '}
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          href="/legal/privacy-policy"
        >
          privacy policy
        </Link>
        .
      </p>
    </AuthContainer>
  )
}
