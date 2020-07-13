<style lang="less">
    @import '../../styles/common.less';
    @import '../../styles/table.less';
</style>
<template>
    <div>
        <Col span="5">
            <Card>
                <p slot="title">
                    <Icon type="md-refresh"/>
                    添加数据库
                </p>
                <div class="edittable-testauto-con">
                    <Form ref="formValidate" :model="general" :label-width="100" :rules="ruleInline">
                        <Form-item label="环境:" prop="idc">
                            <Select v-model="general.idc">
                                <Option v-for="list in comList" :value="list" :key="list">{{ list }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="连接名称:" prop="source">
                            <Input v-model="general.source" placeholder="请输入"></Input>
                        </Form-item>
                        <Form-item label="数据库地址:" prop="ip">
                            <Input v-model="general.ip" placeholder="请输入"></Input>
                        </Form-item>
                        <Form-item label="端口:" prop="port">
                            <Input v-model="general.port" placeholder="请输入"></Input>
                        </Form-item>
                        <Form-item label="用户名:" prop="username">
                            <Input v-model="general.username" placeholder="请输入"></Input>
                        </Form-item>
                        <Form-item label="密码:" prop="password">
                            <Input v-model="general.password" placeholder="请输入" type="password"></Input>
                        </Form-item>
                        <Form-item label="数据源类型:" prop="is_query">
                            <RadioGroup v-model="general.is_query">
                                <Radio :label="2">读写</Radio>
                                <Radio :label="1">读</Radio>
                                <Radio :label="0">写</Radio>
                            </RadioGroup>
                        </Form-item>
                        <FormItem label="所属管理者:" prop="admin">
                            <Select v-model="general.admin" multiple>
                                <Option v-for="i in admin_list" :key="i.username" :value="i.username"></Option>
                            </Select>
                        </FormItem>
                        <Button type="info" @click="testConnection()">测试连接</Button>
                        <Button type="success" @click="addConnection()" style="margin-left: 5%">确定</Button>
                        <Button type="warning" @click="resetForm()" style="margin-left: 5%">重置</Button>
                    </Form>
                </div>
            </Card>
        </Col>
        <Col span="19" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="md-apps"/>
                    数据库详情表
                </p>
                <Input v-model="query.source" placeholder="请填写连接名" style="width: 15%" clearable></Input>
                <Select v-model="query.idc" placeholder="请填写环境" style="width: 15%" class="margin-left-10">
                    <Option v-for="list in comList" :value="list" :key="list">{{ list }}</Option>
                </Select>
                <Button @click="queryData" type="primary" class="margin-left-10">查询</Button>
                <Button @click="queryCancel" type="warning" class="margin-left-10">重置</Button>
                <div class="edittable-con-1">
                    <Table :columns="columns" :data="table_data">
                        <template slot-scope="{ row }" slot="is_query">
                            <Tag checkable color="primary" v-if="row.is_query === 0">写</Tag>
                            <Tag checkable color="success" v-if="row.is_query === 1">读</Tag>
                            <Tag checkable color="warning" v-if="row.is_query === 2">读写</Tag>
                        </template>
                        <template slot-scope="{ row }" slot="action">
                            <Button type="info" size="small" @click="viewConnectionModal(row)"
                                    style="margin-right: 5px">详细信息
                            </Button>
                            <Poptip
                                    confirm
                                    title="删除数据源将会删除对应的所有工单信息,确定要删除吗？"
                                    @on-ok="delConnection(row)"
                                    transfer
                            >
                                <Button type="warning" size="small">删除</Button>
                            </Poptip>
                        </template>
                    </Table>
                </div>
                <br>
                <Page :total="page_number" show-elevator @on-change="getPageInfo" :page-size="10"
                      :current.sync="current"></Page>
            </Card>
        </Col>

        <Modal v-model="is_open" :width="500" okText="保存" @on-ok="modifyBase">
            <h3 slot="header" style="color:#2D8CF0">数据库连接信息</h3>
            <Form :label-width="100" label-position="right">
                <FormItem label="环境">
                    <Input v-model="edit_base_info.idc" readonly></Input>
                </FormItem>
                <FormItem label="连接名称:">
                    <Input v-model="edit_base_info.source" readonly></Input>
                </FormItem>
                <FormItem label="数据库地址:">
                    <Input v-model="edit_base_info.ip"></Input>
                </FormItem>
                <FormItem label="端口:">
                    <Input v-model="edit_base_info.port"></Input>
                </FormItem>
                <FormItem label="用户名:">
                    <Input v-model="edit_base_info.username"></Input>
                </FormItem>
                <FormItem label="密码:">
                    <Input v-model="edit_base_info.password" type="password"></Input>
                </FormItem>
                <FormItem label="所属管理员:">
                    <Select v-model="edit_base_info.admin" multiple>
                        <Option v-for="i in admin_list" :key="i.username" :value="i.username">{{i.username}}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>

    </div>
</template>
<script lang="ts">
    import {Mixins, Component} from "vue-property-decorator";
    import att_mixins from "../../mixins/basic";

    interface edit_modal {
        idc: string,
        source: string,
        ip: string,
        port: string,
        username: string,
        password: string,
        admin: string
    }

    const regExp_Name = (rule: any, value: any, callback: any) => {
        let pPattern = new RegExp("[`~!@#$^&*()={}':;',\\[\\]<>/?~！@#￥……&*（）——{}【】‘；：”“'。，、？]");
        if (pPattern.test(value)) {
            callback(new Error('特殊字符仅可使用|与-'))
        } else {
            callback()
        }
    };

    const regExp_password = (rule: any, value: any, callback: any) => {
        let pPattern = new RegExp("[`?？^$]");
        if (pPattern.test(value)) {
            callback(new Error('密码中不得含有? @ ^ $'))
        } else {
            callback()
        }
    };

    @Component
    export default class database_manager extends Mixins(att_mixins) {
        columns = [
            {
                title: '连接名称',
                key: 'source'
            },
            {
                title: '查询数据源',
                key: 'is_query',
                slot: 'is_query'
            },
            {
                title: '数据库地址',
                key: 'ip'
            },
            {
                title: '环境',
                key: 'idc'
            },
            {
                title: '操作',
                key: 'action',
                width: 300,
                slot: 'action'
            }
        ];
        // 添加表单验证规则
        ruleInline = {
            idc: [
                {
                    required: true,
                    message: '请选择对应环境',
                    trigger: 'change'
                }
            ],
            source: [
                {
                    required: true,
                    message: '请填写连接名称',
                    trigger: 'blur',

                },
                {
                    validator: regExp_Name,
                    trigger: 'blur'
                }
            ],
            ip: [
                {
                    required: true,
                    message: '请填写连接地址',
                    trigger: 'blur'
                }
            ],
            username: [
                {
                    required: true,
                    message: '请填写用户名',
                    trigger: 'blur'
                }
            ],
            port: [
                {
                    required: true,
                    message: '请填写端口',
                    trigger: 'blur'
                }
            ],
            password: [
                {
                    required: true,
                    message: '请填写密码',
                    trigger: 'blur'
                },
                {
                    validator: regExp_password,
                    trigger: 'blur'
                }
            ],
            admin: {
                required: true,
                message: '请选择所属管理员',
                type: 'array',
                min: 1,
            }
        };
        comList = [];
        edit_base_info = {} as edit_modal;
        admin_list = []

        resetForm() {
            this.resetFields('formValidate')
        }

        testConnection() {
            this.$http.put(`${this.$config.url}/management_db/test`, {
                'ip': this.general.ip,
                'username': this.general.username,
                'password': this.general.password,
                'port': parseInt(this.general.port)
            })
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data)
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }

        addConnection() {
            let is_validate: any = this.$refs['formValidate'];
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    this.$http.post(`${this.$config.url}/management_db`, {
                        'source': this.general.source,
                        'idc': this.general.idc,
                        'ip': this.general.ip,
                        'username': this.general.username,
                        'password': this.general.password,
                        'port': parseInt(this.general.port),
                        'is_query': this.general.is_query,
                        'admin': this.general.admin
                    })
                        .then((res: { data: string; }) => {
                            this.$config.notice(res.data);
                            this.getPageInfo(this.current);
                            is_validate.resetFields()
                        })
                        .catch((error: any) => {
                            this.$config.err_notice(this, error)
                        });
                }
            })
        }

        viewConnectionModal(row: edit_modal) {
            this.is_open = true;
            this.edit_base_info = Object.assign({}, row)
        }

        delConnection(vl: { source: string; }) {
            let step = this.current;
            if (this.table_data.length === 1) {
                step = step - 1
            }
            this.$http.delete(`${this.$config.url}/management_db?source=${vl.source}`)
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data);
                    this.getPageInfo(step)
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }

        getPageInfo(vl = 1) {
            this.$http.get(`${this.$config.url}/management_db?page=${vl}&con=${JSON.stringify(this.query)}`)
                .then((res: { data: { data: never[]; page: string; custom: never[]; admin: never[]; }; }) => {
                    this.table_data = res.data.data;
                    this.page_number = parseInt(res.data.page);
                    this.comList = res.data.custom;
                    this.admin_list = res.data.admin;
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }

        modifyBase() {
            let x = Object.assign({} as any, this.edit_base_info)
            x.port = parseInt(x.port);
            this.$http.put(`${this.$config.url}/management_db`, {
                'data': x
            })
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data)
                    this.getPageInfo(this.current)
                })
                .catch((err: any) => this.$config.err_notice(this, err))
        }

        queryData() {
            this.query.valve = true;
            this.getPageInfo()
        }

        queryCancel() {
            this.query.valve = false;
            this.getPageInfo()
        }

        mounted() {
            this.getPageInfo()
        }
    }
</script>

<style>
    @import '../../styles/tablesmargintop.css';
</style>
