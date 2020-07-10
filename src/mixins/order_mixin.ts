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

    sql  = ''

    setCompletions(editor: any, session: any, pos: any, prefix: any, callback: (arg0: null, arg1: { caption: any; value: any; meta: any; }[]) => void) {
        callback(null, this.wordList.map(function (word:any) {
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
        this.sql = sqlFormatter.format(this.sql)
    }
}
