import { _decorator, Component, EventTouch, input, Input, instantiate, log, Node, UITransform, Vec2 } from 'cc';
import DataManager from '../../Global/DataManager';
import { EntityTypeEnum, InputTypeEnum } from '../../Common/Enum';
import { IActor } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { ActorStateMachine } from './ActorStateMachine';
import { EntityStateEnum } from '../../Enum';
import { WeaponManager } from '../Weapon/WeaponManager';
import { rad2Angle } from '../../Utils';
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
        const { x, y } = data.direction;
        const { x: px, y: py } = data.position;
        this.node.setPosition(px, py)
        if (x !== 0) {
            this.node.setScale(x > 0 ? 1 : -1, 1);
        }
        const side = Math.sqrt(x * x + y * y);
        const angle = rad2Angle(Math.asin(y / side));
        this.wm.node.setRotationFromEuler(0, 0, angle)
    }
}


