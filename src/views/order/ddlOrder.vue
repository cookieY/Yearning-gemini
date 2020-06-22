<template>
    <div>
        <Row>
            <Col span="6">
                <Card>
                    <p slot="title">
                        <Icon type="ios-redo"></Icon>
                        选择数据库
                    </p>
                    <div class="edittable-test-con">
                        <Form :model="formItem" :label-width="100" ref="formItem" :rules="ruleValidate">
                            <Form-item label="环境:" prop="idc">
                                <Select v-model="formItem.idc" placeholder="请选择" @on-change="fetchSource">
                                    <Option v-for="i in fetchData.idc" :value="i" :key="i">{{i}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="连接名称:" prop="source">
                                <Select
                                        v-model="formItem.source"
                                        placeholder="请选择"
                                        @on-change="fetchBase"
                                >
                                    <Option
                                            v-for="i in fetchData.source"
                                            :value="i"
                                            :key="i"
                                    >{{ i }}
                                    </Option>
                                </Select>
                            </Form-item>
                            <Form-item label="数据库库名:" prop="database">
                                <Select
                                        v-model="formItem.database"
                                        placeholder="请选择"
                                        @on-change="fetchTable"
                                >
                                    <Option v-for="item in fetchData.base" :value="item" :key="item">{{item}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="数据库表名:">
                                <Select v-model="formItem.table" placeholder="请选择">
                                    <Option v-for="item in fetchData.table" :value="item" :key="item">{{item}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item>
                                <Button type="primary" @click="fetchStruct()">获取表结构信息</Button>
                                <Button type="error" @click="clearForm()" class="margin-left-10">重置</Button>
                            </Form-item>
                            <FormItem label="工单提交说明:" prop="text">
                                <Input v-model="formItem.text" placeholder="请输入工单说明" type="textarea" :rows=4></Input>
                            </FormItem>
                            <FormItem label="审核人:" prop="assigned">
                                <Select v-model="formItem.assigned" transfer>
                                    <Option v-for="i in fetchData.assigned" :value="i" :key="i">{{i}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="定时执行">
                                <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择时间点"
                                            :options="invalidDate"
                                            :editable="false"
                                            v-model="formItem.delay" @on-change="formItem.delay=$event"></DatePicker>
                            </FormItem>
                            <FormItem label="是否备份" prop="backup">
                                <RadioGroup v-model="formItem.backup">
                                    <Radio :label=1>是</Radio>
                                    <Radio :label=0>否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Form>
                    </div>
                </Card>
            </Col>
            <Col span="18" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="md-remove"></Icon>
                        填写SQL语句
                    </p>
                    <div class="edittable-table-height-con">
                        <Tabs :value="tabs">
                            <TabPane label="填写SQL语句" name="order1" icon="md-code">
                                <Form>
                                    <FormItem>
                                        <editor
                                                v-model="formDynamic"
                                                @init="editorInit"
                                                @setCompletions="setCompletions"
                                        ></editor>
                                    </FormItem>
                                    <FormItem>
                                        <Table :columns="testColumns" :data="testResults" highlight-row></Table>
                                    </FormItem>
                                    <FormItem>
                                        <Button type="primary" @click="testSql" :loading="loading">检测语句</Button>
                                        <Button type="info" @click="merge" :loading="loading" class="margin-left-10">
                                            ALTER语句合并
                                        </Button>
                                        <Button type="warning" @click="beauty" :loading="loading"
                                                class="margin-left-10">美化
                                        </Button>
                                        <Button
                                                type="success"
                                                class="margin-left-10"
                                                @click="commitOrder"
                                                :disabled="validate_gen"
                                        >提交工单
                                        </Button>
                                    </FormItem>
                                </Form>
                            </TabPane>
                            <TabPane label="表结构详情" name="order2" icon="md-folder">
                                <Table :columns="fieldColumns" :data="fieldData"></Table>
                            </TabPane>
                            <TabPane label="索引详情" name="order3" icon="md-folder">
                                <Table :columns="idxColums" :data="idxData"></Table>
                            </TabPane>
                        </Tabs>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import editor from '@/components/editor.vue'
    import {Component, Mixins} from "vue-property-decorator";
    import fetch_mixins from "@/mixins/fetch_mixin";
    import order_mixins from "../../mixins/order_mixin";
    import sqlFormatter from "sql-formatter";

    @Component({components: {editor}})
    export default class ddl_order extends Mixins(fetch_mixins, order_mixins) {
        tabs = 'order1';
        formDynamic = '';
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
                title: '备注',
                key: 'Comment'
            }
        ];
        fieldData = [];
        idxColums = [
            {
                title: '索引名称',
                key: 'IndexName'
            },
            {
                title: '是否唯一索引',
                key: 'NonUnique'
            },
            {
                title: '字段名',
                key: 'ColumnName'
            }
        ];
        idxData = [];

        fetchSource(idc: string) {
            if (idc) {
                axios.get(`${this.$config.url}/fetch/source/${idc}/ddl`)
                    .then(res => {
                        if (res.data.x === 'ddl') {
                            this.fetchData.source = res.data.source;
                            this.fetchData.assigned = res.data.assigned
                        } else {
                            this.$config.notice('非法劫持参数！')
                        }
                    })
                    .catch(error => {
                        this.$config.err_notice(this, error)
                    })
            }
        }

        merge() {
            axios.put(`${this.$config.url}/query/merge`, {
                'sql': this.formDynamic
            })
                .then((res: any) => {
                    if (!res.data.e) {
                        this.formDynamic = res.data.sols
                    } else {
                        this.$config.notice(res.data.err_code)
                    }
                })
                .catch((error: any) => this.$config.err_notice(this, error))
        }

        beauty() {
            this.formDynamic = sqlFormatter.format(this.formDynamic)
        }

        fetchStruct() {
            let is_validate: any = this.$refs['formItem'];
            let spin: any = this.$Spin;
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    spin.show({
                        render: (h: any) => {
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
                                h('div', '数据库连接中,请稍后........')
                            ])
                        }
                    });
                    axios.put(`${this.$config.url}/fetch/tableinfo`, {
                        'source': this.formItem.source,
                        'base': this.formItem.database,
                        'table': this.formItem.table
                    })
                        .then(res => {
                            this.fieldData = res.data.f;
                            this.idxData = res.data.i;
                            spin.hide()
                        })
                        .catch(() => {
                            this.$config.err_notice(this)
                            spin.hide()
                        })
                } else {
                    this.$Message.error('表单验证失败!')
                }
            })
        }

        testSql() {
            let is_validate: any = this.$refs['formItem'];
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    this.loading = true;
                    axios.put(`${this.$config.url}/fetch/test`, {
                        'source': this.formItem.source,
                        'database': this.formItem.database,
                        'table': this.formItem.table,
                        'sql': this.formDynamic,
                        'isDMl': false
                    })
                        .then(res => {
                            this.testResults = res.data;
                            let gen = 0;
                            this.testResults.forEach((vl: { Level: number; }) => {
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
            this.validate_gen = true;
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    axios.post(`${this.$config.url}/sql/refer`, {
                        'ddl': this.formItem,
                        'sql': this.formDynamic,
                        'ty': 0
                    })
                        .then(res => {
                            this.$Notice.success({
                                title: '成功',
                                desc: res.data
                            })
                        })
                        .catch(error => {
                            this.$config.err_notice(this, error)
                        })
                }
            })
        }

        mounted() {
            for (let i of this.$config.highlight.split('|')) {
                this.wordList.push({'vl': i, 'meta': '关键字'})
            }
            this.fetchIDC();
        }

    }
</script>

<style lang="less" scoped>
    @import "../../styles/common.less";
    @import "../../styles/table.less";

    p {
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
    }
</style>
