import libs from "@/libs/libs";
import {request} from "@/libs/requests";

const PasswordCommonPath = {
    common: `${libs.url}/common/edit`
}

interface Mail {
    email: string;
    real_name: string
}

export function CommonChangeEmail(args: Mail) {
    return request({
        method: 'put',
        data: args,
        params: {tp: 'mail'},
        url: PasswordCommonPath.common
    })
}