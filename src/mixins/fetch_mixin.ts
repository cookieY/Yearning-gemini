import {Component, Mixins} from "vue-property-decorator";
import att_mixins from "@/mixins/att";
import axios from "axios";
import att from "@/mixins/att";

@Component({components: {}})
export default class fetch_mixins extends Mixins(att) {
    fetchData:any = {
        idc: [],
        source: [],
        base: [],
        table: [],
        assigned: []
    };


    fetchSource(idc: string) {
        if (idc) {
            axios.get(`${this.$config.url}/fetch/source/${idc}/dml`)
                .then(res => {
                    if (res.data.x === 'dml') {
                        this.fetchData.source = res.data.source;
                        this.fetchData.assigned = res.data.assigned
                    } else {
                        this.$config.notice('非法劫持参数！')
                    }
                })
                .catch(error => {
                        this.$config.err_notice(this,error)
                    })
        }
    }

    fetchBase(source: string) {
        if (source) {
            axios.get(`${this.$config.url}/fetch/base/${source}`)
                .then(res => {
                    this.fetchData.base = res.data;
                })
                .catch(error => {
                        this.$config.err_notice(this,error)
                    })
        }
    }

    fetchIDC() {
        axios.get(`${this.$config.url}/fetch/idc`)
            .then(res => {
                this.fetchData.idc = res.data;
            })
            .catch(error => {
                        this.$config.err_notice(this,error)
                    })
    }

    fetchTable() {
        if (this.formItem.database) {
            axios.put(`${this.$config.url}/fetch/table`, {
                'source': this.formItem.source,
                'base': this.formItem.database
            })
                .then(res => {
                    this.fetchData.table = res.data.table;
                    this.wordList = this.$config.concat(this.wordList, res.data.highlight);
                }).catch(error => {
                        this.$config.err_notice(this,error)
                    })
        }
    }
}
