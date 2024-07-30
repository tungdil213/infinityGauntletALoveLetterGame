import { LobbyInterface } from '#domain/gameHub/lobby/entities/lobby_interface'
import LobbyRepository from '#domain/gameHub/lobby/repositories/lobby_repository'
import ResourceNotFoundException from '#infrastructure/exceptions/resource_not_found_exception'
import { errors } from '@adonisjs/core'

export class InMemoryLobbyRepository implements LobbyRepository {
  private lobbies: Map<string, LobbyInterface> = new Map()

  async save(lobby: LobbyInterface): Promise<void> {
    this.lobbies.set(lobby.id, lobby)
  }

  async findById(id: string): Promise<LobbyInterface> {
    const lobby = this.lobbies.get(id)

    if (!lobby) {
      throw new ResourceNotFoundException(`Lobby with id ${id} not found`)
    }

    return lobby
  }

  async findAll(): Promise<LobbyInterface[]> {
    if (this.lobbies.size === 0) {
      throw new errors.E_HTTP_EXCEPTION('No lobbies found')
    }

    console.log('this.lobbies', this.lobbies)

    return [...this.lobbies.values()]
  }
}
