import { _decorator, resources, Asset } from "cc";
import Singleton from "../Base/Singleton";

interface IItem {
    cb: Function;
    ctx: unknown;
}

export class NetworkManager extends Singleton {
    static get Instance() {
        return super.GetInstance<NetworkManager>();
    }

    port = 9876
    ws: WebSocket
    private map: Map<string, Array<IItem>> = new Map();

    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(`ws://localhost:${this.port}`)
            this.ws.onopen = () => {
                console.log('连接成功')
                resolve(true)
            }
            this.ws.onmessage = (event) => {
                console.log('收到服务器消息', event.data)
                try {
                    const json = JSON.parse(event.data)
                    const {name,data} = json
                    if (this.map.has(name)) {
                        this.map.get(name).forEach(({cb,ctx}) => {
                            cb.call(ctx,data)
                        })
                    }
                } catch (error) {
                    console.log('消息格式错误', event.data)
                }
                
            }
            this.ws.onerror = (event) => {
                console.log('连接错误', event)
                reject(false)
            }
            this.ws.onclose = () => {
                console.log('连接关闭')
                reject(false)
            }
        })
    }

    sendMsg(data) {
        this.ws.send(data)
    }

    listenMsg(name: string, cb: Function, ctx: unknown) {
        if (this.map.has(name)) {
            this.map.get(name).push({ cb, ctx });
        } else {
            this.map.set(name, [{ cb, ctx }]);
        }
    }
}
