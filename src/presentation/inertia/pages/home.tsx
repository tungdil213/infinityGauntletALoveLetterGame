import { Head } from '@inertiajs/react'
import React from 'react'

export default function Home(props: Readonly<{ version: number }>) {
  const [count, setCount] = React.useState(0)

  return (
    <>
      <Head title="Homepage" />

      <div className="container">
        <div className="title">AdonisJS {props.version} x Inertia x React</div>
        <button className="btn btn-primary" onClick={() => setCount((e) => e + 1)}>
          Click me
        </button>
        {count}
        <span>
          Learn more about AdonisJS and Inertia.js by visiting the{' '}
          <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS documentation</a>.
        </span>
      </div>
    </>
  )
}
