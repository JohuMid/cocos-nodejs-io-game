import { PlayerManager } from "./Biz/PlayerManager";
import { RoomManager } from "./Biz/RoomManager";
import { ApiMsgEnum, IApiGameStartReq, IApiGameStartRes, IApiPlayerJoinReq, IApiPlayerJoinRes, IApiPlayerListReq, IApiPlayerListRes, IApiRoomCreateReq, IApiRoomCreateRes, IApiRoomJoinReq, IApiRoomJoinRes, IApiRoomLeaveReq, IApiRoomLeaveRes, IApiRoomListReq, IApiRoomListRes, RoomStateEnum } from "./Common";
import { Connection, MyServer } from "./Core";
import { symlinkCommon } from "./Utils";

import { WebSocketServer } from 'ws'

symlinkCommon();

declare module "./Core" {
    interface Connection {
        playerId: number
    }
}

const server = new MyServer({
    port: 9876
})

server.on("connection", (connection: Connection) => {
    console.log("来人了", server.connections.size);

})

server.on("disconnection", (connection: Connection) => {
    console.log("走了", server.connections.size);
    if (connection.playerId) {
        PlayerManager.Instance.removePlayer(connection.playerId)
    }
    PlayerManager.Instance.syncPlayers()

})

server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection: Connection, data: IApiPlayerJoinReq): IApiPlayerJoinRes => {
    const { nickname } = data
    const player = PlayerManager.Instance.createPlayer({
        nickname: nickname,
        connection
    })
    connection.playerId = player.id

    PlayerManager.Instance.syncPlayers()

    return {
        player: PlayerManager.Instance.getPlayerView(player)
    }
})

server.setApi(ApiMsgEnum.ApiPlayerList, (connection: Connection, data: IApiPlayerListReq): IApiPlayerListRes => {
    return {
        list: PlayerManager.Instance.getPlayersView()
    }
})

server.setApi(ApiMsgEnum.ApiRoomList, (connection: Connection, data: IApiRoomListReq): IApiRoomListRes => {
    return {
        list: RoomManager.Instance.getRoomsView()
    }
})


server.setApi(ApiMsgEnum.ApiRoomCreate, (connection: Connection, data: IApiRoomCreateReq): IApiRoomCreateRes => {
    if (connection.playerId) {
        const newroom = RoomManager.Instance.createRoom()
        const room = RoomManager.Instance.joinRoom(newroom.id, connection.playerId)

        if (room) {
            PlayerManager.Instance.syncPlayers()
            RoomManager.Instance.syncRooms()
            return {
                room: RoomManager.Instance.getRoomView(room)
            }
        } else {
            throw new Error('创建房间失败')
        }
    } else {
        throw new Error('请先登录')
    }

})

server.setApi(ApiMsgEnum.ApiRoomJoin, (connection: Connection, { rid }: IApiRoomJoinReq): IApiRoomJoinRes => {
    if (connection.playerId) {
        const room = RoomManager.Instance.joinRoom(rid, connection.playerId)

        if (room) {
            PlayerManager.Instance.syncPlayers()
            RoomManager.Instance.syncRooms()
            RoomManager.Instance.syncRoom(rid)
            return {
                room: RoomManager.Instance.getRoomView(room)
            }
        } else {
            throw new Error('加入房间失败')
        }
    } else {
        throw new Error('请先登录')
    }

})

server.setApi(ApiMsgEnum.ApiRoomLeave, (connection: Connection, data: IApiRoomLeaveReq): IApiRoomLeaveRes => {
    if (connection.playerId) {
        const player = PlayerManager.Instance.idMapPlayer.get(connection.playerId)
        if (player) {
            const rid = player.rid

            if (rid) {
                RoomManager.Instance.leaveRoom(rid, player.id)
                PlayerManager.Instance.syncPlayers()
                RoomManager.Instance.syncRooms()
                RoomManager.Instance.syncRoom(rid)
                return {}
            } else {
                throw new Error('玩家未加入房间')
            }
        } else {
            throw new Error('玩家不存在')
        }
    } else {
        throw new Error('请先登录')
    }

})

server.setApi(ApiMsgEnum.ApiGameStart, (connection: Connection, data: IApiGameStartReq): IApiGameStartRes => {
    if (connection.playerId) {
        const player = PlayerManager.Instance.idMapPlayer.get(connection.playerId)
        if (player) {
            // 房间人数大于1才能开始游戏
            const room = RoomManager.Instance.idMapRoom.get(player.rid)
            if (room) {
                if (room.players.size <= 1) {
                    throw new Error('房间人数不足')
                }
            }

            const rid = player.rid

            if (rid) {
                RoomManager.Instance.startGame(rid)
                PlayerManager.Instance.syncPlayers()
                // 将房间的状态设置为游戏中
                RoomManager.Instance.idMapRoom.get(rid).state = RoomStateEnum.Gameing
                RoomManager.Instance.syncRooms()
                RoomManager.Instance.syncRoom(rid)
                return {}
            } else {
                throw new Error('玩家未加入房间')
            }
        } else {
            throw new Error('玩家不存在')
        }
    } else {
        throw new Error('请先登录')
    }

})

server.start().then(() => {
    console.log('服务启动成功');
}).catch((e) => {
    console.log('服务启动失败', e);
})

/* const wss = new WebSocketServer({
    port: 9876
})

let inputs = []

wss.on('connection', (socket) => {
    socket.on('message', (buffer) => {
        console.log('message', buffer.toString());
        const str = buffer.toString()
        try {
            const msg = JSON.parse(str)
            const { name, data } = msg
            const { frameId, input } = data
            inputs.push(input)
        } catch (error) {
            console.log('消息格式错误', str)
        }
    })

    setInterval(() => {
        const temp = inputs
        inputs = []
        const msg = {
            name: ApiMsgEnum.MsgServerSync,
            data: {
                inputs: temp
            }
        }

        socket.send(JSON.stringify(msg))
    }, 100)
})

wss.on('listening', () => {
    console.log('服务启动成功');
})
 */