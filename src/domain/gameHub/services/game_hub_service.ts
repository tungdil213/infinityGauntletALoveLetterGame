import PlayerServiceInterface from '#domain/basic/players/services/player_service_interface'
import { GameEntity } from '#domain/game/entities/game_entity'
import GameRepositoryInterface from '#domain/game/repositories/lobby_repository_interface'
import { inject } from '@adonisjs/core'
import { LobbyEntity } from '../lobby/entities/lobby_entity.js'
import LobbyRepository from '../lobby/repositories/lobby_repository.js'
import GameHubServiceInterface from './game_hub_service_interface.js'

@inject()
export class GameHubService implements GameHubServiceInterface {
  constructor(
    private lobbyRepository: LobbyRepository,
    private gameRepository: GameRepositoryInterface,
    private playerService: PlayerServiceInterface
  ) {}

  async createLobby(playerId: string): Promise<string> {
    const lobby = new LobbyEntity(playerId)
    await this.lobbyRepository.save(lobby)
    return lobby.id
  }

  async joinLobby(lobbyId: string, playerId: string): Promise<void> {
    const lobby = await this.lobbyRepository.findById(lobbyId)
    const player = await this.playerService.findById(playerId)
    lobby.addPlayer(player)
    await this.lobbyRepository.save(lobby)
  }

  async startGame(lobbyId: string): Promise<void> {
    const lobby = await this.lobbyRepository.findById(lobbyId)
    const game = new GameEntity(lobby.players[0])
    await this.gameRepository.save(game)
    lobby.startGame(game.id)
    await this.lobbyRepository.save(lobby)
  }

  async listGames(status?: string): Promise<Game[]> {
    return this.gameRepository.findByStatus(status)
  }
}
