import libs from "@/libs/libs";
import {request} from "@/libs/requests";
import {Permission} from "@/interface";

const RolesCommonPath = {
    basic: `${libs.url}/manage/roles`,
}

export function RolesCreateOrEditApi(args: any) {
    return request({
        method: 'post',
        data: args,
        url: RolesCommonPath.basic
    })
}

export function RolesFetchApi() {
    return request({
        method: 'put',
        url: RolesCommonPath.basic
    })
}