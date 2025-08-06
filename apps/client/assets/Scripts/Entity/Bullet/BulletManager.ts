import { Tween, tween, Vec3, _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { EntityTypeEnum, IBullet, IVec2 } from "../../Common";
import { EntityStateEnum, EventEnum } from "../../Enum";
import DataManager from "../../Global/DataManager";
import EventManager from "../../Global/EventManager";
import ObjectPoolManager from "../../Global/ObjectPoolManager";
import { rad2Angle } from "../../Utils";
import { ExplosionManager } from "../Explosion/ExplosionManager";
import { BulletStateMachine } from "./BulletStateMachine";
const { ccclass } = _decorator;

@ccclass("BulletManager")
export class BulletManager extends EntityManager implements IBullet {
    //静态数据
    id: number;
    owner: number;
    type: EntityTypeEnum;

    //动态数据
    position: IVec2;
    direction: IVec2;

    private angle: number;
    private tw: Tween<any>;
    private targetPos: Vec3;

    init({ id, owner, type }: IBullet) {
        this.id = id;
        this.owner = owner;
        this.type = type;

        this.fsm = this.addComponent(BulletStateMachine);
        this.fsm.init(type);
        this.state = EntityStateEnum.Idle;

        this.node.active = false;
        this.targetPos = undefined;
        this.angle = undefined;

        EventManager.Instance.on(EventEnum.ExplosionBorn, this.handleExplosion, this);
    }

    handleExplosion(id: number, { x, y }: IVec2) {
        if (this.id !== id) {
            return;
        }

        // 无论爆炸节点是否有效，都要确保子弹被销毁
        EventManager.Instance.off(EventEnum.ExplosionBorn, this.handleExplosion, this);
        ObjectPoolManager.Instance.ret(this.node);
        DataManager.Instance.bulletMap.delete(this.id);

        // 尝试创建爆炸效果，但即使失败也不影响子弹销毁
        const explosion = ObjectPoolManager.Instance.get(EntityTypeEnum.Explosion);
        if (explosion && explosion.isValid) {
            const explosionManager = explosion.getComponent(ExplosionManager) || explosion.addComponent(ExplosionManager);
            explosionManager.init(EntityTypeEnum.Explosion, {
                x,
                y,
            });
        }
    }

    render(data: IBullet) {
        this.renderPosition(data);
        this.renderDirection(data);
    }

    renderPosition(data: IBullet) {
        const newPos = new Vec3(data.position.x, data.position.y);
        if (!this.targetPos) {
            this.node.active = true;
            this.node.setPosition(newPos);
            this.targetPos = new Vec3(newPos);
        } else if (!this.targetPos.equals(newPos)) {
            this.tw?.stop();
            this.node.setPosition(this.targetPos);
            this.targetPos.set(newPos);
            this.tw = tween(this.node)
                .to(0.1, {
                    position: this.targetPos,
                })
                .start();
        }

        // this.node.setPosition(data.position.x, data.position.y)
    }

    renderDirection(data: IBullet) {
        if (this.angle === undefined) {
            const { x, y } = data.direction;
            const side = Math.sqrt(x * x + y * y);
            this.angle = x > 0 ? rad2Angle(Math.asin(y / side)) : rad2Angle(Math.asin(-y / side)) + 180;
        }

        this.node.setRotationFromEuler(0, 0, this.angle);

        // let angle: number, sign: number
        // if (x !== 0) {
        //   angle = x > 0 ? rad2Angle(Math.atan(y / x)) : rad2Angle(Math.atan(-y / x)) + 180
        //   sign = x > 0 ? 1 : -1
        // } else {
        //   angle = rad2Angle(Math.PI / 2)
        //   sign = y > 0 ? 1 : -1
        // }
        // this.node.setRotationFromEuler(0, 0, sign * angle)
    }
}
