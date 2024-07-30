import { LobbyInterface } from '../entities/lobby_interface.js'

export default abstract class LobbyRepository {
  abstract save(lobby: LobbyInterface): Promise<void>
  abstract findById(id: number): Promise<LobbyInterface>
  abstract findByUuid(uuid: string): Promise<LobbyInterface>
  abstract findAll(): Promise<LobbyInterface[]>
}
