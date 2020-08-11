import {Component, Mixins} from "vue-property-decorator";
import expandRow from "@/components/expandTable.vue";
import att from "@/mixins/basic";
import module_init_args from "@/store/modules/init_args";

@Component({components: {}})
export default class detail_mixins extends Mixins(att) {
    columns = [
        {
            title: 'sql语句',
            key: 'sql',

        },
        {
            title: '状态',
            key: 'state',
        },
        {
            title: '错误信息',
            key: 'error',
            tooltip: true
        },
        {
            title: '影响行数',
            key: 'affect_row',
            width: 100
        },
        {
            title: '执行时间/秒',
            key: 'time',
        }
    ];

    results = [];

    switch_args = {
        reload_sql: false,
        is_more: '10'
    }

    get sqls() {
        return module_init_args.order_sql
    }

    set sqls(vl) {
        module_init_args.fetch_order_sql(vl)
    }

    get order() {
        return module_init_args.order_item
    }

    collapse = ['results', 'sql']

    fetch_post_sql(vl: string = '10') {
        let spin: any = this.$Spin;
        spin.show()
        this.$http.get(`${this.$config.url}/fetch/sql?work_id=${this.order.work_id}&limit=${vl}`)
            .then((res: { data: string; }) => {
                module_init_args.fetch_order_sql(res.data)
            })
            .catch((err: any) => this.$config.err_notice(this, err))
            .finally(() => {
                spin.hide()
            })
    }

    open_form() {
        this.is_open = true
    }

    delOrder(work_id: string) {
        this.$http.get(`${this.$config.url}/fetch/undo?work_id=${work_id}`)
            .then((res: { data: string; }) => {
                this.$config.notice(res.data);
                this.$router.go(-1)
            })
            .catch((error: any) => {
                this.$config.err_notice(this, error)
            })
    }

    current_page(vl = 1) {
        this.$http.get(`${this.$config.url}/fetch/detail?workid=${this.order.work_id}&status=${this.order.status}&page=${vl}`)
            .then((res: { data: { record: never[]; count: number; }; }) => {
                this.results = res.data.record;
                this.page_number = res.data.count;
            })
            .catch((error: any) => {
                this.$config.err_notice(this, error)
            })
    }

    mounted() {
        this.fetch_post_sql()
        this.current_page()
    }
}

