import {Component, Mixins} from "vue-property-decorator";
import {CommonDeleteApis, CommonPutApis} from "@/apis/queryApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import fetch_mixins from "@/mixins/fetch_mixin";

@Component({components: {}})
export default class audit_mixins extends Mixins(fetch_mixins) {

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