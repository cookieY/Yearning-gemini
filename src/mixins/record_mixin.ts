import {Component, Mixins} from "vue-property-decorator";
import att_mixins from "@/mixins/att";
import axios from "axios";

@Component({components: {}})
export default class record_mixins extends Mixins(att_mixins) {
    tab_columns = [
        {
            title: '工单',
            key: 'WorkId'
        },
        {
            title: '工单说明',
            key: 'Text',
            tooltip: true
        },
        {
            title: '执行时间',
            key: 'ExecuteTime',
            sortType: 'desc'
        },
        {
            title: '申请人',
            key: 'Username'
        },
        {
            title: '真实姓名',
            key: 'RealName'
        },
        {
            title: '审核/执行人',
            key: 'Assigned'
        },
        {
            title: '执行人',
            key: 'Executor'
        },
        {
            title: '环境',
            key: 'IDC'
        },
        {
            title: '连接名称',
            key: 'Source'
        },
        {
            title: '库名',
            key: 'DataBase'
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            slot: 'action'
        }
    ];
    dataInfo = [] as any;

    currentPage(vl = 1) {
        axios.put(`${this.$config.url}/audit/record`, {
            page: vl,
            find: this.find
        })
            .then(res => {
                if (!res.data.multi) {
                    for (let i = 0; i < this.tab_columns.length; i++) {
                        if (this.tab_columns[i].key === 'Executor') {
                            this.tab_columns.splice(i, 1)
                        }
                    }
                }
                this.dataInfo = res.data.data;
                this.dataInfo.forEach((item: { Backup: string | number; }) => {
                    (item.Backup === 1) ? item.Backup = '是' : item.Backup = '否'
                });
                this.page_number = parseInt(res.data.page)
            })
            .catch(error => {
                        this.$config.err_notice(this,error)
                    })
    }

    queryData() {
        this.find.valve = true;
        this.currentPage()
    }

    queryCancel() {
        this.find = this.$config.clearPicker(this.find);
        this.current = 1;
        this.currentPage()
    }

    openOrder(row: { WorkId: string, Status: string }) {
        this.$router.push({
            name: 'order_detail',
            query: {
                workid: row.WorkId,
                status: row.Status
            }
        })
    }

    mounted() {
        this.currentPage()
    }
}
