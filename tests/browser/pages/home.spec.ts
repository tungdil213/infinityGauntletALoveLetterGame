import { test } from '@japa/runner'
import type { TestContext } from '@japa/runner/core'

test.group('Pages home', () => {
  test('example test', async ({ visit }: TestContext) => {
    const page = await visit('/')
    await page.assertTextContains('body', 'AdonisJS 6 x Inertia x React')
  })
})
