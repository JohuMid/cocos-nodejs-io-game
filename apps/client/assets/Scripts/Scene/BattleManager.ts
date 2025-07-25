import { _decorator, Component, EventTouch, input, Input, instantiate, log, Node, Prefab, SpriteFrame, UITransform, Vec2 } from 'cc';
import DataManager from '../Global/DataManager';
import { JoyStickManager } from '../UI/JoyStickManager';
import { ResourceManager } from '../Global/ResourceManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { PrefabPathEnum, TexturePathEnum } from '../Enum';
import { EntityTypeEnum, InputTypeEnum } from '../Common';
import { BulletManager } from '../Entity/Bullet/BulletManager';
import { ObjectPoolManager } from '../Global/ObjectPoolManager';
import { NetworkManager } from '../Global/NetworkManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    private stage: Node
    private ui: Node

    private showUpdate = false

    onLoad() {
        DataManager.Instance.stage = this.stage = this.node.getChildByName('Stage')
        this.ui = this.node.getChildByName('UI')
        this.stage.destroyAllChildren()
        DataManager.Instance.jm = this.ui.getComponentInChildren(JoyStickManager)
    }

    async start() {
        await this.connectServer()
        NetworkManager.Instance.sendMsg('hello,ddassadssa')
        NetworkManager.Instance.listenMsg('haha',(data)=>{
            console.log('监听监听',data);

            
        },this)

        // await this.loadRes()
        // this.initMap()
        // this.showUpdate = true
    }
    async connectServer() {
        if (!await NetworkManager.Instance.connect().catch(() => false)) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            this.connectServer()
        }
    }

    async loadRes() {
        const list = []

        for (const type in PrefabPathEnum) {
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefab) => {
                DataManager.Instance.prefabMap.set(type, prefab)
            })
            list.push(p)
        }

        for (const type in TexturePathEnum) {
            const p = ResourceManager.Instance.loadDir(TexturePathEnum[type], SpriteFrame).then((spriteFrames) => {
                DataManager.Instance.textureMap.set(type, spriteFrames)
            })
            list.push(p)
        }

        await Promise.all(list)
    }

    initMap() {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Map)
        const map = instantiate(prefab)
        map.setParent(this.stage)
    }

    update(dt: number): void {
        if (!this.showUpdate) {
            return
        }
        this.render()
        this.tick(dt)
    }

    render() {
        this.renderActor()
        this.renderBullet()
    }

    tick(dt: number) {
        this.tickActor(dt)
        DataManager.Instance.applyInput(
            {
                type: InputTypeEnum.TimePass,
                dt,
            }
        )
    }

    tickActor(dt: number) {
        for (const data of DataManager.Instance.state.actors) {
            const actor = DataManager.Instance.actorMap.get(data.id)
            actor.tick(dt)
        }
    }

    async renderActor() {
        for (const data of DataManager.Instance.state.actors) {
            const { id, type } = data
            let actor = DataManager.Instance.actorMap.get(id)
            if (!actor) {
                const prefab = DataManager.Instance.prefabMap.get(type)
                const actorNode = instantiate(prefab)
                actorNode.setParent(this.stage)
                actor = actorNode.addComponent(ActorManager)
                DataManager.Instance.actorMap.set(id, actor)
                actor.init(data)
            } else {
                actor.render(data)
            }
        }
    }

    renderBullet() {
        for (const data of DataManager.Instance.state.bullets) {
            const { id, type } = data
            let bm = DataManager.Instance.bulletMap.get(id)
            if (!bm) {
                const bullet = ObjectPoolManager.Instance.get(type)
                bm = bullet.getComponent(BulletManager) || bullet.addComponent(BulletManager)
                DataManager.Instance.bulletMap.set(data.id, bm)
                bm.init(data)
            } else {
                bm.render(data)
            }
        }
    }
}
