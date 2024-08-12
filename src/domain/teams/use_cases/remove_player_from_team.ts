import { TeamInterface } from '../entities/team_interface.js'
import { TeamService } from '../services/team_service.js'

export class RemovePlayerFromTeam {
  constructor(
    private team: TeamInterface,
    private playerId: string
  ) {}

  private handle() {
    return TeamService.removePlayer(this.team, this.playerId)
  }
}
