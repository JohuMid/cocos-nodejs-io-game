import { _decorator, Component, Label, Node } from 'cc';
import { IRoom, RoomStateEnum } from '../Common';
import { EventEnum } from '../Enum';
import EventManager from '../Global/EventManager';

const { ccclass, property } = _decorator;
import { MAX_PLAYER_COUNT } from '../Common';

@ccclass('RoomManager')
export class RoomManager extends Component {
    id: number
    init({ id, state, players }: IRoom) {
        this.id = id
        const label = this.getComponent(Label)
        label.string = `房间${id}(${players.length}/${MAX_PLAYER_COUNT})(${state === RoomStateEnum.Gameing ? '游戏中' : '等待中'}):${players.map(p => p.nickname).join(',')}`

        this.node.active = true
    }
    handleClick() {
        EventManager.Instance.emit(EventEnum.RoomJoin, this.id)
    }
}


