export enum FsmParamTypeEnum {
  Number = "Number",
  Trigger = "Trigger",
}

export enum ParamsNameEnum {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
  Dead = "Dead",
}

export enum EventEnum {
  WeaponShoot = "WeaponShoot",
  ExplosionBorn = "ExplosionBorn",
  BullectBorn = "BullectBorn",
  ClientSync = "ClientSync",
  RoomJoin = "RoomJoin",
  ActorDead = "ActorDead",
}


export enum PrefabPathEnum {
  Actor1 = 'prefab/Actor',
  Map = 'prefab/Map',
  Weapon1 = 'prefab/Weapon1',
  Bullet2 = 'prefab/Bullet2',
  Explosion = 'prefab/Explosion',
  Toast = 'prefab/Toast',
}

export enum TexturePathEnum {
  Actor1Idle = 'texture/actor/actor1/idle',
  Actor1Run = 'texture/actor/actor1/run',
  Actor1Dead = 'texture/actor/actor1/dead',
  Weapon1Idle = 'texture/weapon/weapon1/idle',
  Weapon1Attack = 'texture/weapon/weapon1/attack',
  Bullet2Idle = 'texture/bullet/bullet2',
  ExplosionIdle = 'texture/explosion',
}

export enum EntityStateEnum {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
  Dead = "Dead",
}

export enum SceneEnum {
  Login = "Login",
  Battle = "Battle",
  Hail = "Hail",
  Room = "Room",
}
