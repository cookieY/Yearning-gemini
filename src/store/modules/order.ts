import {Module, VuexModule, Mutation, getModule} from 'vuex-module-decorators'
import store from '@/store'
import {order} from '@/interface'
// @ts-ignore
import Message from 'view-design/src/components/message'
import sqlFormatter from "sql-formatter";

interface SQLTest {
    status?: string
    level?: number
    sql?: string
    error?: string
    affect_rows?: number
}

@Module({dynamic: true, store, name: 'modules_order', namespaced: true})
class order_local extends VuexModule {
    steps: number = 0
    is_dml: boolean = false
    sql: string = ''
    sql_order: order = {
        export: 0,
    }
    order: order = {
        tp: 0,
        idc: '',
        source: '',
        data_base: '',
        table: '',
        text: '',
        delay: '',
        assigned: '',
        backup: 1,
        export: 0,
        uuid: ''
    }
    always: object = {
        one: true,
        two: false,
        three: false
    }
    wordList: object[] = []
    osc_id: string = ''
    order_sql: SQLTest[] = []

    @Mutation
    fetch_order_sql(vm: object[]) {
        return this.order_sql = vm
    }

    @Mutation
    fetch_order_osc_id(vm: string) {
        return this.osc_id = vm
    }

    @Mutation
    clear_order() {
        this.order = {
            idc: '',
            source: '',
            data_base: '',
            table: '',
            text: '',
            delay: '',
            assigned: '',
            backup: 1,
            export: 0,
            tp: 0
        }
        this.steps = 0
        this.sql = ''
        this.wordList = []
    }

    @Mutation
    beauty_sql() {
        this.sql = sqlFormatter.format(this.sql)
    }

    @Mutation
    clear_always() {
        this.always = {one: true, two: false, three: false}
    }

    @Mutation
    changed_wordList(vm: object[]) {
        this.wordList = vm
    }

    @Mutation
    changed_always(vm: object) {
        this.always = vm
    }

    @Mutation
    changed_step(vm: number) {
        this.steps = vm
    }

    @Mutation
    changed_is_dml(vm: boolean) {
        this.is_dml = vm
    }

    @Mutation
    save_sql(sql: string) {
        this.sql = sql
    }
}

const modules_order = getModule(order_local)

export default modules_order
