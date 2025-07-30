import { WebSocketServer, WebSocket } from 'ws'
import { Connection } from './Connection'
import { ApiMsgEnum } from '../Common'
export class MyServer {
    port: number
    wss: WebSocketServer

    apiMap: Map<ApiMsgEnum, Function> = new Map()

    connections: Set<Connection> = new Set()
    constructor({ port }: { port: number }) {
        this.port = port
    }
    start() {
        return new Promise((resolve, reject) => {
            this.wss = new WebSocketServer({
                port: this.port
            })

            this.wss.on('listening', (socket) => {
                resolve(true)
            })
            this.wss.on('close', (socket) => {
                resolve(false)
            })
            this.wss.on('error', (e) => {
                resolve(e)
            })
            this.wss.on('connection', (ws: WebSocket) => {
                const connection = new Connection(this, ws)
                this.connections.add(connection)
                console.log('来人啊', this.connections.size);

                connection.on('close', () => {
                    console.log('走了', this.connections.size);

                    this.connections.delete(connection)
                })
            })
        })
    }

    setApi(name: ApiMsgEnum, cb: Function) {
        this.apiMap.set(name, cb)
    }
}