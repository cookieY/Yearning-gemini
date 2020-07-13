import {Module, VuexModule, Mutation, getModule} from 'vuex-module-decorators'
import store from "@/store";
import {order} from "@/interface";

@Module({namespaced: true, name: 'modules_verify', dynamic: true, store})
class init_args extends VuexModule {
    order_item: order = {
        work_id: '',
        idc: '',
        source: '',
        data_base: '',
        table: '',
        text: '',
        delay: null,
        type: 0,
        status: 0,
        username: '',
        date: '',
        rejected: '',
        execute_time: '',
        backup: 0,
        assigned: ''
    }

    @Mutation
    fetch_order_item(vm: order) {
        this.order_item = vm
    }
}


const module_init_args = getModule(init_args)
export default module_init_args
