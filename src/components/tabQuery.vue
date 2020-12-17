<template>
    <div>
        <editor v-model="sql" @init="editorInit" @setCompletions="setCompletions"></editor>
        <br>
        <span>当前选择的库: {{ dataBase }}</span> <span class="margin-left-10">查询耗时: {{ queryTime }} ms</span>
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
        <Table :columns="columnsName" :data="queryRes" highlight-row ref="table" border></Table>
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
                    {{ i.title }}
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
                        {{ i.text.substring(0, 60) }}.....
                    </Tooltip>
                </template>
                <template v-else>{{ i.text }}</template>
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
import module_general from "@/store/modules/general";
import {CommonGetApis, CommonPostApis} from "@/apis/queryApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import sqlFormatter from "sql-formatter";

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

    private sql = ''
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
            key: 'field'
        },
        {
            title: '字段类型',
            key: 'type',
            editable: true
        },
        {
            title: '字段是否为空',
            key: 'null',
            editable: true,
            option: true
        },
        {
            title: '默认值',
            key: 'default',
            editable: true
        },
        {
            title: '索引类型',
            key: 'key',
            editable: true
        },
        {
            title: '备注',
            key: 'comment'
        }
    ]
    queryTime = ''
    spin: any = {}

    delSnippet(vl: any) {
        module_general.snippetRemoveTag(vl)
    }

    copySnippet(vl: { text: any; }) {
        this.sql = vl.text
    }

    openSnippet() {
        this.openDrawer = true
    }

    beauty () {
        this.sql = sqlFormatter.format(this.sql)
    }

    fetchTableField() {
        if (this.dataBase === '' || this.table === '') {
            this.$Message.error("请选中对应库/表");
            return
        }
        CommonGetApis('table_info', {data_base: this.dataBase, table: this.table, source: this.source})
            .then((res: AxiosResponse<Res>) => {
                this.columnsName = this.fieldColumns;
                this.queryRes = res.data.payload
                this.$Message.success({content: "已获取表结构!"})
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
        this.$Spin.show();
        this.columnsName = [];
        this.queryRes = [];
        CommonPostApis('results', {
            sql: this.sql,
            data_base: this.dataBase,
            source: this.source
        })
            .then((res: AxiosResponse<Res>) => {
                if (res.data.payload.status) {
                    this.expireInfo = true;
                    this.$Spin.hide()
                    return
                }
                if (res.data.payload.data === null) {
                    this.columnsName = res.data.payload.title;
                    this.allQueryData = [];
                } else if (!res.data.payload.data) {
                    this.$Message.error({
                        content: res.data.payload,
                        duration: 4,
                        top: 50
                    })
                } else {
                    this.queryTime = res.data.payload.time;
                    this.columnsName = res.data.payload.title;
                    this.allQueryData = res.data.payload.data;
                    this.queryRes = this.allQueryData.slice(0, this.page_size);
                    this.total = res.data.payload.data.length
                }

            })
            .finally(() => this.$Spin.hide())

    }
}
</script>

<style scoped>
@import "../styles/common.less";

.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}
</style>
