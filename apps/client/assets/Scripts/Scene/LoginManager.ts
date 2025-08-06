import { _decorator, Component, director, EditBox, EventTouch, input, Input, instantiate, log, Node, Prefab, SpriteFrame, UITransform, Vec2 } from 'cc';
import DataManager from '../Global/DataManager';
import { SceneEnum } from '../Enum';
import { ApiMsgEnum } from '../Common';
import { NetworkManager } from '../Global/NetworkManager';
import { ToastManager } from '../Global/ToastManager';
const { ccclass, property } = _decorator;

@ccclass('LoginManager')
export class LoginManager extends Component {
    input: EditBox
    onLoad() {
        this.input = this.getComponentInChildren(EditBox)
        ToastManager.Instance.init();
        director.preloadScene(SceneEnum.Hail)
    }

    async start() {
        await NetworkManager.Instance.connect()
    }

    async handleClick() {
        if (!NetworkManager.Instance.isConnected) {
            console.log('未连接');
            await NetworkManager.Instance.connect()
            return
        }

        const nickname = this.input.string
        if (!nickname) {
            console.log('请输入昵称');
            return
        }

        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiPlayerJoin, {
            nickname
        })
        if (!success) {
            console.log(error)
            return
        }

        DataManager.Instance.myPlayerId = res.player.id
        console.log("res", res)
        director.loadScene(SceneEnum.Hail)
    }
}
