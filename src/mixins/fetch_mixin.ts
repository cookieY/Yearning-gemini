import {Component, Mixins} from "vue-property-decorator";
import att from "@/mixins/basic";
import {Fetch_data, High_light} from "@/interface";
import axios from "axios";
import sqlFormatter from "sql-formatter";

@Component({components: {}})
export default class fetch_mixins extends Mixins(att) {
    fetchData: Fetch_data = {
        idc: [],
        source: [],
        base: [],
        table: [],
        assigned: []
    };


    fetchSource(idc: string,tp:string) {
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
                .then((res: { data: { results: string[]; admin: string[]; }; }) => {
                    this.fetchData.base = res.data.results;
                    this.fetchData.assigned = res.data.admin
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
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

    fetchTable() {
        if (this.formItem.database) {
            this.$http.put(`${this.$config.url}/fetch/table`, {
                'source': this.formItem.source,
                'base': this.formItem.database
            })
                .then((res: { data: { table: string[]; highlight: High_light }; }) => {
                    this.fetchData.table = res.data.table;
                    this.wordList = this.$config.concat(this.wordList, res.data.highlight);
                }).catch((error: any) => {
                this.$config.err_notice(this, error)
            })
        }
    }

    check_sql(is_dml: boolean) {
        let is_validate: any = this.$refs['formItem'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                this.loading = true;
                axios.put(`${this.$config.url}/fetch/test`, {
                    'source': this.formItem.source,
                    'database': this.formItem.database,
                    'sql': this.formItem.textarea,
                    'is_dml': is_dml
                })
                    .then(res => {
                        this.testResults = res.data;
                        let gen = 0;
                        this.testResults.forEach((vl: { level: number; }) => {
                            if (vl.level !== 0) {
                                gen += 1
                            }
                        });
                        this.validate_gen = gen !== 0;
                    })
                    .catch(err => {
                        this.$config.err_notice(this, err)
                    })
                this.loading = false;
            } else {
                this.$Message.error('请填写具体地址或sql语句后再测试!')
            }
        })
    }

    beauty() {
        this.formItem.textarea = sqlFormatter.format(this.formItem.textarea)
    }

    clearForm() {
        let is_validate: any = this.$refs['formItem'];
        is_validate.resetFields();
        this.formItem.table = ''
        this.formItem.delay = null
    }
}
