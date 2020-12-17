import libs from "@/libs/libs";
import {request} from "@/libs/requests";
import {order} from "@/interface";

const DashCommonPath = {
    base: `${libs.url}/dash`
}

export function DashPutApi(tp: string) {
    return request({
        method: 'put',
        url: `${DashCommonPath.base}/${tp}`,
    })
}

export function DashGetApi(tp: string) {
    return request({
        method: 'get',
        url: `${DashCommonPath.base}/${tp}`,
    })
}