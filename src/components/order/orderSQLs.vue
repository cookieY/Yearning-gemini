<template>
    <div>
        <Row>
            <Col span="4" class="margin-left-10">
                <orderConfirm></orderConfirm>
            </Col>
            <Col span="18" offset="1">
                <Form>
                    <FormItem>
                        <Card>
                            <Tabs value="order1">
                                <TabPane label="填写SQL语句" name="order1" icon="md-code">
                                    <editor v-model="order_text" @init="editorInit"
                                            @setCompletions="setCompletions"></editor>
                                </TabPane>
                                <template>
                                    <TabPane label="表结构详情" name="order2" icon="md-folder">
                                        <Table :columns="field_columns" :data="field_data" border
                                               max-height="250"></Table>
                                    </TabPane>
                                    <TabPane label="索引详情" name="order3" icon="md-folder">
                                        <Table :columns="idx_columns" :data="idx_data" border max-height="250">
                                            <template slot-scope="{row}" slot="NonUnique">
                                                <span v-if="row.NonUnique === 0">是</span>
                                                <span v-else>否</span>
                                            </template>
                                        </Table>
                                    </TabPane>
                                </template>
                            </Tabs>
                        </Card>
                    </FormItem>
                    <FormItem>
                        <Button type="info" icon="md-arrow-round-back" @click.native="previous"
                                class="margin-left-10">上一步
                        </Button>
                        <Button type="primary" icon="md-search" @click.native="check_sql(true)"
                                class="margin-left-10">检测语句
                        </Button>
                        <Button type="info" @click="merge" :loading="loading" class="margin-left-10" v-if="!is_dml">
                            ALTER语句合并
                        </Button>
                        <Button type="success" @click="fetchStruct()" class="margin-left-10">获取表结构信息
                        </Button>
                        <Button type="warning" icon="ios-brush" @click.native="beauty()"
                                :loading="loading" class="margin-left-10">美化
                        </Button>
                        <Button
                            type="success"
                            icon="ios-redo"
                            @click.native="commitOrder()"
                            :disabled="this.validate_gen"
                            class="margin-left-10"
                        >提交工单
                        </Button>
                    </FormItem>
                    <FormItem>
                        <Table :columns="testColumns" :data="testResults" highlight-row border></Table>
                    </FormItem>
                </Form>
            </Col>
        </Row>
    </div>

</template>

<script lang="ts">
import FetchMixins from "@/mixins/order";
import {Component, Mixins} from "vue-property-decorator";
import editor from "@/components/editor.vue";
import orderConfirm from "@/components/order/orderConfirm.vue";
import modules_order from "@/store/modules/order";
import {CommonFetch, FetchCommonGetApis, FetchCommonPutApis, PostOrder} from "@/apis/commonApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";

@Component({components: {editor, orderConfirm}})
export default class orderSQLs extends Mixins(FetchMixins) {
    field_columns = [
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
            title: '备注',
            key: 'comment'
        }
    ];
    field_data = [];
    idx_columns = [
        {
            title: '索引名称',
            key: 'IndexName'
        },
        {
            title: '是否唯一',
            key: 'NonUnique',
            slot: 'NonUnique'
        },
        {
            title: '字段名',
            key: 'ColumnName'
        }
    ];
    idx_data = [];

    fetchStruct() {
        this.$Spin.show();
        FetchCommonGetApis('fields', this.formItem as CommonFetch)
            .then((res: AxiosResponse<Res>) => {
                this.field_data = res.data.payload.rows;
                this.idx_data = res.data.payload.idx;
                this.$Message.success({content: "已获取表结构!"})
            })
            .finally(() => this.$Spin.hide())
    }

    check_sql() {
        this.$Spin.show()
        FetchCommonPutApis('test', {
            source: this.formItem.source,
            data_base: this.formItem.data_base,
            sql: this.order_text,
            is_dml: this.is_dml
        })
            .then((res: AxiosResponse<Res>) => {
                this.testResults = res.data.payload;
                let gen = 0;
                this.testResults.forEach((vl: { level: number; }) => {
                    if (vl.level !== 0) {
                        gen += 1
                    }
                });
                this.validate_gen = gen !== 0;
            })
            .finally(() => this.$Spin.hide())
    }

    commitOrder() {
        this.validate_gen = true
        let ty = this.is_dml ? 1 : 0
        let order = {sql: this.order_text, type: ty, real_name: sessionStorage.getItem("real_name")}
        Object.assign(order, this.formItem)
        PostOrder(order)
            .then(() => {
                modules_order.changed_step(3)
                modules_order.changed_always({one: false, two: false, three: true})
            })
            .finally(() => this.validate_gen = false)
    }

    merge() {
        FetchCommonPutApis('merge', {sqls: this.order_text})
            .then((res: AxiosResponse<Res>) => {
                if (res.data.code === 1200) {
                    this.order_text = res.data.payload
                }
            })
    }

    previous() {
        modules_order.changed_step(0)
        modules_order.changed_always({one: true, two: false, three: false})
        modules_order.clear_order()
        modules_order.changed_is_dml(false)
    }

    mounted() {
        for (let i of this.$config.highlight.split('|')) {
            this.wordList.push({'vl': i, 'meta': '关键字'})
        }
    }
}
</script>

<style scoped lang="less">
@import "../../styles/common";
@import "../../styles/table";

.div-a {
    position: absolute;
    width: 100%;
    min-height: 1000px;
}
</style>
