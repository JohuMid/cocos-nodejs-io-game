import { EntityTypeEnum, InputTypeEnum } from "./Enum"

export interface IVec2 {
    x: number,
    y: number,
}

export interface IActor {
    id: number,
    position: IVec2,
    direction: IVec2,
    type: EntityTypeEnum,
    weaponType: EntityTypeEnum,
    buttleType: EntityTypeEnum,
}

export interface IButtle {
    id: number,
    owner: number,
    position: IVec2,
    direction: IVec2,
    type: EntityTypeEnum
}

export interface IState {
    actors: IActor[],
    buttles: IButtle[],
    nextButtleId: number,
}

export type IClientInput = IActorMove | IWeaponShoot

export interface IActorMove {
    id: number,
    type: InputTypeEnum.ActorMove,
    direction: IVec2,
    dt: number,
}

export interface IWeaponShoot {
    owner: number,
    type: InputTypeEnum.WeaponShoot,
    position: IVec2,
    direction: IVec2,
}