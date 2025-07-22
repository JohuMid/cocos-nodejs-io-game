import { _decorator, Component, EventTouch, input, Input, log, Node, UITransform, Vec2 } from 'cc';
import DataManager from '../Global/DataManager';
import { JoyStickManager } from '../UI/JoyStickManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    private stage: Node
    private ui: Node

    onLoad() {
        this.stage = this.node.getChildByName('Stage')
        this.ui = this.node.getChildByName('UI')
        DataManager.Instance.jm = this.ui.getComponentInChildren(JoyStickManager)
    }

}


