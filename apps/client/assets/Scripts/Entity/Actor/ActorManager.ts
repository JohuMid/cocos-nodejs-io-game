import { _decorator, Component, EventTouch, input, Input, instantiate, log, Node, UITransform, Vec2 } from 'cc';
import DataManager from '../../Global/DataManager';
import { EntityTypeEnum, InputTypeEnum } from '../../Common/Enum';
import { IActor } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { ActorStateMachine } from './ActorStateMachine';
import { EntityStateEnum } from '../../Enum';
import { WeaponManager } from '../Weapon/WeaponManager';
import { rad2Angel } from '../../Utils';
const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends EntityManager {
    bulletType:EntityTypeEnum

    private wm: WeaponManager
    init(data: IActor) {
        this.bulletType = data.bulletType
        this.fsm = this.addComponent(ActorStateMachine)
        this.fsm.init(data.type)

        this.state = EntityStateEnum.Idle

        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1)
        const weapon = instantiate(prefab)
        weapon.setParent(this.node)
        this.wm = weapon.addComponent(WeaponManager)
        this.wm.init(data)
    }

    tick(dt: number): void {
        if (DataManager.Instance.jm.input.length()) {
            const { x, y } = DataManager.Instance.jm.input
            DataManager.Instance.applyInput({
                id: 1,
                type: InputTypeEnum.ActorMove,
                direction: {
                    x,
                    y
                },
                dt,
            })
            this.state = EntityStateEnum.Run
        } else {
            this.state = EntityStateEnum.Idle
        }
    }

    render(data: IActor) {
        const { direction, position } = data
        this.node.setPosition(position.x, position.y)

        if (direction.x !== 0) {
            this.node.setScale(direction.x > 0 ? 1 : -1, 1)
        }
        const side = Math.sqrt(direction.x ** 2 + direction.y ** 2)
        const rad = Math.asin(direction.y / side)
        const angle = rad2Angel(rad)
        this.wm.node.setRotationFromEuler(0, 0, angle)
    }
}


