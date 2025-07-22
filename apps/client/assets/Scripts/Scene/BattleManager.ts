import { _decorator, Component, EventTouch, input, Input, instantiate, log, Node, Prefab, UITransform, Vec2 } from 'cc';
import DataManager from '../Global/DataManager';
import { JoyStickManager } from '../UI/JoyStickManager';
import { ResourceManager } from '../Global/ResourceManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { PrefabPathEnum } from '../Enum';
import { EntityTypeEnum } from '../Common';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    private stage: Node
    private ui: Node

    private showUpdate = false

    onLoad() {
        this.stage = this.node.getChildByName('Stage')
        this.ui = this.node.getChildByName('UI')
        this.stage.destroyAllChildren()
        DataManager.Instance.jm = this.ui.getComponentInChildren(JoyStickManager)
    }

    async start() {
        await this.loadRes()
        this.initMap()
        this.showUpdate = true
    }

    async loadRes() {
        const list = []

        for (const type in PrefabPathEnum) {
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefab) => {
                DataManager.Instance.prefabMap.set(type, prefab)
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
    }

    render() {
        this.renderActor()
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
}
