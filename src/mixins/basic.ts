import {Component, Vue} from "vue-property-decorator";
import {test_results, High_light, Connection_list} from "@/interface";
import modules_order from "@/store/modules/order";
import modules_search from "@/store/modules/search";

@Component({components: {}})
export default class att_mixins extends Vue {
    public $config: any;
    public $http: any;

    get steps() {
        return modules_order.steps
    }

    get always() {
        return modules_order.always
    }

    get is_dml() {
        return modules_order.is_dml
    }

    get formItem() {
        return modules_order.order
    }

    get wordList() {
        return modules_order.wordList
    }

    get sql () {
        return modules_order.sql
    }

    set sql (vl) {
        modules_order.save_sql(vl)
    }

    // 通用

    ruleValidate = {
        idc: [
            {
                required: true,
                message: '环境地址不得为空',
                trigger: 'change'
            }
        ],
        source: [
            {
                required: true,
                message: '连接名不得为空',
                trigger: 'change'
            }
        ],
        data_base: [
            {
                required: true,
                message: '数据库名不得为空',
                trigger: 'change'
            }
        ],
        table: [
            {
                required: true,
                message: '数据表名不得为空',
                trigger: 'change'
            }
        ],
        tp: [
            {
                required: true,
                message: '类型不得为空',
                trigger: 'change'
            }
        ],
        name: [
            {
                required: true,
                message: '名称不得为空',
                trigger: 'blur'
            }
        ],
        text: [
            {
                required: true,
                message: '提交说明不得为空',
                trigger: 'blur'
            }
        ],
        assigned: [
            {
                required: true,
                message: '审核人不得为空',
                trigger: 'change'
            }
        ],
        backup: {required: true, type: 'number', message: '备份不得为空', trigger: 'change'}
    };

    find = {
        picker: [],
        valve: false,
        text: ''
    };

    general = {
        ip: '',
        username: '',
        password: '',
        port: '',
        is_query: 2,
        tp: '',
        idc: '',
        source: '',
        name: '',
        data_base: '',
        table: '',
        row: 0
    }

    is_open = false;

    edit_password = false;

    columns: any[] = []

    table_data = [];

    page_number = 1;

    current = 1;

    // spin loading
    loading = false;

    // user&db
    query = {
        user: '',
        department: '',
        valve: false,
        username: '',
        idc: '',
        source: ''
    };

    //order
    testResults: test_results[] = [];
    // order button disable
    validate_gen = true;

    multi_list: string[] = []

    connectionList: any = {
        connection: [],
        query: [],
        person: []
    };

    setCompletions(editor: any, session: any, pos: any, prefix: any, callback: (arg0: null, arg1: { caption: any; value: any; meta: any; }[]) => void) {
        callback(null, this.wordList.map(function (word: any) {
            return {
                caption: word.vl,
                value: word.vl,
                meta: word.meta
            }
        }))
    }

    editorInit() {
        require('brace/mode/mysql');
        require('brace/theme/xcode')
    }

    beauty() {
        modules_order.beauty_sql()
    }

    resetFields(key: string) {
        let reset: any = this.$refs[key]
        reset.resetFields()
    }

    fetch_page(vl: number, url: string) {
        this.$http.put(url, {
            page: vl,
            find: modules_search.find
        })
            .then((res: { data: { multi: boolean; data: never[]; page: number; multi_list: string[]; source: never[]; query: never[]; common: never[]; group_list: never[] }; }) => {
                // 通用fetch
                this.table_data = res.data.data;
                this.page_number = res.data.page;
                // 权限组fetch
                this.connectionList.connection = res.data.source;
                this.connectionList.query = res.data.query;
                this.connectionList.person = res.data.common;
            })
            .catch((error: any) => {
                this.$config.err_notice(this, error)
            })
    }

    invalidDate = {
        disabledDate(date: number) {
            return date && date.valueOf() < Date.now() - 86400000
        }
    };

    fetch_perform() {
        this.$http.get(`${this.$config.url}/fetch/perform`)
            .then((res: { data: { perform: string[], multi: boolean }; }) => {
                this.multi_list = res.data.perform
            })
            .catch((err: any) => this.$config.err_notice(this, err))
    }

    getDate (vl:string) {
        this.formItem.delay
    }

    cancel() {
        this.$emit("input", false)
    }
}
