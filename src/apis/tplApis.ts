import libs from "@/libs/libs";
import {request} from "@/libs/requests";
import {TplOrder} from "@/interface";

const TplCommonPath = {
    basic: `${libs.url}/manage/tpl`,
}

export interface Tpl {
    steps: TplOrder[];
    source: string;
}

export function TplAllSourceFetchApi() {
    return request({
        method: 'get',
        url: TplCommonPath.basic
    })
}

export function TplFetchProfile(args: string) {
    return request({
        method: 'put',
        params: {
            source: args
        },
        url: TplCommonPath.basic
    })
}

export function TplCreateOrEditApi(args:Tpl) {
    return request({
        method: 'post',
        data: args,
        url: TplCommonPath.basic
    })
}