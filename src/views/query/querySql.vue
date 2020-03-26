<template>
  <div>
    <Row>
      <Col :span="5" v-if="showTableinfo">
        <Card dis-hover>
          <p slot="title">
            <Icon type="ios-redo"></Icon>
            选择数据库
          </p>
          <div class="edittable-test-con">
            <div id="showImage" class="margin-bottom-10">
              <div>
                <Tree
                        :data="tree_data"
                        @on-toggle-expand="choseName"
                        @on-select-change="getTable"
                        @empty-text="数据加载中"
                        class="tree"
                ></Tree>
                <Button type="info" icon="md-brush" @click="openDrawer" ghost>快速提交</Button>
                <Button type="error" icon="md-backspace" @click="deferReply" ghost class="margin-left-percent-5">结束会话
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col :span="slider2" class="padding-left-10">
        <Card dis-hover>
          <Button type="primary" icon="ios-skip-forward" @click="countAdd">隐藏数据列</Button>
          <br>
          <br>
          <Tabs type="card" :value="currentTab" @on-click="cur" name="base">
            <TabPane v-for="tab in tabs" :key="tab" :label="'查询' + tab" :name="'查询' + tab"
                     icon="logo-buffer" tab="base">
              <tabQuery :word-list="wordList" :export_data="export_data" :dataBase="put_info.base" :source="source"
                        :table="tableInfoName"></tabQuery>
            </TabPane>
            <Button @click="handleTabsAdd" size="small" slot="extra">增加窗口</Button>
            <Button @click="handleTabRemove" size="small" slot="extra" class="margin-left-10">减少窗口</Button>
          </Tabs>
        </Card>
      </Col>
    </Row>


    <Drawer title="DML语句快速提交" :closable="false" v-model="drawer.open" width="700" transfer>
      <Form :rules="ruleValidate" ref="formItem" :model="formItem">
        <FormItem label="环境:" prop="idc">
          <Select v-model="formItem.idc" @on-change="fetchSource">
            <Option v-for="i in fetchData.idc" :key="i" :value="i">{{i}}</Option>
          </Select>
        </FormItem>

        <FormItem label="连接名:" prop="source">
          <Select v-model="formItem.source" @on-change="fetchBase">
            <Option
                    v-for="i in fetchData.source"
                    :value="i"
                    :key="i"
            >{{ i }}
            </Option>
          </Select>
        </FormItem>

        <FormItem label="库名:" prop="database">
          <Select v-model="formItem.database" placeholder="请选择" @on-change="fetchTable">
            <Option v-for="item in fetchData.base" :value="item" :key="item">{{item}}</Option>
          </Select>
        </FormItem>

        <FormItem label="工单说明:" prop="text">
          <Input v-model="formItem.text" placeholder="请输入" type="textarea" :rows=4></Input>
        </FormItem>

        <FormItem label="审核人:" prop="assigned">
          <Select v-model="formItem.assigned" filterable>
            <Option v-for="i in fetchData.assigned" :value="i" :key="i">{{i}}</Option>
          </Select>
        </FormItem>

        <FormItem label="是否备份" required>
          <RadioGroup v-model="formItem.backup">
            <Radio :label=1>是</Radio>
            <Radio :label=0>否</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="定时执行">
          <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择时间点" :options="invalidDate"
                      v-model="formItem.delay" @on-change="formItem.delay=$event"
                      :editable="false"></DatePicker>
        </FormItem>
        <FormItem>
          <editor v-model="formItem.textarea" @init="editorInit" @setCompletions="setCompletions"></editor>
        </FormItem>
      </Form>

      <Form :label-width="30">
        <FormItem>
          <Button
                  type="error"
                  icon="md-trash"
                  @click.native="clearForm()"
          >清除
          </Button>
          <Button type="primary" icon="md-search" @click.native="testSql()" :loading="loading"
                  class="margin-left-10">检测
          </Button>
          <Button type="warning" @click="beauty" :loading="loading" class="margin-left-10">美化</Button>
          <Button
                  type="success"
                  icon="ios-redo"
                  @click.native="commitOrder()"
                  :disabled="this.validate_gen"
                  class="margin-left-10"
          >提交
          </Button>
        </FormItem>

        <Table :columns="testColumns" :data="testRes" highlight-row></Table>
      </Form>

    </Drawer>

  </div>
