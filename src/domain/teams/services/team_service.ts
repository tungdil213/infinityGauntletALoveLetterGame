import { PlayerInterface } from '#domain/players/entities/player_interface'
import { TeamInterface } from '../entities/team_interface.js'

export class TeamService {
  static addPlayer(team: TeamInterface, player: PlayerInterface): TeamInterface {
    team.players.push(player)
    return team
  }

  static loseLife(team: TeamInterface): TeamInterface {
    team.lives -= 1
    return team
  }

  static removePlayer(team: TeamInterface, playerId: string): TeamInterface {
    team.players = team.players.filter((player) => player.id !== playerId)
    return team
  }
}
