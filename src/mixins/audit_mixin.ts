import axios from 'axios'
import expandRow from "../components/expandTable.vue";
import audit_reject from "../views/general/audit_reject.vue"
import audit_detail from "../views/general/audit_detail.vue"
import audit_osc from '../views/general/audit_osc.vue'
import {Component,  Mixins} from "vue-property-decorator";
import att_mixins from "@/mixins/att";

@Component({components: {audit_reject, audit_detail, audit_osc}})
export  default class audit_mixins extends Mixins(att_mixins) {

    columns = [
        {
            title: '工单编号:',
            key: 'WorkId',
            sortable: true,
            sortType: 'desc',
            width: 155
        },
        {
            title: '工单说明:',
            key: 'Text',
            tooltip: true
        },
        {
            title: '是否备份',
            key: 'Backup',
            width: 100
        },
        {
            title: '提交时间:',
            key: 'Date',
            sortable: true
        },
        {
            title: '提交账号',
            key: 'Username',
            sortable: true
        },
        {
            title: '真实姓名',
            key: 'RealName',
            sortable: true
        },
        {
            title: '定时执行',
            key: 'Delay',
            slot: 'delay'
        },
        {
            title: '执行人',
            key: 'Executor',
            sortable: true
        },
        {
            title: '状态',
            key: 'Status',
            width: 150,
            render: (h: any, params: { row: { Status: number } }) => {
                const row = params.row;
                let color = '';
                let text = '';
                if (row.Status === 2) {
                    color = 'primary';
                    text = '待审核'
                } else if (row.Status === 0) {
                    color = 'error';
                    text = '驳回'
                } else if (row.Status === 1) {
                    color = 'success';
                    text = '执行成功'
                } else if (row.Status === 4) {
                    color = 'error';
                    text = '执行失败'
                } else if (row.Status === 5) {
                    color = 'default';
                    text = '待执行'
                } else {
                    color = 'warning';
                    text = '执行中'
                }
                return h('Tag', {
                    props: {
                        type: 'dot',
                        color: color
                    }
                }, text)
            },
            sortable: true
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            slot: 'action'
        }
    ];
    sql_columns = [
        {
            type: 'expand',
            width: 50,
            render: (h: any, params: { row: object }) => {
                return h(expandRow, {
                    props: {
                        row: params.row
                    }
                })
            }
        },
        {
            title: '当前检查的sql',
            key: 'SQL',
            render: (h: any, params: { row: { SQL: string } }) => {
                let text = params.row.SQL.substring(0, 40) + '...';
                return h('span', text)
            }

        },
        {
            title: '阶段',
            key: 'Status',
            width: '150'
        },
        {
            title: '错误等级',
            key: 'Level',
            width: '100'
        },
        {
            title: '错误信息',
            key: 'Error',
            tooltip: true
        },
        {
            title: '影响行数',
            key: 'AffectRows',
            width: '120'
        }
    ];
    tableData = [];
    multi = false;
    multi_list = [];
    auth = sessionStorage.getItem('auth');
    reboot = 0;
    valve = true;
    is_order = false;
    is_osc = false;

    delayKill(vl: { WorkId: string }) {
        axios.get(`${this.$config.url}/audit/kill/${vl.WorkId}`)
            .then(res => {
                this.$config.notice(res.data);
                this.refreshData()
            })
            .catch(err => this.$config.err_notice(this,err))
    }

    timerOsc(vl: { WorkId: string }) {
        this.is_osc = true;
        this.$store.commit('fetch_order_osc_id', vl.WorkId);
    }

    oscClose() {
        this.is_osc = false
    }

    openOrder(row: { WorkId: string }) {
        axios.get(`${this.$config.url}/audit/sql?k=${row.WorkId}`)
            .then(res => {
                let formItem = {
                    WorkId: row.WorkId,
                    IDC: res.data.idc,
                    Source: res.data.source,
                    Delay: res.data.delay,
                    Base: res.data.base,
                    Text: res.data.text,
                    Table: res.data.table,
                    Type: res.data.type
                };
                this.$store.commit("fetch_order_item", formItem);
                this.$store.commit('fetch_order_sql', res.data.sql);
                this.is_order = true;
            })
            .catch(err => {
                        this.$config.err_notice(this,err)
                    })
    }

    agreedTo(multi_name: string, work_id: string) {
        if (multi_name === '') {
            this.$Message.error('请选择执行人!')
        } else {
            axios.post(`${this.$config.url}/audit/refer/perform`, {
                'perform': multi_name,
                'WorkId': work_id
            })
                .then(res => {
                    this.$config.notice(res.data);
                    this.is_order = false;
                    this.refreshData(this.current)
                })
                .catch(error => {
                        this.$config.err_notice(this,error)
                    })
        }
    }

    performTo(work_id: string) {
        this.is_order = false;
        axios.post(`${this.$config.url}/audit/execute`, {
            'workid': work_id
        })
            .then(res => {
                this.$config.notice(res.data);
                this.refreshData(this.current)
            })
            .catch(error => {
                        this.$config.err_notice(this,error)
                    })
    }

    rejectTo() {
        this.is_open = !this.is_open;
        this.is_order = !this.is_order;
    }

    rejectText() {
        this.is_open = !this.is_open;
        this.refreshData(this.current)
    }

    cancel_reject() {
        this.is_open = false;
    }

    cancel_detail() {
        this.is_order = false;
    }

    orderDetail(row: { WorkId: string, Status: number }) {
        this.$router.push({
            name: 'order_detail',
            query: {workid: row.WorkId, status: row.Status.toString()}
        })
    }

    refreshData(vl = 1) {
        axios.put(`${this.$config.url}/audit`, {
            page: vl,
            find: this.find
        })
            .then(res => {
                this.multi = res.data.multi;
                if (!this.multi) {
                    for (let i = 0; i < this.columns.length; i++) {
                        if (this.columns[i].key === 'Executor') {
                            this.columns.splice(i, 1)
                        }
                    }
                }
                this.tableData = res.data.data;
                this.tableData.forEach((item: { Backup: number | string }) => {
                    (item.Backup === 1) ? item.Backup = '是' : item.Backup = '否'
                });
                this.page_number = res.data.page;
                this.multi_list = res.data.multi_list;
            })
            .catch(error => {
                        this.$config.err_notice(this,error)
                    })
    }

    refreshForm(vl: boolean) {
        if (vl) {
            let vm = this;
            this.reboot = setInterval(function () {
                vm.refreshData(vm.current);
            }, 5000)
        } else {
            clearInterval(this.reboot)
        }
    }

    queryData() {
        this.find.valve = true;
        this.refreshData()
    }

    queryCancel() {
        this.find = this.$config.clearPicker(this.find);
        this.current = 1;
        this.refreshData()
    }

    mounted() {
        this.refreshData();
        this.refreshForm(this.valve)
    }

    destroyed() {
        clearInterval(this.reboot)
    }
}



//
// }
//     data() {
//         return {

//         }
//     },
//     methods: {

// };
