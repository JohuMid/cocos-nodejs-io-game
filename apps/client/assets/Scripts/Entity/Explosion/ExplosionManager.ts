import { _decorator, Component, EventTouch, input, Input, instantiate, log, Node, UITransform, Vec2 } from 'cc';
import { EntityTypeEnum } from '../../Common/Enum';
import { IVec2 } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { EntityStateEnum, EventEnum } from '../../Enum';
import { ExplosionStateMachine } from './ExplosionStateMachine';
const { ccclass, property } = _decorator;

@ccclass('ExplosionManager')
export class ExplosionManager extends EntityManager {
    type: EntityTypeEnum
    id: number

    init(type: EntityTypeEnum,{x,y}:IVec2) {
        this.node.setPosition(x,y)
        this.type = type
        this.fsm = this.addComponent(ExplosionStateMachine)
        this.fsm.init(type)

        this.state = EntityStateEnum.Idle
    }
}


