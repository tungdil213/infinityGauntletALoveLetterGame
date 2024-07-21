import { PlayerInterface } from '#domain/players/entities/player_interface'
import { TeamInterface } from '../entities/team_interface.js'
import { TeamService } from '../services/team_service.js'

export class AddPlayerToTeam {
  constructor(
    private team: TeamInterface,
    private player: PlayerInterface
  ) {}

  handle() {
    return TeamService.addPlayer(this.team, this.player)
  }
}
