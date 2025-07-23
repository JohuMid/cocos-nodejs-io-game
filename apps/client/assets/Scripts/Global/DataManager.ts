import { Prefab, SpriteFrame, Node } from "cc";
import Singleton from "../Base/Singleton";
import { EntityTypeEnum, IActorMove, IButtle, IClientInput, InputTypeEnum, IState } from "../Common";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { JoyStickManager } from "../UI/JoyStickManager";

const ACTOR_SPEED = 100

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  stage: Node
  jm: JoyStickManager
  actorMap: Map<number, ActorManager> = new Map()
  prefabMap: Map<string, Prefab> = new Map()
  textureMap: Map<string, SpriteFrame[]> = new Map()

  state: IState = {
    actors: [
      {
        id: 1,
        type: EntityTypeEnum.Actor1,
        weaponType: EntityTypeEnum.Weapon1,
        buttleType: EntityTypeEnum.Buttle1,
        position: {
          x: 0,
          y: 0,

        },
        direction: {
          x: 1,
          y: 0,
        }
      }
    ],
    buttles: [],
    nextButtleId: 1
  }

  applyInput(input: IClientInput) {
    switch (input.type) {
      case InputTypeEnum.ActorMove: {
        const { dt, direction: { x, y }, id } = input
        const actor = this.state.actors.find((actor) => actor.id === id)
        actor.direction = {
          x,
          y,
        }
        actor.position.x += actor.direction.x * dt * ACTOR_SPEED
        actor.position.y += actor.direction.y * dt * ACTOR_SPEED
        break
      }
      case InputTypeEnum.WeaponShoot: {
        const { owner, position, direction } = input
        const buttle: IButtle = {
          id: this.state.nextButtleId++,
          owner,
          position,
          direction,
          type:this.actorMap.get(owner).buttleType,
        }
        this.state.buttles.push(buttle)
        break
      }
    }

  }
}
