import {Module, VuexModule, Mutation, getModule} from 'vuex-module-decorators'
import store from "@/store";


interface Edit {
    id?: number
    username?: string
    department?: string
    real_name?: string
    rule?: string
    email?: string
    password?: string
}

@Module({namespaced: true, name: 'modules_user', dynamic: true, store})
class user extends VuexModule {

    edit: Edit = {
        id: 0,
        username: '',
        department: '',
        real_name: '',
        rule: '',
        email: '',
        password: ''
    }

    @Mutation
    fetch_user_info(vm: object) {
        this.edit = vm
    }
}

const module_user = getModule(user)

export default module_user
