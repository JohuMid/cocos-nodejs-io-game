import { _decorator, Component, EventTouch, input, Input, instantiate, log, Node, UITransform, Vec2 } from 'cc';
import { EntityTypeEnum } from '../../Common/Enum';
import { IBullet } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { EntityStateEnum } from '../../Enum';
import { rad2Angel } from '../../Utils';
import { BulletStateMachine } from './BulletStateMachine';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager {
    type: EntityTypeEnum

    init(data: IBullet) {
        this.type = data.type
        this.fsm = this.addComponent(BulletStateMachine)
        this.fsm.init(data.type)

        this.state = EntityStateEnum.Idle
    }

    render(data: IBullet) {
        const { direction, position } = data
        this.node.setPosition(position.x, position.y)

        const side = Math.sqrt(direction.x ** 2 + direction.y ** 2)
        const angle = direction.x > 0 ? rad2Angel(Math.asin(direction.y / side)) : rad2Angel(Math.asin(-direction.y / side)) + 180
        
        this.node.setRotationFromEuler(0, 0, angle)
    }
}


