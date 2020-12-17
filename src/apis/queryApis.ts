import libs from "@/libs/libs";
import {request} from "@/libs/requests";
import {order} from "@/interface";

const AuditCommonPath = {
    admin: `${libs.url}/audit/query`,
    base: `${libs.url}/query`
}

interface QueryOrderProfile {
    work_id?: string;
    page?: number;
    tp?: string;
    title?: string;
    source?: string;
    data_base?: string;
    table?: string;
}

export function FetchAuditQueryProfile(args: QueryOrderProfile) {
    return request({
        method: 'put',
        url: `${AuditCommonPath.admin}/profile`,
        data: args
    })
}

export function DeleteEmptyAuditQuery() {
    return request({
        method: 'delete',
        url: `${AuditCommonPath.admin}/clear`,
    })
}

export function ChangeAuditQueryState(args: QueryOrderProfile) {
    return request({
        method: 'post',
        url: `${AuditCommonPath.admin}/state`,
        data: args
    })
}

export function CommonGetApis(tp: string, args: QueryOrderProfile) {
    return request({
        method: 'get',
        url: `${AuditCommonPath.base}/${tp}`,
        params: args
    })
}

export function CommonDeleteApis(tp: string) {
    return request({
        method: 'delete',
        url: `${AuditCommonPath.base}/${tp}`,
    })
}

export function CommonPutApis(tp: string, args: any) {
    return request({
        method: 'put',
        url: `${AuditCommonPath.base}/${tp}`,
        data: args
    })
}

export function CommonPostApis(tp: string, args: order) {
    return request({
        method: 'post',
        url: `${AuditCommonPath.base}/${tp}`,
        data: args
    })
}

