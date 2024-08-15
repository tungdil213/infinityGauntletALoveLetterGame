import { PlayerInterface } from '../../domain/entities/player_interface.js'
import PlayerRepository from '../../domain/repositories/player_repository.js'
export class InMemoryPlayerRepository extends PlayerRepository {
  private players: Map<string, PlayerInterface> = new Map()

  async findAll(): Promise<PlayerInterface[]> {
    // Retourne toutes les joueurs sous forme de tableau
    return Array.from(this.players.values())
  }

  async findByUUID(playerUUID: string): Promise<PlayerInterface> {
    const player = this.players.get(playerUUID)
    if (!player) {
      throw new Error(`Player with UUID ${playerUUID} not found`)
    }
    return player
  }

  async save(player: PlayerInterface): Promise<void> {
    // Met à jour ou ajoute le joueur dans la Map
    this.players.set(player.uuid, player)
  }
}
