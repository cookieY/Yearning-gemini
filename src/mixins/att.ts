import {Component, Vue} from "vue-property-decorator";

@Component({components: {}})
export default class att_mixins extends Vue {
    $config: any;
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
        id: '',
        isquery: 2,
        ip: '',
        add: '',
        username: '',
        password: '',
        port: ''
    };
    wordList: Array<any> = [];

    page_number = 1;
    current = 1;
    find = {
        picker: [],
        user: '',
        valve: false
    };
    query = {
        user: '',
        department: '',
        valve: false,
        username: '',
        computer_room: '',
        connection_name: ''
    };

    table_data = [];

    //order
    testResults = [] as any;
    // order button disable
    validate_gen = true;
    // spin loading
    loading = false;

    // own-space
    is_open = false;
    group_list = [];
    group_props = [];
    edit_password = false;
    savePassLoading = false;  // 保存更改密码loading按钮状态


    cancel_password() {
        this.edit_password = false
    }
}
