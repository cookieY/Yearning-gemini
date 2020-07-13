import {Module, VuexModule, Mutation, getModule} from 'vuex-module-decorators'
import store from "@/store";

interface Finder {
    picker: string[]
    valve: boolean
    text: string
}

@Module({namespaced: true, name: 'modules_search', dynamic: true, store})
class search extends VuexModule {

    find: Finder = {
        picker: [],
        valve: false,
        text: ''
    }

    @Mutation
    post_search_args(vm: Finder) {
        this.find = vm
    }
}

const modules_search = getModule(search)

export default modules_search
