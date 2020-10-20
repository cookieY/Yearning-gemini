import {Module, VuexModule, Mutation, getModule} from 'vuex-module-decorators'
import store from "@/store";
import {order, StepOrder} from "@/interface";

@Module({namespaced: true, name: 'modules_init', dynamic: true, store})
class init_args extends VuexModule {
    order_item: order = {
        work_id: '',
        idc: '',
        source: '',
        data_base: '',
        table: '',
        text: '',
        delay: '',
        type: 0,
        status: 0,
        username: '',
        date: '',
        rejected: '',
        execute_time: '',
        backup: 0,
        assigned: '',
        current_step: 0
    }

    order_sql = ''

    order_step: StepOrder[] = [{desc: '', auditor: [], type: 0}]

    @Mutation
    fetch_order_step(vl: StepOrder[]) {
        this.order_step = vl
    }

    @Mutation
    fetch_order_item(vm: order) {
        this.order_item = vm
    }

    @Mutation
    fetch_order_sql(vm: string) {
        this.order_sql = vm
    }
}


const module_init_args = getModule(init_args)
export default module_init_args
