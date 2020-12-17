import {Component, Mixins} from "vue-property-decorator";
import att from "@/mixins/basic";
import module_init_args from "@/store/modules/init_args";
import {FetchCommonGetApis} from "@/apis/commonApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";

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
        this.$Spin.show()
        FetchCommonGetApis('sql', {work_id: this.order.work_id, limit: vl})
            .then((res: AxiosResponse<Res> ) => {
                module_init_args.fetch_order_sql(res.data.payload.sqls)
            })
            .finally(() => {
                this.$Spin.hide()
            })
    }

    open_form() {
        this.is_open = true
    }

    delOrder(work_id: string) {
        FetchCommonGetApis('undo', {work_id: work_id})
            .then(() => {
                this.$router.go(-1)
            })
    }

    current_page(vl = 1) {
        FetchCommonGetApis('detail', {work_id: this.order.work_id, status: this.order.status, page: vl})
            .then((res: AxiosResponse<Res>) => {
                this.results = res.data.payload.record;
                this.page_number = res.data.payload.count;
            })
    }
}

