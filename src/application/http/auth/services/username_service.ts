import string from '@adonisjs/core/helpers/string'
import db from '@adonisjs/lucid/services/db'

export default class UsernameService {
  private extractIncrementors(occurances: any[]): number[] {
    return occurances
      .map((o) => o.username.match(/-\d+$/)?.at(0).replace('-', ''))
      .filter(Boolean)
      .map((o) => Number.parseInt(o))
  }

  private async findUsernameOccurances(username: string): Promise<any[]> {
    return db.from('users').where('username', 'LIKE', `${username}%`)
  }

  private slugifyUsername(username: string): string {
    return string.slug(username, { lower: true, strict: true })
  }

  async getUniqueUsername(username: string) {
    if (typeof username !== 'string') {
      username = username + ''
    }

    username = this.slugifyUsername(username)
    const occurances = await this.findUsernameOccurances(username)
    const incrementors = this.extractIncrementors(occurances)
    const maxIncrementor = incrementors.length ? Math.max(...incrementors) : occurances.length

    return occurances.length ? `${username}-${maxIncrementor + 1}` : username
  }
}
