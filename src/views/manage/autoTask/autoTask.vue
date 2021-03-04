<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="md-sync"></Icon>
                    autoTask
                </p>
                <Form inline ref="queryForm" :modal="find">
                    <FormItem>
                    </FormItem>
                    <FormItem>
                        <Button type="warning" @click="createTask">新建Task</Button>
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
                <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"
                      :current.sync="current"></Page>
            </Card>
        </Row>

        <Modal v-model="is_open" title="AutoTask信息" @on-ok="postAutoTask">
            <Form :model="general" ref="general" :rules="ruleValidate">
                <FormItem label="Task名称" prop="name">
                    <Input v-model="general.name" :disabled="disable"></Input>
                </FormItem>
                <FormItem label="类型" required>
                    <Select v-model="general.tp">
                        <Option v-for="i in fetchList.tp" :key="i.v" :value="i.v">{{i.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="环境:" prop="idc">
                    <Select v-model="general.idc" @on-change="fetchDiffSource">
                        <Option v-for="i in fetchData.idc" :key="i" :value="i">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="连接名" prop="source">
                    <Select v-model="general.source" @on-change="fetchBase" filterable>
                        <Option v-for="i in fetchData.source" :key="i" :value="i">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="库" prop="data_base">
                    <Select v-model="general.data_base" @on-change="fetchTable" filterable>
                        <Option v-for="i in fetchData.base" :key="i" :value="i">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="表" prop="table">
                    <Select v-model="general.table" filterable>
                        <Option v-for="i in fetchData.table" :key="i" :value="i">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="最大影响行数" prop="row">
                    <InputNumber :min="1" v-model="general.row"></InputNumber>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {Mixins, Component} from "vue-property-decorator";
    import FetchMixins from "@/mixins/fetch";
    import {
        AutoTaskCreateOrEditApi, AutoTaskDeleteApi,
        AutoTaskFetchApi,
    } from "@/apis/autoTaskApis";
    import {FetchCommonGetApis} from "@/apis/commonApis";
    import {AxiosResponse} from "axios";
    import {Res} from "@/interface";

    @Component
    export default class autoTask extends Mixins(FetchMixins) {
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
                key: 'data_base',
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
        disable = false;
        resType = ''

        createTask() {
            this.is_open = !this.is_open
            this.disable = false;
            this.resType = 'create'
        }

        fetchDiffSource(idc: string) {
            this.fetchSource(idc, "all")
        }

        postAutoTask() {
            let is_validate: any = this.$refs['general'];
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    AutoTaskCreateOrEditApi({tp:this.resType,task:this.general})
                        .then(() => {
                            this.current_page(this.current);
                        })
                } else {
                    this.$Message.error("请填写相关性信息！")
                }
            })
        }

        current_page(vl = 1) {
            AutoTaskFetchApi({page:vl,find:this.find})
                .then((res: AxiosResponse<Res>) => {
                    this.task_data = res.data.payload.data;
                    this.task_data.forEach((item: { status: number | boolean; }) => {
                        (item.status === 1) ? item.status = true : item.status = false
                    });
                    this.page_number = res.data.payload.page
                })
        }

        openEditModal(vl: { id: string; affect_rows: number; name: string; tp: number; }) {
            this.is_open = !this.is_open;
            this.general = {
                id: vl.id,
                row: vl.affect_rows,
                name: vl.name,
                tp: vl.tp
            } as any;
            this.disable = true;
            this.resType = 'edit'
        }

        delAutoTask(vl: { id: number }) {
            AutoTaskDeleteApi(vl.id)
                .finally(() =>  {
                    this.current_page(this.task_data.length === 1? this.current -= 1:this.current)
                })
        }

        activityStatus(vl: { status: boolean; id: number; }) {
            AutoTaskCreateOrEditApi({tp:'active',task:{id:vl.id,status:vl.status?1:0}})
        }

        fetchTable() {
            if (this.general.data_base) {
                FetchCommonGetApis('table',{
                    source: this.general.source,
                    data_base: this.general.data_base
                })
                    .then((res: AxiosResponse<Res> ) => {
                        this.fetchData.table = res.data.payload.table;
                    })
            }
        }

        mounted() {
            this.current_page();
            this.fetchIDC()
        }
    }
</script>

<style>
@import "../../../styles/common.less";
</style>