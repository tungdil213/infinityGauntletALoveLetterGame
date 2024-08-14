export default class PlayerInfo {
  private _name: string
  private _preferredColour: string

  constructor(name?: string, preferredColour?: string) {
    this._name = name ?? ''
    this._preferredColour = preferredColour ?? ''
  }

  get name(): string {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }

  get preferredColour(): string {
    return this._preferredColour
  }

  set preferredColour(value: string) {
    this._preferredColour = value
  }
}
