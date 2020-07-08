<style>
    @import "../../styles/common.less";
</style>
<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="md-sync"></Icon>
                    autoTask
                </p>
                <Form inline>
                    <FormItem>
                    </FormItem>
                    <FormItem>
                        <Button type="warning" @click="toggleShow">新建Task</Button>
                    </FormItem>
                    <FormItem>
                        <Input placeholder="AutoTask名称" v-model="find.text"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="success" @click="queryData">查询</Button>
                        <Button type="primary" @click="queryCancel" class="margin-left-10">重置</Button>
                    </FormItem>
                </Form>
                <Table :columns="task_columns" :data="task_data">
                    <template slot-scope="{ row }" slot="tp">
                        <Tag checkable color="primary" v-if="row.tp === 0">Insert</Tag>
                        <Tag checkable color="warning" v-if="row.tp === 1">Update</Tag>
                        <Tag checkable color="error" v-if="row.tp === 2">Delete</Tag>
                    </Template>
                    <template slot-scope="{ row }" slot="status">
                        <i-switch v-model="row.status" @on-change="activityStatus(row)">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" @click="openEditModal(row)" size="small">编辑</Button>
                        <Poptip
                                confirm
                                title="确定要删除吗？"
                                @on-ok="delAutoTask(row)"
                                transfer
                        >
                            <Button type="error" class="margin-left-10" size="small">删除</Button>
                        </Poptip>
                    </template>
                </Table>
                <br>
                <Page :total="page_number" show-elevator @on-change="fetchAutoTaskList" :page-size="15"
                      :current.sync="current"></Page>
            </Card>
        </Row>

        <Modal v-model="showing" :title="diffArgs.title" @on-ok="referAutoTask">
            <Form :model="formItem" ref="formItem" :rules="ruleValidate">
                <FormItem label="Task名称" prop="name">
                    <Input v-model="formItem.name" :disabled="disable"></Input>
                </FormItem>
                <FormItem label="类型" required>
                    <Select v-model="formItem.tp">
                        <Option v-for="i in fetchList.tp" :key="i.v" :value="i.v">{{i.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="环境:" prop="idc">
                    <Select v-model="formItem.idc" @on-change="fetchDiffSource">
                        <Option v-for="i in fetchData.idc" :key="i" :value="i">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="连接名" prop="source">
                    <Select v-model="formItem.source" @on-change="fetchBase" filterable>
                        <Option v-for="i in fetchData.source" :key="i" :value="i">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="库" prop="database">
                    <Select v-model="formItem.database" @on-change="fetchTable" filterable>
                        <Option v-for="i in fetchData.base" :key="i" :value="i">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="表" prop="table">
                    <Select v-model="formItem.table" filterable>
                        <Option v-for="i in fetchData.table" :key="i" :value="i">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="最大影响行数" prop="row">
                    <InputNumber :min="1" v-model="formItem.row"></InputNumber>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import {Mixins, Component} from "vue-property-decorator";
    import fetch_mixins from "@/mixins/fetch_mixin";
    import order_mixins from "@/mixins/order_mixin";

    @Component
    export default class autoTask extends Mixins(fetch_mixins, order_mixins) {
        fetchList = {
            source: [],
            tp: [
                {
                    'title': 'Insert',
                    'v': 0
                },
                {
                    'title': 'Update',
                    'v': 1
                },
                {
                    'title': 'Delete',
                    'v': 2
                }
            ]
        };
        task_columns = [
            {
                title: '名称',
                key: 'name',
            },
            {
                title: '类型',
                key: 'tp',
                slot: 'tp'
            },
            {
                title: '数据源',
                key: 'source',
            },
            {
                title: '数据库',
                key: 'base',
            },
            {
                title: '数据表',
                key: 'table',
            },
            {
                title: '最大影响行数',
                key: 'affect_rows',
            },
            {
                title: '状态',
                key: 'status',
                slot: 'status'
            },
            {
                title: '操作',
                key: 'action',
                slot: 'action'
            },
        ];
        task_data = [] as any;
        showing = false;
        disable = false;
        diffArgs = {
            title: '新建AutoTask',
            url: 'auto'
        };

        toggleShow() {
            this.showing = this.showing = true;
            this.disable = false;
            this.diffArgs = {
                title: '新建AutoTask',
                url: 'auto'
            }
        }

        fetchDiffSource(idc: string) {
            this.fetchSource(idc, "all")
        }

        referAutoTask() {
            let is_validate: any = this.$refs['formItem'];
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    this.$http.post(`${this.$config.url}/${this.diffArgs.url}`, {
                        'Tp': this.formItem
                    })
                        .then((res: { data: string; }) => {
                            this.$config.notice(res.data);
                            this.fetchAutoTaskList(this.current);
                        })
                        .catch((err: any) => this.$config.err_notice(this, err))
                } else {
                    this.$Message.error("请填写相关性信息！")
                }
            })
        }

        fetchAutoTaskList(vl = 1) {
            this.$http.put(`${this.$config.url}/auto/fetch`, {
                page: vl,
                find: this.find
            })
                .then((res: { data: { data: any; page_number: number; }; }) => {
                    this.task_data = res.data.data;
                    this.task_data.forEach((item: { status: number | boolean; }) => {
                        (item.status === 1) ? item.status = true : item.status = false
                    });
                    this.page_number = res.data.page_number
                })
        }

        openEditModal(vl: { id: string; affect_rows: number; name: string; tp: number; }) {
            this.showing = true;
            this.formItem = {
                id: vl.id,
                row: vl.affect_rows,
                name: vl.name,
                tp: vl.tp
            } as any;
            this.disable = true;
            this.diffArgs = {
                title: '编辑AutoTask',
                url: 'auto/edit'
            }
        }

        delAutoTask(vl: { id: number }) {
            let step: any = this.$refs['formItem'];
            if (this.task_data.length === 1) {
                step = step - 1
            }
            axios.delete(`${this.$config.url}/auto/${vl.id}`)
                .then(res => {
                    this.$config.notice(res.data);
                    this.fetchAutoTaskList(step)
                })
                .catch(err => this.$config.err_notice(this, err))
        }

        queryData() {
            this.find.valve = true;
            this.fetchAutoTaskList();
        }

        queryCancel() {
            this.find = this.$config.clearPicker(this.find);
            this.fetchAutoTaskList();
        }

        activityStatus(vl: { status: boolean; id: number; }) {
            let s = 0;
            if (vl.status) {
                s = 1
            }

            this.$http.post(`${this.$config.url}/auto/active`, {
                'Tp': {'id': vl.id, 'status': s}
            })
                .then((res: { data: string; }) => this.$config.notice(res.data))
                .catch((err: any) => this.$config.err_notice(this, err))
        }

        mounted() {
            this.fetchAutoTaskList();
            this.fetchIDC()
        }
    }
</script>

<style scoped>

</style>
