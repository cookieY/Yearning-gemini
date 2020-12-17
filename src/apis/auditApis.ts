import libs from "@/libs/libs";
import {request} from "@/libs/requests";

const AuditCommonPath = {
    admin: `${libs.url}/audit/order`,
}

interface SQLAuditOrder {
    work_id: string;
    perform?: string;
    flag?: number;
    tp?: string;
    text?: string;
}

export function AuditTestSQL(args: SQLAuditOrder) {
    return request({
        method: 'post',
        url: `${AuditCommonPath.admin}/test`,
        data: args
    })
}


export function AuditExecuteSQL(args: SQLAuditOrder) {
    return request({
        method: 'post',
        url: `${AuditCommonPath.admin}/execute`,
        data: args
    })
}

export function AuditStateSQL(args: SQLAuditOrder) {
    return request({
        method: 'post',
        url: `${AuditCommonPath.admin}/state`,
        data: args
    })
}

export function AuditKillOrder(args: SQLAuditOrder) {
    return request({
        method: 'post',
        url: `${AuditCommonPath.admin}/kill`,
        data: args
    })
}
