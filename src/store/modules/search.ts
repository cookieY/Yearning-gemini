import {Module, VuexModule, Mutation, getModule} from 'vuex-module-decorators'
import store from "@/store";

export interface Finder {
    picker: string[]
    valve: boolean
    text: string
    explain: string
    work_id: string
    type: number,
    status: number
}

@Module({namespaced: true, name: 'modules_search', dynamic: true, store})
class search extends VuexModule {

    find: Finder = {
        picker: [],
        valve: false,
        text: '',
        explain: '',
        work_id: '',
        type: 2,
        status: 7
    }

    @Mutation
    post_search_args(vm: Finder) {
        this.find = vm
    }
}

const modules_search = getModule(search)

export default modules_search
