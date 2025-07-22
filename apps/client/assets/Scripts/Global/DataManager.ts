import Singleton from "../Base/Singleton";
import { IActorMove, IState } from "../Common";
import { JoyStickManager } from "../UI/JoyStickManager";

const ACTOR_SPEED = 100

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }
  jm:JoyStickManager

  state: IState = {
    actors: [
      {
        id: 1,
        position: {
          x: 0,
          y: 0,

        },
        direction: {
          x: 1,
          y: 0,
        }
      }
    ]
  }

  applyInput(input:IActorMove){
    const {dt,direction:{x,y},id} = input
    const actor = this.state.actors.find((actor)=>actor.id === id)
    actor.direction = {
      x,
      y,
    }
    actor.position.x += actor.direction.x * dt * ACTOR_SPEED
    actor.position.y += actor.direction.y * dt * ACTOR_SPEED
  }
}
