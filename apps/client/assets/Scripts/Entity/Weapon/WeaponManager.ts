import { _decorator, Component, EventTouch, input, Input, instantiate, log, Node, UITransform, Vec2 } from 'cc';
import DataManager from '../../Global/DataManager';
import { EntityTypeEnum, InputTypeEnum } from '../../Common/Enum';
import { EntityStateEnum } from '../../Enum';
import { EntityManager } from '../../Base/EntityManager';
import { IActor } from '../../Common';
import { WeaponStateMachine } from './WeaponStateMachine';

const { ccclass, property } = _decorator;

@ccclass('WeaponManager')
export class WeaponManager extends EntityManager {
    private body:Node
    private anchor:Node
    private point:Node
    init(data: IActor) {
        this.body = this.node.getChildByName("Body")
        this.anchor = this.body.getChildByName("Anchor")
        this.point = this.anchor.getChildByName("Point")

        this.fsm = this.body.addComponent(WeaponStateMachine)
        this.fsm.init(data.weaponType)

        this.state = EntityStateEnum.Idle
    }
}


