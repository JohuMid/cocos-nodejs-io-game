import { _decorator, Component, director, EditBox, EventTouch, input, Input, instantiate, log, Node, Prefab, SpriteFrame, UITransform, Vec2 } from 'cc';
import DataManager from '../Global/DataManager';
import { JoyStickManager } from '../UI/JoyStickManager';
import { ResourceManager } from '../Global/ResourceManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { EventEnum, PrefabPathEnum, SceneEnum, TexturePathEnum } from '../Enum';
import { ApiMsgEnum, EntityTypeEnum, IClientInput, InputTypeEnum } from '../Common';
import { BulletManager } from '../Entity/Bullet/BulletManager';
import { ObjectPoolManager } from '../Global/ObjectPoolManager';
import { NetworkManager } from '../Global/NetworkManager';
import EventManager from '../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('LoginManager')
export class LoginManager extends Component {
    input: EditBox
    onLoad() {
        this.input = this.getComponentInChildren(EditBox)
        director.preloadScene(SceneEnum.Battle)
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
        director.loadScene(SceneEnum.Battle)
    }
}
