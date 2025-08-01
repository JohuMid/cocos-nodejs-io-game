import { _decorator, Component, EventTouch, input, Input, instantiate, log, Node, tween, Tween, UITransform, Vec2, Vec3 } from 'cc';
import { EntityTypeEnum } from '../../Common/Enum';
import { IBullet, IVec2 } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { EntityStateEnum, EventEnum } from '../../Enum';
import { rad2Angle } from '../../Utils';
import { BulletStateMachine } from './BulletStateMachine';
import EventManager from '../../Global/EventManager';
import DataManager from '../../Global/DataManager';
import { ExplosionManager } from '../Explosion/ExplosionManager';
import { ObjectPoolManager } from '../../Global/ObjectPoolManager';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager {
    type: EntityTypeEnum
    id: number

    private targetPos: Vec3
    private tw: Tween

    init(data: IBullet) {
        this.type = data.type
        this.id = data.id
        this.fsm = this.addComponent(BulletStateMachine)
        this.fsm.init(data.type)

        this.state = EntityStateEnum.Idle
        this.node.active = false
        this.targetPos = undefined

        EventManager.Instance.on(EventEnum.ExplosionBorn, this.onExplosionBorn, this)
    }

    onExplosionBorn(id: number, { x, y }: IVec2) {
        if (this.id !== id) {
            return
        }

        const explosion = ObjectPoolManager.Instance.get(EntityTypeEnum.Explosion)
        const em = explosion.getComponent(ExplosionManager) || explosion.addComponent(ExplosionManager)
        em.init(EntityTypeEnum.Explosion, { x, y })

        EventManager.Instance.off(EventEnum.ExplosionBorn, this.onExplosionBorn, this)
        DataManager.Instance.bulletMap.delete(this.id)
        this.node.destroy()
        ObjectPoolManager.Instance.ret(this.node)
    }

    render(data: IBullet) {
        this.renderPosition(data)
        this.renderDirection(data)
    }

    renderPosition(data: IBullet) {
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
            this.tw = tween(this.node).to(0.1, {
                position: this.targetPos
            }).start()
        }
    }

    renderDirection(data: IBullet) {
        const { direction } = data;
        const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        const angle =
            direction.x > 0
                ? rad2Angle(Math.asin(direction.y / side))
                : rad2Angle(Math.asin(-direction.y / side)) + 180;
        this.node.setRotationFromEuler(0, 0, angle);
    }
}


