import {Component, Vue} from "vue-property-decorator";
import {test_results, High_light, Connection_list} from "@/interface";

@Component({components: {}})
export default class att_mixins extends Vue {
    public $config: any;
    public $http: any;

    formItem = {
        source: '',
        database: '',
        textarea: '',
        backup: 1,
        text: '',
        idc: '',
        table: '',
        assigned: '',
        delay: null,
        tp: 0,
        row: 1,
        name: '',
        is_query: 2,
        ip: '',
        add: '',
        username: '',
        password: '',
        port: '',
        id: 0,
        admin: []
    };

    wordList: High_light[] = [];

    // 通用
    find = {
        picker: [],
        valve: false,
        text: ''
    };

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

    cancel() {
        this.$emit("input", false)
    }
}
