import { symlinkCommon } from "./Utils";

import { WebSocketServer } from 'ws'

symlinkCommon();

const wss = new WebSocketServer({
    port: 9876
})

wss.on('connection', (socket) => {
    socket.on('message', (buffer) => {
        console.log('message', buffer.toString());
    })

    const obj = {
        name:'haha',
        data:"haha123",
        type:'haha'
    }

    socket.send(JSON.stringify(obj))
})

wss.on('listening', () => {
    console.log('服务启动成功');
})
