import libs from "@/libs/libs";
import {request} from "@/libs/requests";
import {Permission} from "@/interface";

const GroupCommonPath = {
    basic: `${libs.url}/manage/group`,
}


interface group {
    permission?: Permission
    username?: string
    tp?: number
    group?: string | string[]
}

export function GroupCreateOrEditApi(args: group) {
    return request({
        method: 'post',
        data: args,
        url: GroupCommonPath.basic
    })
}

export function GroupFetchApi(args: group) {
    return request({
        method: 'get',
        params: args,
        url: GroupCommonPath.basic
    })
}

export function GroupDeleteApi(args: string) {
    return request({
        method: 'delete',
        params: {
            clear: args
        },
        url: GroupCommonPath.basic
    })
}