</template>
<script lang="ts">
    import axios from 'axios'
    import tabQuery from '@/components/tabQuery.vue'
    import editor from "@/components/editor.vue";
    import {Component, Mixins,Prop} from "vue-property-decorator";
    import fetch_mixin from "@/mixins/fetch_mixin";
    import order_mixin from "@/mixins/order_mixin";

    @Component({components: {editor, tabQuery}})
    export default class query_sql extends Mixins(fetch_mixin, order_mixin) {
        slider2 = 19;
        currentTab = '查询1';
        tableInfoName = '';
        testRes = [] as any;
        loading = false;
        drawer = {
            open: false
        };
        tree_data = [] as any;
        validate_gen = true;
        put_info = {
            base: '',
            tablename: ''
        };
        export_data = false;
        tabs = 1;
        showTableinfo = true;

        @Prop({
            type: String,
            required: true,
            default: ''
        }) public source !: string;


        countAdd() {
            if (this.showTableinfo) {
                this.showTableinfo = false;
                this.slider2 = 24;
            } else {
                this
                    .showTableinfo = true;
                this
                    .slider2 = 19
            }
            this.$store.commit('closeNav')
        }

        beauty() {
            axios.put(`${this.$config.url}/query/beauty`, {
                'sql': this.formItem.textarea
            })
                .then(res => {
                    this.formItem.textarea = res.data
                })
                .catch(err => this.$config.err_notice(this, err))
        }

        cur(vl: string) {
            this.currentTab = vl
        }

        getTable(vl: any) {
            if (vl[0].children === undefined) {
                this.tableInfoName = vl[0].title
            } else {
                this.put_info.base = vl[0].title;
            }
        }

        handleTabRemove() {
            if (this.tabs === 1) {
                this.$Message.error("窗口最少拥有一个！")
            } else {
                if (this.currentTab === `查询${this.tabs}`) {
                    this.currentTab = `查询${this.tabs - 1}`
                }
                this.tabs--
            }
        }

        editorInit() {
            require('brace/mode/mysql');
            require('brace/theme/xcode')
        }

        handleTabsAdd() {
            this.tabs++
        }

        testSql() {
            let is_validate: any = this.$refs['formItem'];
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    this.loading = true;
                    axios.put(`${this.$config.url}/fetch/test`, {
                        'database': this.formItem.database,
                        'sql': this.formItem.textarea,
                        'isDMl': true,
                        'source': this.tree_data[0].title
                    })
                        .then(res => {
                            this.testRes = res.data;
                            let gen = 0;
                            this.testRes.forEach((vl: { Level: number; }) => {
                                if (vl.Level !== 0) {
                                    gen += 1
                                }
                            });
                            this.validate_gen = gen !== 0;
                            this.loading = false
                        })
                        .catch(err => {
                            this.loading = false;
                            this.$config.err_notice(this, err)
                        })
                } else {
                    this.$Message.error('请填写具体地址或sql语句后再测试!')
                }
            })
        }

        commitOrder() {
            let is_validate: any = this.$refs['formItem'];
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    axios.post(`${this.$config.url}/sql/refer`, {
                        'ddl': this.formItem,
                        'sql': this.formItem.textarea,
                        'ty': 1
                    })
                        .then(res => {
                            this.validate_gen = true;
                            this.$Notice.success({
                                title: '成功',
                                desc: res.data
                            })
                        })
                        .catch(error => {
                            this.validate_gen = true;
                            this.$config.err_notice(this, error)
                        })
                }
            })
        }

        clearForm() {
            this.formItem = this.$config.clearObj(this.formItem)
        }

        openDrawer() {
            this.fetchIDC();
            this.drawer.open = true
        }

        choseName(vl: any) {
            let spin: any = this.$Spin;
            this.put_info.base = vl.title;
            if (vl.expand === true) {
                spin.show({
                    render: (h: any) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'ios-loading',
                                    size: 18
                                }
                            }),
                            h('div', 'Loading')
                        ])
                    }
                });
                axios.get(`${this.$config.url}/query/fetchtable/${vl.title}/${this.source}`)
                    .then(res => {
                        if (res.data === 0) {
                            this.$config.notice("已到查询时限上限,请重新申请查询！");
                            this.$router.push({
                                name: 'query'
                            });
                            spin.hide();
                            return
                        }
                        this.wordList = this.$config.concat(this.wordList, res.data.highlight);
                        for (let i = 0; i < this.tree_data[0].children.length; i++) {
                            if (this.tree_data[0].children[i].title === vl.title) {
                                this.tree_data[0].children[i].children = res.data.table
                            }
                        }
                        spin.hide()
                    })
                    .catch(() => spin.hide())
            }
        }

        deferReply() {
            axios.delete(`${this.$config.url}/query/undo`)
                .then(res => this.$config.notice(res.data))
                .catch(err => this.$config.err_notice(this, err));
            this.$router.push({
                name: 'query'
            })
        }

        setCompletions(editor: any, session: any, pos: any, prefix: any, callback: (arg0: null, arg1: any) => void) {
            callback(null, this.wordList.map(function (word: { vl: any; meta: any; }) {
                return {
                    caption: word.vl,
                    value: word.vl,
                    meta: word.meta
                }
            }))
        }

        mounted() {
            axios.put(`${this.$config.url}/query/fetchbase`, {
                'source': this.source
            })
                .then(res => {
                    this.fetchData.assigned = res.data.sign;
                    this.tree_data = res.data.info;
                    let tWord = this.$config.highlight.split('|');
                    for (let i of tWord) {
                        this.wordList.push({'vl': i, 'meta': '关键字'})
                    }
                    this.wordList = this.wordList.concat(res.data.highlight);
                    res.data['status'] === 1 ? this.export_data = true : this.export_data = false
                })
                .catch(err => this.$config.err_notice(this, err))
        }
    }
</script>

<style lang="less">
  @import "../../styles/common.less";
  @import "../../styles/table.less";

  .tree {
    word-wrap: break-word;
    word-break: break-all;
    /*overflow-y: scroll;*/
    /*overflow-x: scroll;*/
    overflow: scroll;
    max-width: 600px;
    height: 600px;
  }
</style>
