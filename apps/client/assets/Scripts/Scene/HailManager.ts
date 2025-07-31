import { _decorator, Component, Prefab, Node, instantiate, director } from 'cc';
import { ApiMsgEnum, IApiPlayerListRes } from '../Common';
import { NetworkManager } from '../Global/NetworkManager';
import { PlayerManager } from '../UI/PlayerManager';
import DataManager from '../Global/DataManager';
import { SceneEnum } from '../Enum';

const { ccclass, property } = _decorator;

@ccclass('HailManager')
export class HailManager extends Component {
    @property(Node)
    playerContainer: Node
    @property(Prefab)
    playerPrefab: Prefab

    onLoad() {
        director.preloadScene(SceneEnum.Room)
    }

    start() {
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this)
        this.playerContainer.destroyAllChildren()
        this.getPlayers()
    }

    onDestroy() {
        NetworkManager.Instance.unlistenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this)
    }

    async getPlayers() {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiPlayerList, {})
        if (!success) {
            console.log(error)
        }

        this.renderPlayer(res)
    }

    renderPlayer({ list }: IApiPlayerListRes) {
        for (const child of this.playerContainer.children) {
            child.active = false
        }

        while (this.playerContainer.children.length < list.length) {
            const node = instantiate(this.playerPrefab)
            node.active = false
            node.parent = this.playerContainer
        }

        console.log('list', list)

        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const node = this.playerContainer.children[i]
            node.getComponent(PlayerManager).init(data)
        }
    }

    async handleCreateRoom() {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomCreate, {})
        if (!success) {
            console.log(error)
            return
        }
        DataManager.Instance.roomInfo = res.room
        console.log('DataManager.Instance.roomInfo', DataManager.Instance.roomInfo)
        director.loadScene(SceneEnum.Room)
    }
}
