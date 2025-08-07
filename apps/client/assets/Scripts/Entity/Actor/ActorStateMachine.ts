import { _decorator, Animation, AnimationClip } from "cc";
import State from "../../Base/State";
import StateMachine, { getInitParamsTrigger } from "../../Base/StateMachine";
import { EntityTypeEnum } from "../../Common";
import { EntityStateEnum, ParamsNameEnum } from "../../Enum";
const { ccclass } = _decorator;

@ccclass("ActorStateMachine")
export class ActorStateMachine extends StateMachine {
  init(type: EntityTypeEnum) {
    this.type = type;
    this.animationComponent = this.node.addComponent(Animation);
    this.initParams();
    this.initStateMachines();
    this.initAnimationEvent();
  }

  initParams() {
    this.params.set(ParamsNameEnum.Idle, getInitParamsTrigger());
    this.params.set(ParamsNameEnum.Run, getInitParamsTrigger());
    this.params.set(ParamsNameEnum.Dead, getInitParamsTrigger());
  }

  initStateMachines() {
    this.stateMachines.set(ParamsNameEnum.Idle, new State(this, `${this.type}${EntityStateEnum.Idle}`, AnimationClip.WrapMode.Loop));
    this.stateMachines.set(ParamsNameEnum.Run, new State(this, `${this.type}${EntityStateEnum.Run}`, AnimationClip.WrapMode.Loop));
    this.stateMachines.set(ParamsNameEnum.Dead, new State(this, `${this.type}${EntityStateEnum.Dead}`, AnimationClip.WrapMode.Normal));
  }

  initAnimationEvent() {}

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(ParamsNameEnum.Idle):
      case this.stateMachines.get(ParamsNameEnum.Run):
      case this.stateMachines.get(ParamsNameEnum.Dead):
        if (this.params.get(ParamsNameEnum.Run).value) {
          this.currentState = this.stateMachines.get(ParamsNameEnum.Run);
        } else if (this.params.get(ParamsNameEnum.Idle).value) {
          this.currentState = this.stateMachines.get(ParamsNameEnum.Idle);
        } else if (this.params.get(ParamsNameEnum.Dead).value) {
          this.currentState = this.stateMachines.get(ParamsNameEnum.Dead);
        } else {
          this.currentState = this.currentState;
        }
        break;
      default:
        this.currentState = this.stateMachines.get(ParamsNameEnum.Idle);
        break;
    }
  }
}
