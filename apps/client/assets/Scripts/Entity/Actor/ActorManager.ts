import { _decorator, Component, EventTouch, input, Input, log, Node, UITransform, Vec2 } from 'cc';
import DataManager from '../../Global/DataManager';
import { InputTypeEnum } from '../../Common/Enum';
import { IActor } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { ActorStateMachine } from './ActorStateMachine';
import { EntityStateEnum } from '../../Enum';
const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends EntityManager {
    init(data: IActor) {
        this.fsm = this.addComponent(ActorStateMachine)
        this.fsm.init(data.type)

        this.state = EntityStateEnum.Idle
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
            console.log(DataManager.Instance.state.actors[0].position.x);
            this.state = EntityStateEnum.Run
        } else{
            this.state = EntityStateEnum.Idle
        }
        

    }

    render(data: IActor) {
        const { direction, position } = data
        this.node.setPosition(position.x, position.y)

        if (direction.x !== 0 || direction.y !== 0) {
            this.node.setScale(direction.x > 0 ? 1 : -1, 1)
        }
    }
}


