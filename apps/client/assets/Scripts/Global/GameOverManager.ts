import { _decorator, Component, find, instantiate, Prefab } from 'cc';
import { EventEnum, PrefabPathEnum } from '../Enum';
import DataManager from './DataManager';
import Singleton from '../Base/Singleton';
import { ResourceManager } from './ResourceManager';

const { ccclass, property } = _decorator;

@ccclass('GameOverManager')
export class GameOverManager extends Singleton {
    static get Instance() {
        return super.GetInstance<GameOverManager>();
    }

    init() {
        ResourceManager.Instance.loadRes(PrefabPathEnum.Mask, Prefab).then((prefab) => {
            DataManager.Instance.prefabMap.set(PrefabPathEnum.Mask, prefab)
        })
    }

    showGameOver() {
        const prefab = DataManager.Instance.prefabMap.get(PrefabPathEnum.Mask)

        const maskNode = instantiate(prefab);
        const canvas = find('Canvas');
        if (canvas) {
            canvas.addChild(maskNode);
        }
    }

    handleGameOver() {
        // 游戏结束
    }
}
