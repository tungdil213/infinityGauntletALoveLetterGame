import { Head, useForm } from '@inertiajs/react'

import Spinner from '#presentation/inertia/components/spinner'
import { AuthContainer } from './_components/auth_container'

export default function SignInPage() {
  const form = useForm({
    newPassword: '',
    confirmPassword: '',
  })

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.post(window.location.href)
  }

  return (
    <AuthContainer>
      <Head title="Reset password" />

      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email">New Password</label>
          <input
            id="email"
            type="password"
            placeholder="••••••••••••"
            required
            disabled={form.processing}
            value={form.data.newPassword}
            onChange={(e) => form.setData('newPassword', e.target.value)}
          />
          <small>{form.errors?.newPassword}</small>
        </div>

        <div className="grid gap-2">
          <label htmlFor="email">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••••••"
            required
            disabled={form.processing}
            value={form.data.confirmPassword}
            onChange={(e) => form.setData('confirmPassword', e.target.value)}
          />
          <small>{form.errors?.confirmPassword}</small>
        </div>

        <button type="submit" disabled={form.processing}>
          {form.processing && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Reset Password
        </button>
      </form>
    </AuthContainer>
  )
}
