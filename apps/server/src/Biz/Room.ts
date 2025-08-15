import { ApiMsgEnum, EntityTypeEnum, IClientInput, IMsgClientSync, InputTypeEnum, IState, RoomStateEnum, toFixed } from "../Common"
import { Connection } from "../Core"
import { Player } from "./Player"
import { PlayerManager } from "./PlayerManager"
import { RoomManager } from "./RoomManager"

export class Room {
    id: number
    players: Set<Player> = new Set()

    pendingInput: IClientInput[] = []
    lastPlayerFrameIdMap: Map<number, number> = new Map()

    state: RoomStateEnum = RoomStateEnum.Wait

    lastTime: number

    constructor(rid: number) {
        this.id = rid
    }

    join(uid: number) {
        const player = PlayerManager.Instance.idMapPlayer.get(uid)
        if (player) {
            player.rid = this.id
            this.players.add(player)
        }
    }

    leave(uid: number) {
        const player = PlayerManager.Instance.idMapPlayer.get(uid)
        if (player) {
            player.rid = undefined
            this.players.delete(player)
            if (!this.players.size) {
                RoomManager.Instance.closeRoom(this.id)
            }
        }
    }

    close() {
        this.players.clear()
    }

    sync() {
        for (const player of this.players) {
            player.connection.sendMsg(ApiMsgEnum.MsgRoom, {
                room: RoomManager.Instance.getRoomView(this)
            })
        }
    }

    start() {
        const createPos = (index) => {
            if (index === 0) {
                return {
                    x: -220,
                    y: 220,
                }
            } else if (index === 1) {
                return {
                    x: 220,
                    y: 220,
                }
            } else if (index === 2) {
                return {
                    x: 220,
                    y: -220,
                }
            } else if (index === 3) {
                return {
                    x: -220,
                    y: -220,
                }
            }
            return {
                x: 0,
                y: 0,
            }
        }

        const state: IState = {
            actors: [...this.players].map((player, index) => (
                {
                    id: player.id,
                    nickname: player.nickname,
                    hp: 100,
                    type: EntityTypeEnum.Actor1,
                    weaponType: EntityTypeEnum.Weapon1,
                    bulletType: EntityTypeEnum.Bullet2,
                    //四个玩家分布在四个角
                    position: createPos(index),
                    direction: {
                        x: 1,
                        y: 0,
                    }
                }
            )),
            bullets: [],
            nextBulletId: 1,
            seed: 1,
        }
        for (const player of this.players) {
            player.connection.sendMsg(ApiMsgEnum.MsgGameStart, {
                state,
            })

            player.connection.listenMsg(ApiMsgEnum.MsgClientSync, this.getClientMsg, this)
        }
        const timer1 = setInterval(() => {
            this.sendServerMsg()
        }, 100)

        const timer2 = setInterval(() => {
            this.timePast()
        }, 16)
    }

    getClientMsg(connection: Connection, { input, frameId }: IMsgClientSync) {
        this.pendingInput.push(input)
        this.lastPlayerFrameIdMap.set(connection.playerId, frameId)
    }

    sendServerMsg() {
        const inputs = this.pendingInput
        this.pendingInput = []

        for (const player of this.players) {
            player.connection.sendMsg(ApiMsgEnum.MsgServerSync, {
                lastFrameId: this.lastPlayerFrameIdMap.get(player.id) ?? 0,
                inputs: inputs,
            })
        }
    }

    timePast() {
        const now = process.uptime()
        const dt = now - (this.lastTime ?? now)
        this.pendingInput.push({ type: InputTypeEnum.TimePast, dt: toFixed(dt) })

        this.lastTime = now
    }
}