export interface IPlayer {
    id: number,
    nickname: string,
    rid: number
}

export interface IRoom {
    id: number,
    players: IPlayer[]
}

export interface IApiPlayerJoinReq {
    nickname: string
}

export interface IApiPlayerJoinRes {
    player: IPlayer
}

export interface IApiPlayerListReq { }

export interface IApiPlayerListRes {
    list: IPlayer[]
}

export interface IApiRoomCreateReq { }

export interface IApiRoomCreateRes {
    room: IRoom
}

export interface IApiRoomListReq { }

export interface IApiRoomListRes {
    list: IRoom[]
}

export interface IApiRoomJoinReq {
    rid: number
}

export interface IApiRoomJoinRes {
    room: IRoom
}

export interface IApiRoomLeaveReq { }

export interface IApiRoomLeaveRes { }

export interface IApiGameStartReq { }

export interface IApiGameStartRes { }

