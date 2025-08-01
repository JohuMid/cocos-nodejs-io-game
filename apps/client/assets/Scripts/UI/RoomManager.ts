import { _decorator, Component, Label, Node } from 'cc';
import { IRoom } from '../Common';

const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    init({ id, players }: IRoom) {
        const label = this.getComponent(Label)
        label.string = `房间${id}:${players.map(p => p.nickname).join(',')}`
        this.node.active = true
    }
}


