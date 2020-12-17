import libs from "@/libs/libs";
import {request} from "@/libs/requests";
import {CommonFinder} from "@/interface";

const UserCommonPath = {
    basic: `${libs.url}/manage/user`,
}

interface User {
    username: string
    password: string
    department: string
    real_name: string
    rule: string
    email: string
}

interface UserExplorer {
    tp?: string  // 类型flag
    user?: User
}


export function UserFetchApi(args: CommonFinder) {
    return request({
        method: 'put',
        data: args,
        url: UserCommonPath.basic
    })
}

export function UserCreateOrEditApi(args: UserExplorer) {
    return request({
        method: 'post',
        data: args,
        url: UserCommonPath.basic
    })
}

export function UserDependGetApi(args:  { user: string, tp: string }) {
    return request({
        method: 'get',
        params: args,
        url: UserCommonPath.basic
    })
}

export function UserDeleteApi(args: string) {
    return request({
        method: 'delete',
        params: {user: args},
        url: UserCommonPath.basic
    })
}