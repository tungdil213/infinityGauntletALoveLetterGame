import User from '#models/user'
import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatarUrl: faker.image.avatar(),
      emailVerifiedAt: DateTime.fromJSDate(faker.date.past()),
    }
  })
  .build()
