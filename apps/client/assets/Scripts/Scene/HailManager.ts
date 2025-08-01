import { _decorator, Component, Prefab, Node, instantiate, director } from 'cc';
import { ApiMsgEnum, IApiPlayerListRes, IApiRoomListRes } from '../Common';
import { NetworkManager } from '../Global/NetworkManager';
import { PlayerManager } from '../UI/PlayerManager';
import DataManager from '../Global/DataManager';
import { EventEnum, SceneEnum } from '../Enum';
import { RoomManager } from '../UI/RoomManager';
import EventManager from '../Global/EventManager';

const { ccclass, property } = _decorator;

@ccclass('HailManager')
export class HailManager extends Component {
    @property(Node)
    playerContainer: Node
    @property(Prefab)
    playerPrefab: Prefab

    @property(Node)
    roomContainer: Node
    @property(Prefab)
    roomPrefab: Prefab

    onLoad() {
        director.preloadScene(SceneEnum.Room)
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this)
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgRoomList, this.renderRoom, this)
        EventManager.Instance.on(EventEnum.RoomJoin, this.handleJoinRoom, this)
    }

    start() {
        this.playerContainer.destroyAllChildren()
        this.roomContainer.destroyAllChildren()
        this.getPlayers()
        this.getRooms()
    }

    onDestroy() {
        NetworkManager.Instance.unlistenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this)
        NetworkManager.Instance.unlistenMsg(ApiMsgEnum.MsgRoomList, this.renderRoom, this)
        EventManager.Instance.off(EventEnum.RoomJoin, this.handleJoinRoom, this)
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

        // console.log('list', list)

        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const node = this.playerContainer.children[i]
            node.getComponent(PlayerManager).init(data)
        }
    }

    async getRooms() {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomList, {})
        if (!success) {
            console.log(error)
        }

        this.renderRoom(res)
    }

    renderRoom({ list }: IApiRoomListRes) {
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
    }

    async handleCreateRoom() {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomCreate, {})
        if (!success) {
            console.log(error)
            return
        }
        DataManager.Instance.roomInfo = res.room
        // console.log('DataManager.Instance.roomInfo', DataManager.Instance.roomInfo)
        director.loadScene(SceneEnum.Room)
    }

    async handleJoinRoom(rid: number) {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomJoin, { rid })
        if (!success) {
            console.log(error)
            return
        }
        DataManager.Instance.roomInfo = res.room
        console.log('DataManager.Instance.roomInfo', DataManager.Instance.roomInfo)
        director.loadScene(SceneEnum.Room)
    }
}
