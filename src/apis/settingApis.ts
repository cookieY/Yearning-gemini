import libs from "@/libs/libs";
import {request} from "@/libs/requests";
import {message_modal, other_modal, Permission} from "@/interface";

const SettingCommonPath = {
    basic: `${libs.url}/manage/setting`,
}

interface settings {
    ldap?: any;
    message?: message_modal;
    other?: other_modal;
    date?: string;
    tp?: boolean;
}

export function SettingCreateOrEditApi(args: settings) {
    return request({
        method: 'post',
        data: args,
        url: SettingCommonPath.basic
    })
}

export function SettingFetchApi() {
    return request({
        method: 'get',
        url: SettingCommonPath.basic
    })
}

export function SettingMessageTestApi(tp: string, args: message_modal) {
    return request({
        method: 'put',
        url: SettingCommonPath.basic,
        data: {
            mail:args
        },
        params: {
            test: tp
        }
    })
}

export function SettingLDAPTestApi(args: any) {
    return request({
        method: 'put',
        url: SettingCommonPath.basic,
        data: {
            ldap:args
        },
        params: {
            test: 'ldap'
        }
    })
}

export function SettingDeleteTestApi(args: settings) {
    return request({
        method: 'delete',
        url: SettingCommonPath.basic,
        params: args
    })
}