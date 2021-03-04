import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import {Fetch_data, Res} from "@/interface";
import {AxiosResponse} from "axios";
import modules_order from "@/store/modules/order";
import {CommonFetch, FetchCommonGetApis} from "@/apis/commonApis";

@Component({components: {}})
export default class FetchMixins extends Mixins(Basic) {
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
                    if (res.data.payload !== null) {
                        this.fetchData.source = res.data.payload.source;
                        this.fetchData.assigned = res.data.payload.assigned
                    }
                })
        }
    }

    fetchBase(source: string) {
        if (source) {
            FetchCommonGetApis('base', {source: source})
                .then((res: AxiosResponse<Res>) => {
                    this.fetchData.base = res.data.payload.results;
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
