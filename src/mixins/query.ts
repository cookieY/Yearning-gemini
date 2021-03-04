import {Component, Mixins} from "vue-property-decorator";
import {CommonDeleteApis, CommonPutApis} from "@/apis/queryApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import FetchMixins from "@/mixins/fetch";

@Component({components: {}})
export default class QueryMixin extends Mixins(FetchMixins) {

    export_list = false;

    deferReply() {
        CommonDeleteApis("undo")
            .finally(() => this.$router.push({name: 'query'}))
    }

    query_state() {
        CommonPutApis('status', null)
            .then((res: AxiosResponse<Res>) => {
                switch (res.data.payload.status) {
                    case 1:
                        this.$router.push({name: 'query_page'})
                        return
                    case 2:
                        this.$router.push({name: 'query_apply'})
                        return;
                    default:
                        this.fetchIDC();
                        this.export_list = res.data.payload.export;
                }
            })
    }
}