import {Module, VuexModule, Mutation, getModule} from 'vuex-module-decorators'
import store from "@/store";

interface group {
    username: string
    list: []
    group: string[]
}

@Module({namespaced: true, name: 'modules_verify', dynamic: true, store})
class verify extends VuexModule {
    group: group = {
        username: '',
        list: [],
        group: []
    }

    @Mutation
    fetch_user_permissions(vm: group) {
        this.group = vm
    }
}

const module_verify = getModule(verify)

export default module_verify
