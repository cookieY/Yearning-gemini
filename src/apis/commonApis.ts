import libs from "@/libs/libs";
import {request} from "@/libs/requests";

const CommonPath = {
    base: `${libs.url}/fetch`,
    post: `${libs.url}/common/post`
}


export interface CommonFetch {
    work_id?: string;
    idc?: string;
    tp?: string;
    source?: string;
    data_base?: string;
    table?: string;
    limit?: string;
    status?: number;
    page?: number;
    sql?: string;
    title?: string;
    is_dml?: boolean;
}

export function FetchCommonGetApis(tp: string, args: CommonFetch) {
    return request({
        method: 'get',
        url: `${CommonPath.base}/${tp}`,
        params: args
    })
}

export function PostOrder(args: any) {
    return request({
        method: 'post',
        url: CommonPath.post,
        data: args
    })
}

export function FetchCommonPutApis(tp: string, args: any) {
    return request({
        method: 'put',
        url: `${CommonPath.base}/${tp}`,
        data: args
    })
}

export function FetchCommonPostApis(tp: string, args: any) {
    return request({
        method: 'post',
        url: `${CommonPath.base}/${tp}`,
        data: args
    })
}

export function FetchCommonDeleteApis(tp: string) {
    return request({
        method: 'delete',
        url: `${CommonPath.base}/${tp}`,
    })
}