import { PlayerManager } from "./Biz/PlayerManager";
import { ApiMsgEnum, IApiPlayerJoinReq, IApiPlayerJoinRes, IApiPlayerListReq, IApiPlayerListRes } from "./Common";
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