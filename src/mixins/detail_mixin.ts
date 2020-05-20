import {Component, Mixins} from "vue-property-decorator";
import expandRow from "@/components/expandTable.vue";
import axios from 'axios'
import att from "@/mixins/att";

@Component({components: {}})
export default class detail_mixins extends Mixins(att) {
    columns = [
        {
            title: 'sql语句',
            key: 'SQL',

        },
        {
            title: '状态',
            key: 'State',
        },
        {
            title: '错误信息',
            key: 'Error',
            tooltip: true
        },
        {
            title: '影响行数',
            key: 'Affectrow',
            width: 100
        },
        {
            title: '执行时间/秒',
            key: 'Time',
        }
    ];
    TableDataNew = [];
    reload_sql = false;
    formItem = {} as any;
    rollColumn = [
        {
            type: 'expand',
            width: 50,
            render: (h: any, params: { row: {SQL:string} }) => {
                return h(expandRow, {
                    props: {
                        row: params.row.SQL
                    }
                })
            }
        },
        {
            title: '当前检查的sql',
            key: 'SQL',
            render: (h: any, params: { row: { SQL: string } }) => {
                let text = params.row.SQL.substring(0, 80)
                if (text.length > 80) {
                    text += '...';
                }
                return h('span', text)
            }

        },
    ];
    rollData = [] as any;

    rollback() {
        axios.get(`${this.$config.url}/fetch/roll?workid=${this.$route.query.workid}`)
            .then(res => {
                if (res.data.sql === []) {
                    this.$config.err_notice(this,"无sql回滚语句");
                    return
                }
                this.reload_sql = true;
                this.formItem = res.data.order;
                this.rollData = res.data.sql;
                this.formItem.Delay = 'none';
            })
            .catch(err => {
                this.$config.err_notice(this, err)
            })
    }

    repairOrder() {
        axios.get(`${this.$config.url}/fetch/roll?workid=${this.$route.query.workid}`)
            .then(res => {
                this.formItem = res.data.order;
                this.formItem.Delay = 'none';
            })
            .catch(error => {
                this.$config.err_notice(this, error)
            });
        this.reload_sql = true
    }

    referOrder() {
        if (this.$route.query.status === '1') {
            let sql = '';
            this.rollData.forEach((item: { SQL: string; }) => {
                sql += item.SQL
            });
            this.formItem.SQL = sql;
        }
        // delete this.formItem.ID;
        axios.post(`${this.$config.url}/fetch/rollorder`, {
            'data': this.formItem
        })
            .then(() => {
                this.$config.notice('工单已提交成功')
            })
            .catch(error => {
                this.$config.err_notice(this, error)
            })
    }

    current_page(vl = 1) {
        axios.get(`${this.$config.url}/fetch/detail?workid=${this.$route.query.workid}&status=${this.$route.query.status}&page=${vl}`)
            .then(res => {
                this.TableDataNew = res.data.record;
                this.page_number = res.data.count;
            })
            .catch(error => {
                this.$config.err_notice(this, error)
            })
    }

    mounted() {
        this.current_page()
    }
}

