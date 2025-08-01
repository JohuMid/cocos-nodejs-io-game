import { WebSocket } from "ws";
import { MyServer } from "./MyServer";
import { EventEmitter } from "stream";
import { IModel } from "../Common";

interface IItem {
    cb: Function;
    ctx: unknown;
}

export class Connection extends EventEmitter {

    private msgMap: Map<string, Array<IItem>> = new Map();

    constructor(private server: MyServer, private ws: WebSocket) {
        super()

        this.ws.on('close', () => {
            this.server.connections.delete(this)
            this.emit('close')
        })

        this.ws.on('message', (buffer) => {
            const str = buffer.toString()
            try {
                const msg = JSON.parse(str)
                const { name, data } = msg
                if (this.server.apiMap.has(name)) {
                    try {
                        const cb = this.server.apiMap.get(name)
                        const res = cb.call(null, this, data)
                        this.sendMsg(name, {
                            success: true,
                            res
                        })
                    } catch (e) {
                        this.sendMsg(name, {
                            success: false,
                            error: e.message
                        })
                    }
                } else {
                    try {
                        if (this.msgMap.has(name)) {
                            this.msgMap.get(name).forEach(({ cb, ctx }) => {
                                cb.call(ctx, this, data)
                            })
                        }
                    } catch (e) {
                        console.log('消息处理错误', e);
                    }
                }
            } catch (error) {
                console.log('消息格式错误', str)
            }
        })
    }

    sendMsg<T extends keyof IModel["msg"]>(name: T, data: IModel["msg"][T]) {
        const msg = {
            name,
            data
        }
        this.ws.send(JSON.stringify(msg))
    }

    listenMsg<T extends keyof IModel["msg"]>(name: T, cb: (connection: Connection, args: IModel["msg"][T]) => void, ctx: unknown) {
        if (this.msgMap.has(name)) {
            this.msgMap.get(name).push({ cb, ctx });
        } else {
            this.msgMap.set(name, [{ cb, ctx }]);
        }
    }
    unlistenMsg<T extends keyof IModel["msg"]>(name: T, cb: (connection: Connection, args: IModel["msg"][T]) => void, ctx: unknown) {
        if (this.msgMap.has(name)) {
            const index = this.msgMap.get(name).findIndex((i) => cb === i.cb && i.ctx === ctx);
            index > -1 && this.msgMap.get(name).splice(index, 1);
        }
    }
}