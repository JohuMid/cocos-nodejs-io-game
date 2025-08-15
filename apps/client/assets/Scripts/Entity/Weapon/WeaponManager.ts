import { _decorator, Component, EventTouch, input, Input, instantiate, log, Node, UITransform, Vec2 } from 'cc';
import DataManager from '../../Global/DataManager';
import { EntityTypeEnum, InputTypeEnum } from '../../Common/Enum';
import { EntityStateEnum, EventEnum } from '../../Enum';
import { EntityManager } from '../../Base/EntityManager';
import { IActor } from '../../Common';
import { WeaponStateMachine } from './WeaponStateMachine';
import EventManager from '../../Global/EventManager';
import { toFixed } from '../../Common/Utils';

const { ccclass, property } = _decorator;

@ccclass('WeaponManager')
export class WeaponManager extends EntityManager {
    owner: number
    private body: Node
    private anchor: Node
    private point: Node
    init(data: IActor) {
        this.owner = data.id
        this.body = this.node.getChildByName("Body")
        this.anchor = this.body.getChildByName("Anchor")
        this.point = this.anchor.getChildByName("Point")

        this.fsm = this.body.addComponent(WeaponStateMachine)
        this.fsm.init(data.weaponType)

        this.state = EntityStateEnum.Idle

        EventManager.Instance.on(EventEnum.WeaponShoot, this.handleWeaponShoot, this)
        EventManager.Instance.on(EventEnum.BullectBorn, this.handleBullectBorn, this)
    }

    onDestroy() {
        EventManager.Instance.off(EventEnum.WeaponShoot, this.handleWeaponShoot, this)
        EventManager.Instance.off(EventEnum.BullectBorn, this.handleBullectBorn, this)
    }

    handleWeaponShoot() {
        if (this.owner !== DataManager.Instance.myPlayerId) {
            return
        }
        if (DataManager.Instance.state.actors.find((actor) => actor.id === this.owner).hp <= 0) {
            return
        }
        const pointWorldPos = this.point.getWorldPosition();
        const pointStagePos = DataManager.Instance.stage
            .getComponent(UITransform)
            .convertToNodeSpaceAR(pointWorldPos);

        const anchorWorldPos = this.anchor.getWorldPosition();
        const direction = new Vec2(
            pointWorldPos.x - anchorWorldPos.x,
            pointWorldPos.y - anchorWorldPos.y
        ).normalize();

        EventManager.Instance.emit(EventEnum.ClientSync, {
            type: InputTypeEnum.WeaponShoot,
            owner: this.owner,
            position: {
                x: toFixed(pointStagePos.x),
                y: toFixed(pointStagePos.y),
            },
            direction: {
                x: toFixed(direction.x),
                y: toFixed(direction.y),
            }
        })
        console.log(DataManager.Instance.state.bullets);
    }

    handleBullectBorn(owner: number) {
        if (owner !== this.owner) {
            return
        }
        this.state = EntityStateEnum.Attack
    }
}


