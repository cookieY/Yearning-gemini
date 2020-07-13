import {Component, Mixins} from "vue-property-decorator";
import att from "@/mixins/basic";
import sqlFormatter from "sql-formatter";
@Component({components: {}})
export default class order_mixins extends Mixins(att) {

    testColumns = [
        {
            title: '阶段',
            key: 'status',
            width: '150'
        },
        {
            title: '错误等级',
            key: 'level',
            width: '100'
        },
        {
            title: '错误信息',
            key: 'error',
            tooltip: true,
        },
        {
            title: '当前检查的sql',
            key: 'sql',
            tooltip: true
        },
        {
            title: '影响行数',
            key: 'affect_rows',
            width: '120'
        }
    ];
}
