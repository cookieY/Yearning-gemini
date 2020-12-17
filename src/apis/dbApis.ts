import libs from "@/libs/libs";
import {request} from "@/libs/requests";

const DBCommonPath = {
    basic: `${libs.url}/manage/db`,
}

export interface DB {
    idc: string,
    source: string,
    ip: string,
    port: number,
    username: string,
    password: string,
    is_query: number
}

interface DBExplorer {
    tp: string  // 类型flag
    db: DB
}

interface DBFinder {
    page: number,
    find: any
}

export function DBFetchApi(args: DBFinder) {
    return request({
        method: 'put',
        data: args,
        url: DBCommonPath.basic
    })
}

export function DBDeleteApi(args: string) {
    return request({
        method: 'delete',
        params: {
            source: args
        },
        url: DBCommonPath.basic
    })
}

export function DBCreateOrEditApi(args: DBExplorer) {
    return request({
        method: 'post',
        data: args,
        url: DBCommonPath.basic
    })
}