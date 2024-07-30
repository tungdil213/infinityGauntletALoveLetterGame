import { PlayerInterface } from '#domain/basic/players/entities/basic_player_interface'
import { GameLobbyStatus } from '#domain/gameHub/lobby/types/game_lobby_status'
import Lobby from '#infrastructure/database/models/lobby'
import { LobbyInterface } from '../entities/lobby_interface.js'

export class SingleLobbyPresenter {
  static json(lobby: Lobby): LobbyInterface {
    return {
      uuid: lobby.uuid,
      name: lobby.name,
      players: lobby.players.map((player) => player.toJSON()) as PlayerInterface[],
      status: lobby.status as GameLobbyStatus,
    }
  }
}
