import { _decorator, Component, Label, Node } from 'cc';
import { IRoom } from '../Common';
import { EventEnum } from '../Enum';
import EventManager from '../Global/EventManager';

const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    id: number
    init({ id, players }: IRoom) {
        this.id = id
        const label = this.getComponent(Label)
        label.string = `房间${id}:${players.map(p => p.nickname).join(',')}`
        this.node.active = true
    }
    handleClick() {
        EventManager.Instance.emit(EventEnum.RoomJoin, this.id)
    }
}


