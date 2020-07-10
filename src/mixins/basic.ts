import {Component, Vue} from "vue-property-decorator";
import {test_results, High_light, Connection_list} from "@/interface";

@Component({components: {}})
export default class att_mixins extends Vue {
    public $config: any;
    public $http: any;

    get is_dml () {
        return this.$store.state.is_dml
    }

    get formItem() {
        return this.$store.state.order
    }

    get wordList () {
        return this.$store.state.wordList
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
        admin: '',
        is_query: '',
        tp:'',
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
        person: [],
        multi: false
    };

    fetch_page(vl: number, url: string) {
        this.$http.put(url, {
            page: vl,
            find: this.$store.state.search_args.find
        })
            .then((res: { data: { multi: boolean; data: never[]; page: number; multi_list: string[]; source: never[]; query: never[]; audit: never[]; group_list: never[] }; }) => {
                if (!res.data.multi) {
                    for (let i = 0; i < this.columns.length; i++) {
                        if (this.columns[i].key === 'executor') {
                            this.columns.splice(i, 1)
                        }
                    }
                }
                // 通用fetch
                this.table_data = res.data.data;
                this.page_number = res.data.page;
                // 权限组fetch
                this.connectionList.connection = res.data.source;
                this.connectionList.query = res.data.query;
                this.connectionList.person = res.data.audit;
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

    cancel() {
        this.$emit("input", false)
    }
}
