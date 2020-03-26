<style scoped>
  @import "../styles/common.less";
</style>

<template>
  <div>
    <editor v-model="formItem.textarea" @init="editorInit" @setCompletions="setCompletions"></editor>
    <br>
    <span>当前选择的库: {{dataBase}}</span> <span class="margin-left-10">查询耗时: {{queryTime}} ms</span>
    <br>
    <br>
    <Button type="error" icon="md-trash" @click.native="clearObj(this.formItem)">清除</Button>
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
    <Page :total="total" show-total @on-change="splice_arr" ref="total" show-sizer @on-page-size-change="ex_arr"></Page>

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

<script>
    import axios from 'axios'
    import Csv from 'view-design/src/utils/csv'
    import ExportCsv from 'view-design/src/components/table/export-csv'
    import editor from './editor'

    const exportcsv = function exportCsv(params) {
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

    export default {
        name: 'tabQuery',
        components: {
            editor: editor
        },
        props: {
            wordList: Array,
            export_data: Boolean,
            dataBase: String,
            table: String,
            source: String
        },
        computed: {
            snippetList: function () {
                return this.$store.state.snippet
            }
        },
        data() {
            return {
                openDrawer: false,
                expireInfo: false,
                page_size: 10,
                columnsName: [],
                queryRes: [],
                allQueryData: [],
                total: 0,
                formItem: {
                    textarea: ''
                },
                fieldColumns: [
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
                ],
                queryTime: ''
            }
        },
        methods: {
            delSnippet(vl) {
                this.$store.commit('snippetRemoveTag', vl)
            },
            copySnippet(vl) {
                this.formItem.textarea = vl.text
            },
            openSnippet() {
                this.openDrawer = true
            },
            beauty() {
                axios.put(`${this.$config.url}/query/beauty`, {
                    'sql': this.formItem.textarea
                })
                    .then(res => {
                        this.formItem.textarea = res.data
                    })
                    .catch(err => this.$config.err_notice(this, err))
            },
            fetchTableField() {
                if (this.dataBase === '' || this.table === '') {
                    this.$Message.error("请选中对应库/表");
                    return
                }
                axios.get(`${this.$config.url}/query/tableinfo/${this.dataBase}/${this.table}/${this.source}`)
                    .then(res => {
                        this.columnsName = this.fieldColumns;
                        this.queryRes = res.data
                    })
                    .catch(err => {
                        this.$config.err_notice(this, err)
                    })

            },
            exportdata() {
                exportcsv({
                    filename: 'Yearning_Data',
                    original: true,
                    data: this.allQueryData,
                    columns: this.columnsName
                })
            },
            editorInit: function () {
                require('brace/mode/mysql')
                require('brace/theme/xcode')
            },
            splice_arr(page) {
                this.queryRes = this.allQueryData.slice(page * this.page_size - this.page_size, page * this.page_size)
            },
            ex_arr(n) {
                this.page_size = n;
                this.queryRes = this.allQueryData.slice(this.$refs.total.currentPage * n - n, this.$refs.total.currentPage * n)
            },
            clearObj() {
                this.formItem.textarea = '';
                this.queryRes = [];
                this.columnsName = [];
                this.$refs.total.currentPage = 1;
                this.total = 0
            },
            setCompletions(editor, session, pos, prefix, callback) {
                callback(null, this.wordList.map(function (word) {
                    return {
                        caption: word.vl,
                        value: word.vl,
                        meta: word.meta
                    }
                }))
            },
            togo() {
                this.$router.push({
                    name: 'query'
                });
            },
            querySQL() {
                this.columnsName = [];
                this.queryRes = [];
                this.$Spin.show({
                    render: (h) => {
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
                axios.post(`${this.$config.url}/query`, {
                    'sql': this.formItem.textarea,
                    'basename': this.dataBase,
                    'source': this.source
                })
                    .then(res => {
                        if (res.data.status) {
                            this.expireInfo = true;
                            this.$Spin.hide();
                            return
                        }
                        if (res.data.data === null) {
                            this.columnsName = res.data['title'];
                            this.allQueryData = [];
                        } else if (!res.data['data']) {
                            this.$Notice.warning({
                                title: '错误',
                                desc: res.data
                            })
                        } else {
                            this.queryTime = res.data.time;
                            this.columnsName = res.data['title'];
                            this.allQueryData = res.data['data'];
                            this.queryRes = this.allQueryData.slice(0, this.page_size);
                            this.total = res.data['data'].length
                        }
                        this.$Spin.hide()
                    })
                    .catch(err => {
                        this.$config.err_notice(this, err);
                        this.$Spin.hide()
                    })
            }
        }
    }
</script>

<style scoped>

</style>
