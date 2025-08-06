import { _decorator, Component, Node, Prefab, instantiate, find, UIOpacity, Label, director, tween } from "cc";
import DataManager from "./DataManager";
import { PrefabPathEnum } from "../Enum";
import { ResourceManager } from "./ResourceManager";
import Singleton from "../Base/Singleton";
const { ccclass, property } = _decorator;

@ccclass('ToastManager')
export class ToastManager extends Singleton {
    static get Instance() {
        return super.GetInstance<ToastManager>();
    }

    @property(Prefab)
    public toastPrefab: Prefab = null; // 编辑器中拖入Toast预制体

    private toastPool: Node[] = [];
    private maxPoolSize: number = 3;

    // 初始化方法（此时toastPrefab会使用编辑器中设置的值）
    init() {
        ResourceManager.Instance.loadRes(PrefabPathEnum.Toast, Prefab).then((prefab) => {
            DataManager.Instance.prefabMap.set(PrefabPathEnum.Toast, prefab)
        })
    }

    // 显示Toast
    showToast(message: string, duration: number = 2) {

        let toastNode = this.toastPool.find((node: Node) => !node.active);
        if (!toastNode) {
            const prefab = DataManager.Instance.prefabMap.get(PrefabPathEnum.Toast)

            toastNode = instantiate(prefab);
            const canvas = find('Canvas');
            if (canvas) {
                canvas.addChild(toastNode);
            } else {
                console.error("未找到Canvas节点");
                return;
            }

            if (!toastNode.getComponent(UIOpacity)) {
                toastNode.addComponent(UIOpacity);
            }

            this.toastPool.push(toastNode);
            if (this.toastPool.length > this.maxPoolSize) {
                this.toastPool.shift().destroy();
            }
        }

        const label = toastNode.getComponentInChildren(Label);
        if (label) label.string = message;

        const uiOpacity = toastNode.getComponent(UIOpacity);
        toastNode.active = true;
        uiOpacity.opacity = 0;

        tween(uiOpacity)
            .to(0.3, { opacity: 255 })
            .delay(duration)
            .to(0.3, { opacity: 0 })
            .call(() => {
                toastNode.active = false;
            })
            .start();
    }
}