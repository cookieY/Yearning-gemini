import libs from "@/libs/libs";
import {request} from "@/libs/requests";

const AutoTaskCommonPath = {
    basic: `${libs.url}/manage/task`,
}


interface task {
    id?: number;
    name?: string;
    source?: string;
    data_base?: string;
    table?: string;
    tp?: number;
    affect_rows?: number
    status?: number
}

interface AutoTaskExplorer {
    tp: string  // 类型flag
    task: task
}

interface AutoTaskFinder {
    page: number,
    find: any
}

export function AutoTaskCreateOrEditApi(args: AutoTaskExplorer) {
    return request({
        method: 'post',
        data: args,
        url: AutoTaskCommonPath.basic
    })
}

export function AutoTaskFetchApi(args: AutoTaskFinder) {
    return request({
        method: 'put',
        data: args,
        url: AutoTaskCommonPath.basic
    })
}

export function AutoTaskDeleteApi(args: number) {
    return request({
        method: 'delete',
        params: {
            id: args
        },
        url: AutoTaskCommonPath.basic
    })
}