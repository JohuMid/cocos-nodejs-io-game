import { _decorator, resources, Asset, error } from "cc";
import Singleton from "../Base/Singleton";
import { IModel } from "../Common";

interface IItem {
    cb: Function;
    ctx: unknown;
}

interface ICallApiRet<T> {
    success: boolean,
    res?: T,
    error?: Error
}

export class NetworkManager extends Singleton {
    static get Instance() {
        return super.GetInstance<NetworkManager>();
    }

    isConnected = false
    port = 9876
    ws: WebSocket
    private map: Map<string, Array<IItem>> = new Map();

    connect() {
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                resolve(true)
                return
            }
            this.ws = new WebSocket(`ws://localhost:${this.port}`)
            this.ws.onopen = () => {
                console.log('连接成功')
                this.isConnected = true
                resolve(true)
            }
            this.ws.onmessage = (event) => {
                console.log('收到服务器消息', event.data)
                try {
                    const json = JSON.parse(event.data)
                    const { name, data } = json
                    if (this.map.has(name)) {
                        this.map.get(name).forEach(({ cb, ctx }) => {
                            cb.call(ctx, data)
                        })
                    }
                } catch (error) {
                    console.log('消息格式错误', event.data)
                }

            }
            this.ws.onerror = (event) => {
                console.log('连接错误', event)
                this.isConnected = false
                reject(false)
            }
            this.ws.onclose = () => {
                console.log('连接关闭')
                this.isConnected = false
                reject(false)
            }
        })
    }

    callApi<T extends keyof IModel["api"]>(name: T, data: IModel["api"][T]["req"]): Promise<ICallApiRet<IModel["api"][T]["res"]>> {
        return new Promise((resolve, reject) => {
            try {
                const timer = setTimeout(() => {
                    resolve({ success: false, error: new Error('超时') })
                }, 5000);
                const cb = (res) => {
                    resolve(res)
                    clearTimeout(timer)
                    this.unlistenMsg(name as any, cb, null)
                }
                this.listenMsg(name as any, cb, null)
                this.sendMsg(name as any, data)
            } catch (error) {
                resolve({ success: false, error: new Error('超时') })
            }
        })
    }

    async sendMsg<T extends keyof IModel["msg"]>(name: T, data: IModel["msg"][T]) {
        const msg = {
            name,
            data
        }

        await new Promise(resolve => setTimeout(resolve, 2000))
        this.ws.send(JSON.stringify(msg))
    }

    listenMsg<T extends keyof IModel["msg"]>(name: T, cb: (args: IModel["msg"][T]) => void, ctx: unknown) {
        if (this.map.has(name)) {
            this.map.get(name).push({ cb, ctx });
        } else {
            this.map.set(name, [{ cb, ctx }]);
        }
    }
    unlistenMsg<T extends keyof IModel["msg"]>(name: T, cb: (args: IModel["msg"][T]) => void, ctx: unknown) {
        if (this.map.has(name)) {
            const index = this.map.get(name).findIndex((i) => cb === i.cb && i.ctx === ctx);
            index > -1 && this.map.get(name).splice(index, 1);
        }
    }
}
