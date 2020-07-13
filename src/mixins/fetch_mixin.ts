import {Component, Mixins} from "vue-property-decorator";
import att from "@/mixins/basic";
import {Fetch_data, High_light} from "@/interface";
import axios from "axios";
import sqlFormatter from "sql-formatter";
import modules_order from "@/store/modules/order";

@Component({components: {}})
export default class fetch_mixins extends Mixins(att) {

    fetchData: Fetch_data = {
        idc: [],
        source: [],
        base: [],
        table: [],
        assigned: []
    };

    fetchSource(idc: string, tp: string) {
        if (idc) {
            this.$http.get(`${this.$config.url}/fetch/source/${idc}/${tp}`)
                .then((res: { data: { x: string; source: string[]; assigned: string[]; }; }) => {
                    if (res.data.x === tp) {
                        this.fetchData.source = res.data.source;
                        this.fetchData.assigned = res.data.assigned
                    } else {
                        this.$config.notice('非法劫持参数！')
                    }
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }
    }

    fetchBase(source: string) {
        if (source) {
            this.$http.get(`${this.$config.url}/fetch/base/${source}`)
                .then((res: { data: { results: string[]; admin: string[]; highlight: never[] }; }) => {
                    this.fetchData.base = res.data.results;
                    this.fetchData.assigned = res.data.admin
                    modules_order.changed_wordList(this.$config.concat(this.wordList, res.data.highlight))
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }
    }

    fetchTable() {
        if (!this.is_dml) {
            if (this.formItem.data_base) {
                this.$http.put(`${this.$config.url}/fetch/table`, {
                    'source': this.formItem.source,
                    'base': this.formItem.data_base
                })
                    .then((res: { data: { table: string[]; highlight: {} }; }) => {
                        this.fetchData.table = res.data.table;
                        modules_order.changed_wordList(this.$config.concat(this.wordList, res.data.highlight))
                    }).catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
            }
        }
    }

    fetchIDC() {
        this.$http.get(`${this.$config.url}/fetch/idc`)
            .then((res: { data: string[]; }) => {
                this.fetchData.idc = res.data;
            })
            .catch((error: any) => {
                this.$config.err_notice(this, error)
            })
    }

}
