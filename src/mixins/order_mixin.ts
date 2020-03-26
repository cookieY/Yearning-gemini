import {Component, Mixins} from "vue-property-decorator";
import att_mixins from "@/mixins/att";
import att from "@/mixins/att";
@Component({components: {}})
export default class order_mixins extends Mixins(att) {
    testColumns = [
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
            tooltip: true,
        },
        {
            title: '当前检查的sql',
            key: 'SQL',
            tooltip: true
        },
        {
            title: '影响行数',
            key: 'AffectRows',
            width: '120'
        }
    ];
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
        database: [
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
    invalidDate = {
        disabledDate(date: number) {
            return date && date.valueOf() < Date.now() - 86400000
        }
    };

    clearForm() {
        this.formItem = this.$config.clearObj(this.formItem)
    }

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
}
