import {Module, VuexModule, Mutation, getModule} from 'vuex-module-decorators'
import store from '@/store'
import {order} from '@/interface'
// @ts-ignore
import Message from 'view-design/src/components/message'
import sqlFormatter from "sql-formatter";

interface SQLTest {
    status?: string
    level?: number
    sql?:string
    error?:string
    affect_rows?: number
}

@Module({dynamic: true, store, name: 'modules_order', namespaced: true})
class order_local extends VuexModule {
    steps: number = 0
    is_dml: boolean = false
    sql: string = ''
    order: order = {
        idc: '',
        source: '',
        data_base: '',
        table: '',
        text: '',
        delay: null,
        assigned: '',
        backup: 1,
        export: 0
    }
    always: object = {
        one: true,
        two: false,
        three: false
    }
    wordList: object[] = []
    ddl_save: boolean = false
    dml_save: boolean = false
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
    draft_order() {
        if (this.is_dml) {
            this.dml_save = !this.dml_save
        } else {
            this.ddl_save = !this.ddl_save
        }
        Message.success({content: '工单已保存!'})
    }

    @Mutation
    clear_order() {
        this.order = {
            idc: '',
            source: '',
            data_base: '',
            table: '',
            text: '',
            delay: null,
            assigned: '',
            backup: 1,
            export: 0
        }
        this.sql = ''
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
