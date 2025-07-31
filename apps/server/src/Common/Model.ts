import { IApiPlayerJoinReq, IApiPlayerJoinRes, IApiPlayerListReq, IApiPlayerListRes, IApiRoomCreateReq, IApiRoomCreateRes } from "./Api"
import { ApiMsgEnum } from "./Enum"
import { IMsgClientSync, IMsgPlayerList, IMsgServerSync } from "./Msg"

export interface IModel {
    api: {
        [ApiMsgEnum.ApiPlayerJoin]: {
            req: IApiPlayerJoinReq
            res: IApiPlayerJoinRes
        },
        [ApiMsgEnum.ApiPlayerList]: {
            req: IApiPlayerListReq
            res: IApiPlayerListRes
        },
        [ApiMsgEnum.ApiRoomCreate]: {
            req: IApiRoomCreateReq
            res: IApiRoomCreateRes
        }
    }

    msg: {
        [ApiMsgEnum.MsgClientSync]: IMsgClientSync,
        [ApiMsgEnum.MsgPlayerList]: IMsgPlayerList,
        [ApiMsgEnum.MsgServerSync]: IMsgServerSync
    }
}
