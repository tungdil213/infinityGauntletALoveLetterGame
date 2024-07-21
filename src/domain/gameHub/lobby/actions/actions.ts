import { inject } from '@adonisjs/core'
import CreateLobbyAction from './create_lobby.js'
import GetLobbyAction from './get_lobby.js'
import JoinLobbyAction from './join_lobby.js'
import LeaveLobbyAction from './leave_lobby.js'
import ListLobbyAction from './list_lobby.js'
import StartLobbyAction from './start_lobby.js'

@inject()
export default class LobbyActions {
  constructor(
    public createLobbyAction: CreateLobbyAction,
    public joinLobbyAction: JoinLobbyAction,
    public leaveLobbyAction: LeaveLobbyAction,
    public startLobbyAction: StartLobbyAction,
    public getLobbyAction: GetLobbyAction,
    public listLobbyAction: ListLobbyAction
  ) {}
}
