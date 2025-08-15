import Singleton from "../Base/Singleton";
import { ApiMsgEnum, RoomStateEnum } from "../Common";
import { PlayerManager } from "./PlayerManager";
import { Room } from "./Room";
import { MAX_PLAYER_COUNT } from "../Common";

export class RoomManager extends Singleton {
    static get Instance() {
        return super.GetInstance<RoomManager>();
    }

    nextRoomId = 1

    rooms: Set<Room> = new Set()
    idMapRoom: Map<number, Room> = new Map()

    createRoom() {
        const room = new Room(this.nextRoomId++)
        this.rooms.add(room)
        this.idMapRoom.set(room.id, room)
        return room
    }

    joinRoom(rid: number, uid: number) {
        const room = this.idMapRoom.get(rid)
        if (room.state === RoomStateEnum.Gameing) {
            throw new Error('房间已开始游戏')
        }
        if (room.players.size >= MAX_PLAYER_COUNT) {

            throw new Error('房间已满')
        }
        if (room) {
            room.join(uid)
            return room
        }
    }

    leaveRoom(rid: number, uid: number) {
        const room = this.idMapRoom.get(rid)
        if (room) {
            room.leave(uid)
        }
    }

    closeRoom(rid: number) {
        const room = this.idMapRoom.get(rid)
        if (room) {
            room.close()
            this.rooms.delete(room)
            this.idMapRoom.delete(rid)
        }
    }

    startGame(rid: number) {
        const room = this.idMapRoom.get(rid)
        if (room) {
            room.start()
        }
    }

    /*
 
    syncPlayers() {
        for (const player of this.players) {
            player.connection.sendMsg(ApiMsgEnum.MsgPlayerList, {
                list: this.getPlayersView()
            })
        }
    }
 */

    syncRooms() {
        for (const player of PlayerManager.Instance.players) {
            player.connection.sendMsg(ApiMsgEnum.MsgRoomList, {
                list: this.getRoomsView()
            })
        }
    }

    syncRoom(rid: number) {
        const room = this.idMapRoom.get(rid)
        if (room) {
            room.sync()
        }
    }

    getRoomsView(rooms: Set<Room> = this.rooms) {
        return [...rooms].map(p => this.getRoomView(p))
    }

    getRoomView({ id, state, players }: Room) {
        return {
            id,
            state,
            players: PlayerManager.Instance.getPlayersView(players)
        }
    }
}
