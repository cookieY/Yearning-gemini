import libs from "@/libs/libs";
import {request} from "@/libs/requests";

const PasswordCommonPath = {
    admin: `${libs.url}/manage/user`,
    common: `${libs.url}/common/edit`
}

interface Password {
    username: string;
    password: string;
    tp?: string
}

export function AdminChangePassword(args: Password) {
    return request({
        method: 'post',
        data: {
            tp: 'password',
            user: args
        },
        url: PasswordCommonPath.admin
    })
}

export function CommonChangePassword(args: Password) {
    return request({
        method: 'put',
        data: args,
        params: {tp: 'password'},
        url: PasswordCommonPath.common
    })
}