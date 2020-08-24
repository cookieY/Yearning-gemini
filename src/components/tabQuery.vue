<style scoped>
    @import "../styles/common.less";
</style>

<template>
    <div>
        <editor v-model="sql" @init="editorInit" @setCompletions="setCompletions"></editor>
        <br>
        <span>当前选择的库: {{dataBase}}</span> <span class="margin-left-10">查询耗时: {{queryTime}} ms</span>
        <br>
        <br>
        <Button type="error" icon="md-trash" @click.native="clearObj()">清除</Button>
        <Button type="info" icon="ios-analytics" @click.native="fetchTableField()" class="margin-left-10">获取表结构</Button>
        <Button type="success" icon="ios-redo" @click.native="querySQL()" class="margin-left-10">查询</Button>
        <Button
                type="primary"
                icon="ios-cloud-download"
                @click.native="exportdata()"
                v-if="export_data"
                class="margin-left-10"
        >导出查询数据
        </Button>
        <Button type="warning" @click="beauty" class="margin-left-10">美化</Button>
        <Button type="primary" icon="md-copy" @click="openSnippet" class="margin-left-10">snippet</Button>
        <br>
        <br>
        <p>查询结果:</p>
        <Table :columns="columnsName" :data="queryRes" highlight-row ref="table"></Table>
        <br>
        <Page :total="total" show-total @on-change="splice_arr" ref="total" show-sizer
              @on-page-size-change="ex_arr" :current.sync="current"></Page>

        <Modal
                v-model="expireInfo"
                title="查询时限过期提醒"
                @on-ok="togo">
            <span>查询时限已过期,请重新申请查询时限。</span>
            <br>
            <span>点击确定,返回查询申请页面。</span>
        </Modal>

        <Drawer title="snippet" v-model="openDrawer" transfer>
            <Card style="height:150px" v-for="i in snippetList" :key="i.title" dis-hover>
                <p slot="title">
                    <Icon type="md-copy"></Icon>
                    {{i.title}}
                </p>
                <a href="#" slot="extra" @click.prevent="copySnippet(i)">
                    <Icon type="ios-loop-strong"></Icon>
                    复制
                </a>
                <template slot="extra">
                    <Poptip
                            confirm
                            title="确定要删除这条Snippet?"
                            @on-ok="delSnippet(i)">
                        <a href="#">
                            <Icon type="ios-loop-strong"></Icon>
                            删除
                        </a>
                    </Poptip>
                </template>

                <template v-if="i.text.length > 59">
                    <Tooltip max-width="200" :content="i.text">
                        {{i.text.substring(0,60)}}.....
                    </Tooltip>
                </template>
                <template v-else>{{i.text}}</template>
            </Card>
        </Drawer>

    </div>
</template>

