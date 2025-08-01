import { _decorator, Component, Prefab, Node, instantiate, director } from 'cc';
import { ApiMsgEnum, IApiPlayerListRes, IApiRoomListRes, IMsgRoom } from '../Common';
import { NetworkManager } from '../Global/NetworkManager';
import { PlayerManager } from '../UI/PlayerManager';
import DataManager from '../Global/DataManager';
import { SceneEnum } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    @property(Node)
    playerContainer: Node
    @property(Prefab)
    playerPrefab: Prefab

    onLoad() {
        director.preloadScene(SceneEnum.Room)
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgRoom, this.renderPlayer, this)
    }

    start() {
        this.renderPlayer({ room: DataManager.Instance.roomInfo })
    }

    onDestroy() {
        NetworkManager.Instance.unlistenMsg(ApiMsgEnum.MsgRoom, this.renderPlayer, this)
    }

    renderPlayer({ room: { players: list } }: IMsgRoom) {
        for (const child of this.playerContainer.children) {
            child.active = false
        }

        while (this.playerContainer.children.length < list.length) {
            const node = instantiate(this.playerPrefab)
            node.active = false
            node.parent = this.playerContainer
        }

        // console.log('list', list)

        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const node = this.playerContainer.children[i]
            node.getComponent(PlayerManager).init(data)
        }
    }

    /* renderRoom({ list }: IApiRoomListRes) {
        for (const child of this.roomContainer.children) {
            child.active = false
        }

        while (this.roomContainer.children.length < list.length) {
            const node = instantiate(this.roomPrefab)
            node.active = false
            node.parent = this.roomContainer
        }

        console.log('list', list)

        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const node = this.roomContainer.children[i]
            node.getComponent(RoomManager).init(data)
        }
    } */

    async handleLeaveRoom() {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomLeave, {})
        if (!success) {
            console.log(error)
            return
        }
        DataManager.Instance.roomInfo = null
        director.loadScene(SceneEnum.Hail)
    }
}
