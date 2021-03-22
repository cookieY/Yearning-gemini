<template>
    <div>
        <Row>
            <Col :span="5" v-if="latch.show">
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
                                    empty-text="数据加载中"
                                    class="tree"
                                ></Tree>
                                <Button type="info" icon="md-brush" @click="openDrawer" ghost>快速提交</Button>
                                <Button type="error" icon="md-backspace" @click="deferReply" ghost
                                        class="margin-left-percent-5">结束会话
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
                            <tabQuery :word-list="wordList" :export_data="latch.explore" :dataBase="addr.base"
                                      :source="source"
                                      :table="addr.table"></tabQuery>
                        </TabPane>
                        <Button @click="handleTabsAdd" size="small" slot="extra">增加窗口</Button>
                        <Button @click="handleTabRemove" size="small" slot="extra" class="margin-left-10">减少窗口</Button>
                    </Tabs>
                </Card>
            </Col>
        </Row>


        <Drawer title="DML语句快速提交" v-model="latch.drawer" width="700">
            <Form :rules="ruleValidate" ref="formItem" :model="formItem">
                <FormItem label="环境:">
                    <span>{{ formItem.idc }}</span>
                </FormItem>
                <FormItem label="连接名:">
                    <span>{{ formItem.source }}</span>
                </FormItem>

                <FormItem label="库名:" prop="data_base">
                    <Select v-model="formItem.data_base" placeholder="请选择" @on-change="fetchTable()" filterable>
                        <Option v-for="item in fetchData.base" :value="item" :key="item" :label="item"></Option>
                    </Select>
                </FormItem>

                <FormItem label="工单说明:" prop="text">
                    <Input v-model="formItem.text" placeholder="请输入" type="textarea" :rows=4></Input>
                </FormItem>

                <FormItem label="审核人:" prop="assigned">
                    <Select v-model="formItem.assigned" filterable>
                        <Option v-for="i in fetchData.assigned" :value="i" :key="i">{{ i }}</Option>
                    </Select>
                </FormItem>

                <FormItem label="是否备份" required prop="backup">
                    <RadioGroup v-model="formItem.backup">
                        <Radio :label=1>是</Radio>
                        <Radio :label=0>否</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="定时执行" prop="delay">
                    <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择时间点" :options="invalidDate"
                                v-model="formItem.delay" @on-change="formItem.delay=$event"
                                :editable="false"></DatePicker>
                </FormItem>
                <FormItem>
                    <editor v-model="test_sql" @init="editorInit" @setCompletions="setCompletions"></editor>
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
                    <Button type="primary" icon="md-search" @click.native="testSql()"
                            class="margin-left-10">检测
                    </Button>
                    <Button type="warning" @click="beauty" class="margin-left-10">美化</Button>
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
import tabQuery from '@/components/tabQuery.vue'
import editor from "@/components/editor.vue";
import {Component, Mixins, Prop} from "vue-property-decorator";
import fetch_mixin from "@/mixins/fetch";
import FetchMixins from "@/mixins/order";
import modules_order from "@/store/modules/order";
import {FetchCommonGetApis, FetchCommonPutApis, PostOrder} from "@/apis/commonApis";
import {CommonDeleteApis, CommonGetApis, CommonPutApis} from "@/apis/queryApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import sqlFormatter from "sql-formatter";

@Component({components: {editor, tabQuery}})
export default class query_sql extends Mixins(fetch_mixin, FetchMixins) {
    private slider2 = 19;
    private currentTab = '查询1';
    private testRes = [] as any;
    private latch = {
        drawer: false,
        explore: false,
        show: true
    };
    private tree_data = [] as any;
    private addr = {
        base: '',
        table: ''
    };
    private tabs = 1;
    private test_sql = '';

    @Prop({
        type: String,
        required: true,
        default: ''
    }) public source !: string;


    countAdd() {
        if (this.latch.show) {
            this.latch.show = false;
            this.slider2 = 24;
        } else {
            this.latch.show = true;
            this.slider2 = 19
        }
    }

    cur(vl: string) {
        this.currentTab = vl
    }

    beauty() {
        this.test_sql = sqlFormatter.format(this.test_sql)
    }

    getTable(vl: any) {
        if (vl.length > 0) {
            if (vl[0].nodeKey > 0) {
                if (vl[0].children === undefined) {
                    this.addr.table = vl[0].title
                } else {
                    this.addr.base = vl[0].title;
                }
            }
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

    handleTabsAdd() {
        this.tabs++
    }

    testSql() {
        this.$Spin.show()
        let is_validate: any = this.$refs['formItem'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                FetchCommonPutApis('test', {
                    data_base: this.formItem.data_base,
                    sql: this.test_sql,
                    is_dml: true,
                    source: this.tree_data[0].title
                })
                    .then((res: AxiosResponse<Res>) => {
                        this.testRes = res.data.payload;
                        let gen = 0;
                        this.testRes.forEach((vl: { level: number; }) => {
                            if (vl.level !== 0) {
                                gen += 1
                            }
                        });
                        this.validate_gen = gen !== 0;
                    })
                    .finally(() => {
                        this.$Spin.hide()
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
                let order = {sql: this.test_sql, type: 1, real_name: sessionStorage.getItem("real_name")}
                Object.assign(order, this.formItem)
                PostOrder(order)
                    .finally(() => this.validate_gen = true)
            }
        })
    }

    clearForm() {
        this.test_sql = ''
    }

    openDrawer() {
        this.fetchBase(this.tree_data[0].title)
        this.latch.drawer = true
    }

    choseName(vl: any) {
        this.addr.base = vl.title;
        if (vl.expand === true) {
            this.$Spin.show();
            CommonGetApis('fetch_table', {title: vl.title, source: this.source})
                .then((res: AxiosResponse<Res>) => {
                    if (res.data.payload === 0) {
                        this.$config.notice("已到查询时限上限,请重新申请查询！");
                        this.$router.push({name: 'query'});
                        return
                    }
                    modules_order.changed_wordList(this.wordList.concat(res.data.payload.highlight))
                    for (let i = 0; i < this.tree_data[0].children.length; i++) {
                        if (this.tree_data[0].children[i].title === vl.title) {
                            this.tree_data[0].children[i].children = res.data.payload.table
                        }
                    }
                })
                .finally(() => this.$Spin.hide())
        }
    }

    deferReply() {
        CommonDeleteApis('undo')
            .finally(() => {
                this.$router.push({name: 'query'})
                this.resetFields('formItem')
            })
    }


    mounted() {
        modules_order.changed_is_dml(false)
        CommonPutApis('fetch_base', {source: this.source})
            .then((res: AxiosResponse<Res>) => {
                this.fetchData.assigned = res.data.payload.sign;
                this.tree_data = res.data.payload.info;
                this.formItem.source = this.tree_data[0].title
                this.formItem.idc = res.data.payload.idc
                let tWord = this.$config.highlight.split('|');
                for (let i of tWord) {
                    this.wordList.push({'vl': i, 'meta': '关键字'})
                }
                modules_order.changed_wordList(this.wordList.concat(res.data.payload.highlight))
                this.latch.explore = Boolean(res.data.payload.status)
            })
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
