import { _decorator, Component, EventTouch, input, Input, log, Node, UITransform, Vec2 } from 'cc';
import DataManager from '../../Global/DataManager';
import { JoyStickManager } from '../../UI/JoyStickManager';
import { InputTypeEnum } from '../../Common/Enum';
import { IActor } from '../../Common';
const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends Component {
    init(data:IActor) {
        
    }

    update(dt: number): void {
        if (DataManager.Instance.jm.input.length()) {
            const {x,y} = DataManager.Instance.jm.input
            DataManager.Instance.applyInput({
                id:1,
                type: InputTypeEnum.ActorMove,
                direction:{
                    x,
                    y
                },
                dt,
            })
            console.log(DataManager.Instance.state.actors[0].position.x);
            
        }
    }
    
    render(data:IActor) {
        this.node.setPosition(data.position.x,data.position.y)
    }

}


