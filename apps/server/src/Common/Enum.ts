export enum InputTypeEnum {
    ActorMove,
    WeaponShoot,
    TimePast,
    ActorDead,
}

export enum EntityTypeEnum {
    Actor1 = "Actor1",
    Map = "Map",
    Weapon1 = "Weapon1",
    Bullet1 = "Bullet1",
    Bullet2 = "Bullet2",
    Explosion = "Explosion",
    Mask = "Mask",
}

export enum ApiMsgEnum {
    MsgClientSync,
    MsgServerSync,
    MsgPlayerList,
    ApiPlayerJoin,
    ApiPlayerList,
    ApiRoomCreate,
    ApiRoomList,
    MsgRoomList,
    MsgRoom,
    ApiRoomJoin,
    ApiRoomLeave,
    ApiGameStart,
    MsgGameStart,
}

export enum RoomStateEnum {
    Wait,
    Gameing,
}
