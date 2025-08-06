import { _decorator, Component, EventTouch, input, Input, instantiate, Label, log, Node, ProgressBar, tween, Tween, UITransform, Vec2, Vec3 } from 'cc';
import DataManager from '../../Global/DataManager';
import { EntityTypeEnum, InputTypeEnum } from '../../Common/Enum';
import { IActor } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { ActorStateMachine } from './ActorStateMachine';
import { EntityStateEnum, EventEnum } from '../../Enum';
import { WeaponManager } from '../Weapon/WeaponManager';
import { rad2Angle } from '../../Utils';
import { toFixed } from '../../Common/Utils';
import EventManager from '../../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends EntityManager {
    bulletType: EntityTypeEnum
    id: number

    private hp: ProgressBar
    private actorName: Label
    private targetPos: Vec3
    private tw: Tween<Node>
    private wm: WeaponManager
    init(data: IActor) {
        this.hp = this.node.getComponentInChildren(ProgressBar)
        this.actorName = this.node.getComponentInChildren(Label)
        this.id = data.id
        this.bulletType = data.bulletType
        this.fsm = this.addComponent(ActorStateMachine)
        this.fsm.init(data.type)

        this.state = EntityStateEnum.Idle
        this.node.active = false
        this.targetPos = undefined

        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1)
        const weapon = instantiate(prefab)
        weapon.setParent(this.node)
        this.wm = weapon.addComponent(WeaponManager)
        this.wm.init(data)
    }

    tick(dt: number): void {
        if (this.id !== DataManager.Instance.myPlayerId) {
            return
        }
        if (DataManager.Instance.jm.input.length()) {
            const { x, y } = DataManager.Instance.jm.input
            EventManager.Instance.emit(EventEnum.ClientSync, {
                id: DataManager.Instance.myPlayerId,
                type: InputTypeEnum.ActorMove,
                direction: {
                    x: toFixed(x),
                    y: toFixed(y)
                },
                dt: toFixed(dt),
            })
        } else {
            this.state = EntityStateEnum.Idle
        }
    }

    render(data: IActor) {
        this.renderActorName(data)
        this.renderHp(data)
        this.renderDire(data)
        this.renderPosition(data)
    }

    renderPosition(data: IActor) {
        const { x: px, y: py } = data.position;
        const newPos = new Vec3(px, py)
        if (!this.targetPos) {
            this.node.active = true
            this.node.setPosition(newPos)
            this.targetPos = new Vec3(newPos)
        } else if (!this.targetPos.equals(newPos)) {
            this.tw?.stop()
            this.node.setPosition(this.targetPos)
            this.targetPos.set(newPos)
            this.state = EntityStateEnum.Run
            this.tw = tween(this.node).to(0.1, {
                position: this.targetPos
            }).call(() => {
                this.state = EntityStateEnum.Idle
            }).start()
        }
        // this.node.setPosition(px, py)
    }

    renderDire(data: IActor) {
        const { x, y } = data.direction;
        if (x !== 0) {
            this.node.setScale(x > 0 ? 1 : -1, 1);
            this.hp.node.setScale(x > 0 ? 1 : -1, 1);
            this.actorName.node.setScale(x > 0 ? 1 : -1, 1);
        }
        const side = Math.sqrt(x * x + y * y);
        const angle = rad2Angle(Math.asin(y / side));
        this.wm.node.setRotationFromEuler(0, 0, angle)
    }

    renderHp(data: IActor) {
        this.hp.progress = data.hp / this.hp.totalLength
    }

    renderActorName(data: IActor) {
        this.actorName.string = data.nickname
    }
}


