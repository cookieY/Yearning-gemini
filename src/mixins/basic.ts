import {Component, Vue} from "vue-property-decorator";
import {test_results, High_light, Connection_list, Res} from "@/interface";
import modules_order from "@/store/modules/order";
import modules_search, {Finder} from "@/store/modules/search";
import {AxiosResponse} from "axios";
import {request} from "@/libs/requests";
import {FetchCommonGetApis} from "@/apis/commonApis";

@Component({components: {}})
export default class att_mixins extends Vue {
    public $config: any;
    public $Spin: any;
    public url = ''
    public user = sessionStorage.getItem('user')

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

    get order_text() {
        return modules_order.sql
    }

    set order_text(vl) {
        modules_order.save_sql(vl)
    }

    get sql_order() {
        return modules_order.sql_order
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
        text: '',
        explain: '',
        work_id: '',
        type: 2,
        status: 7,
        source: '',
        idc: '',
        dept: '',
        username: ''
    };

    general = {
        id: 0,
        ip: '',
        username: '',
        password: '',
        port: 0,
        is_query: 2,
        tp: 0,
        idc: '',
        source: '',
        name: '',
        data_base: '',
        table: '',
        affect_rows: 0
    }

    is_open = false;

    edit_password = false;

    columns: any[] = []

    table_data = [];

    page_number = 1;

    current = 1;

    // spin loading
    loading = false;

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

    queryData() {
        this.find.valve = true;
        modules_search.post_search_args(this.find)
        this.current_page();
    }

    queryCancel() {
        this.find = {} as any
        modules_search.post_search_args(this.find)
        this.current_page();
    }

    current_page(vl = 1) {
        this.fetch_page(vl, this.url)
    }

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
        request.put(url, {
            page: vl,
            find: modules_search.find
        })
            .then((res: AxiosResponse<Res>) => {
                // 通用fetch
                this.table_data = res.data.payload.data;
                this.page_number = res.data.payload.page;
                // 权限组fetch
                this.connectionList.connection = res.data.payload.source;
                this.connectionList.query = res.data.payload.query;
                this.connectionList.person = res.data.payload.auditor;
                // 用户
                this.connectionList.multi = res.data.payload.multi;
            })
    }

    invalidDate = {
        disabledDate(date: number) {
            return date && date.valueOf() < Date.now() - 86400000
        }
    };

    fetch_perform() {
        FetchCommonGetApis('perform',{})
            .then((res:AxiosResponse<Res>) => {
                this.multi_list = res.data.payload.perform
            })
    }

    getDate(vl: string) {
        this.formItem.delay = vl
    }

    cancel() {
        this.$emit("input", false)
    }
}