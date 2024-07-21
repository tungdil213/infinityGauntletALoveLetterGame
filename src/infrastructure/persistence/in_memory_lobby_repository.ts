import { LobbyInterface } from '#domain/gameHub/lobby/entities/lobby_interface'
import LobbyRepository from '#domain/gameHub/lobby/repositories/lobby_repository'

export class InMemoryLobbyRepository implements LobbyRepository {
  private lobbies: Map<string, LobbyInterface> = new Map()

  async save(lobby: LobbyInterface): Promise<void> {
    this.lobbies.set(lobby.id, lobby)
  }

  async findById(id: string): Promise<LobbyInterface> {
    return this.lobbies.get(id)!
  }

  async findAll(): Promise<LobbyInterface[]> {
    return Array.from(this.lobbies.values())
  }
}
