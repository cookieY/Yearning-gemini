import {request} from "@/libs/requests";


const LoginCommonPath = {
    basic: '/login',
    ldap: '/ldap'
}


interface LoginForm {
    username: string;
    password: string;
}


export function LoginApi(isLdap: boolean, args: LoginForm) {
    return request({
        url: isLdap ? LoginCommonPath.ldap : LoginCommonPath.basic,
        method: "post",
        data: args
    })
}