<script lang="ts">
    import Csv from 'view-design/src/utils/csv'
    import ExportCsv from 'view-design/src/components/table/export-csv'
    import editor from "@/components/editor.vue";
    import {Component, Mixins, Prop} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";
    // eslint-disable-next-line no-unused-vars
    import {CreateElement} from "vue";
    import module_general from "@/store/modules/general";

    const export_csv = function exportCsv(this: any, params: any) {
        if (params.filename) {
            if (params.filename.indexOf('.csv') === -1) {
                params.filename += '.csv'
            }
        } else {
            params.filename = 'table.csv'
        }

        let columns = []
        let datas = []
        if (params.columns && params.data) {
            columns = params.columns
            datas = params.data
        } else {
            columns = this.columns
            if (!('original' in params)) params.original = true
            datas = params.original ? this.data : this.rebuildData
        }

        let noHeader = false
        if ('noHeader' in params) noHeader = params.noHeader
        const data = Csv(columns, datas, params, noHeader)
        if (params.callback) {
            params.callback(data)
        } else {
            ExportCsv.download(params.filename, data)
        }
    }
    @Component({components: {editor}})
    export default class tabQuery extends Mixins(att_mixins) {

        @Prop({
            required: false,
            default: false,
            type: Boolean
        }) export_data !: boolean

        @Prop({
            required: false,
            default: '',
            type: String
        }) table !: string

        @Prop({
            required: false,
            default: '',
            type: String
        }) dataBase !: string

        @Prop({
            required: false,
            default: '',
            type: String
        }) source !: string


        get snippetList() {
            return module_general.snippet
        }
        openDrawer = false
        expireInfo = false
        page_size = 10
        columnsName: object[] = []
        queryRes = []
        allQueryData = []
        total = 0
        fieldColumns = [
            {
                title: '字段名',
                key: 'Field'
            },
            {
                title: '字段类型',
                key: 'Type',
                editable: true
            },
            {
                title: '字段是否为空',
                key: 'Null',
                editable: true,
                option: true
            },
            {
                title: '默认值',
                key: 'Default',
                editable: true
            },
            {
                title: '索引类型',
                key: 'Key',
                editable: true
            },
            {
                title: '备注',
                key: 'Comment'
            }
        ]
        queryTime = ''

        delSnippet(vl: any) {
            module_general.snippetRemoveTag(vl)
        }

        copySnippet(vl: { text: any; }) {
            this.sql = vl.text
        }

        openSnippet() {
            this.openDrawer = true
        }

        fetchTableField() {
            if (this.dataBase === '' || this.table === '') {
                this.$Message.error("请选中对应库/表");
                return
            }
            this.$http.get(`${this.$config.url}/query/table_info/${this.dataBase}/${this.table}/${this.source}`)
                .then((res: { data: never[]; }) => {
                    this.columnsName = this.fieldColumns;
                    this.queryRes = res.data
                })
                .catch((err: any) => {
                    this.$config.err_notice(this, err)
                })

        }

        exportdata() {
            export_csv({
                filename: 'Yearning_Data',
                original: true,
                data: this.allQueryData,
                columns: this.columnsName
            })
        }

        splice_arr(page: number) {
            this.queryRes = this.allQueryData.slice(page * this.page_size - this.page_size, page * this.page_size)
        }

        ex_arr(n: number) {
            this.page_size = n;
            this.queryRes = this.allQueryData.slice(this.current * n - n, this.current * n)
        }

        clearObj() {
            this.sql = ''
            this.queryRes = [];
            this.columnsName = [];
            this.current = 1;
            this.total = 0
        }

        togo() {
            this.$router.push({
                name: 'query'
            });
        }

        querySQL() {
            this.columnsName = [];
            this.queryRes = [];
            let spin: any = this.$Spin
            spin.show({
                render: (h: CreateElement) => {
                    return h('div', [
                        h('Icon', {
                            props: {
                                size: 30,
                                type: 'ios-loading'
                            },
                            style: {
                                animation: 'ani-demo-spin 1s linear infinite'
                            }
                        }),
                        h('div', '正在查询,请稍后........')
                    ])
                }
            });
            this.$http.post(`${this.$config.url}/query`, {
                'sql': this.sql,
                'basename': this.dataBase,
                'source': this.source
            })
                .then((res: { data: any }) => {
                    if (res.data.status) {
                        this.expireInfo = true;
                        spin.hide()
                        return
                    }
                    if (res.data.data === null) {
                        this.columnsName = res.data.title;
                        this.allQueryData = [];
                    } else if (!res.data.data) {
                        this.$Message.error({
                            content: res.data,
                            duration: 4,
                            top: 50
                        })
                    } else {
                        this.queryTime = res.data.time;
                        this.columnsName = res.data.title;
                        this.allQueryData = res.data.data;
                        this.queryRes = this.allQueryData.slice(0, this.page_size);
                        this.total = res.data.data.length
                    }

                })
                .catch((err: any) => {
                    this.$config.err_notice(this, err);
                })
            spin.hide()
        }
    }
</script>

<style scoped>

</style>
