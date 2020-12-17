import {Component, Mixins} from "vue-property-decorator";
import att from "@/mixins/basic";
import {Fetch_data, High_light, Res} from "@/interface";
import axios, {AxiosResponse} from "axios";
import sqlFormatter from "sql-formatter";
import modules_order from "@/store/modules/order";
import {CommonFetch, FetchCommonGetApis} from "@/apis/commonApis";

@Component({components: {}})
export default class fetch_mixins extends Mixins(att) {
    fetchData: Fetch_data = {
        idc: [],
        source: [],
        base: [],
        table: [],
        assigned: []
    };

    fetchDiffSource(idc: string) {
        if (this.is_dml) {
            this.fetchSource(idc, "dml")
        } else {
            this.fetchSource(idc, "ddl")
        }
    }

    fetchSource(idc: string, tp: string) {
        if (idc) {
            FetchCommonGetApis('source', {idc: idc, tp: tp})
                .then((res: AxiosResponse<Res>) => {
                    if (res.data.payload.x === tp) {
                        this.fetchData.source = res.data.payload.source;
                        this.fetchData.assigned = res.data.payload.assigned
                    } else {
                        this.$config.notice('非法劫持参数！')
                    }
                })
        }
    }

    fetchBase(source: string) {
        if (source) {
            FetchCommonGetApis('base', {source: source})
                .then((res: AxiosResponse<Res>) => {
                    this.fetchData.base = res.data.payload.results;
                    this.fetchData.assigned = res.data.payload.admin
                    modules_order.changed_wordList(this.$config.concat(this.wordList, res.data.payload.highlight))
                })
        }
    }

    fetchTable() {
        if (this.formItem.data_base) {
            FetchCommonGetApis('table', this.formItem as CommonFetch)
                .then((res: AxiosResponse<Res>) => {
                    this.fetchData.table = res.data.payload.table;
                    modules_order.changed_wordList(this.$config.concat(this.wordList, res.data.payload.highlight))
                })
        }
    }

    fetchIDC() {
        FetchCommonGetApis('idc', {})
            .then((res: AxiosResponse<Res>) => {
                this.fetchData.idc = res.data.payload;
            })
    }

}
