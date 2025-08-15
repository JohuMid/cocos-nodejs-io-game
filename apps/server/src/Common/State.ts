import { EntityTypeEnum, InputTypeEnum } from "./Enum"

export interface IVec2 {
    x: number,
    y: number,
}

export interface IActor {
    nickname: string,
    id: number,
    hp:number,
    position: IVec2,
    direction: IVec2,
    type: EntityTypeEnum,
    weaponType: EntityTypeEnum,
    bulletType: EntityTypeEnum,
}

export interface IBullet {
    id: number,
    owner: number,
    position: IVec2,
    direction: IVec2,
    type: EntityTypeEnum
}

export interface IState {
    actors: IActor[],
    bullets: IBullet[],
    nextBulletId: number,
    seed:number,
}

export interface ITimePast{
    type:InputTypeEnum.TimePast,
    dt:number,
}

export type IClientInput = IActorMove | IWeaponShoot | ITimePast | IActorDead

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

export interface IActorDead {
    id: number,
    type: InputTypeEnum.ActorDead,
}
