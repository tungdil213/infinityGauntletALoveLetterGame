import { TeamInterface } from '../entities/team_interface.js'
import { TeamService } from '../services/team_service.js'

export class LoseLife {
  constructor(private team: TeamInterface) {}

  private handle() {
    return TeamService.loseLife(this.team)
  }
}
