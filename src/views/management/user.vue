<template>
    <div>
        <Col span="4">
            <Card>
                <p slot="title">
                    <Icon type="md-settings"></Icon>
                    添加用户
                </p>
                <div class="edittable-testauto-con">
                    <Form :model="userinfo" :label-width="80" ref="userinfova" :rules="userInfoValidate">
                        <FormItem label="用户名" prop="username">
                            <Input v-model="userinfo.username" placeholder="请输入"></Input>
                        </FormItem>
                        <FormItem label="密码" prop="password">
                            <Input v-model="userinfo.password" placeholder="请输入" type="password"></Input>
                        </FormItem>
                        <FormItem label="确认密码" prop="confirm_password">
                            <Input v-model="userinfo.confirm_password" placeholder="请输入" type="password"></Input>
                        </FormItem>
                        <FormItem label="部门" prop="department">
                            <Input v-model="userinfo.department" placeholder="请输入"></Input>
                        </FormItem>
                        <FormItem label="姓名" prop="real_name">
                            <Input v-model="userinfo.real_name" placeholder="请输入"></Input>
                        </FormItem>
                        <FormItem label="角色" prop="group">
                            <Select v-model="userinfo.group" placeholder="请选择">
                                <Option value="admin">审核人</Option>
                                <Option value="perform" v-if="connectionList.multi">执行人</Option>
                                <Option value="guest">提交人</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="电子邮箱" prop="mail">
                            <Input v-model="userinfo.mail" placeholder="请输入"></Input>
                        </FormItem>
                        <Button type="primary" @click.native="registered" style="margin-left: 35%" :loading="loading">
                            注册
                        </Button>
                    </Form>
                </div>
            </Card>
        </Col>
        <Col span="20" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="md-people"></Icon>
                    系统用户表
                </p>
                <Input v-model="query.username" placeholder="请填写用户名" style="width: 20%" clearable></Input>
                <Input v-model="query.department" placeholder="请填写部门" style="width: 20%" clearable
                       class="margin-left-10"></Input>
                <Button @click="queryData" type="primary" class="margin-left-10">查询</Button>
                <Button @click="queryCancel" type="warning" class="margin-left-10">重置</Button>
                <div class="edittable-con-1">
                    <Table border :columns="columns" :data="table_data" stripe height="520">
                        <template slot-scope="{ row }" slot="rule">
                            <span v-if="row.rule === 'admin' && row.username !== 'admin'">审核人</span>
                            <span v-else-if="row.rule === 'guest'">提交人</span>
                            <span v-else-if="row.rule === 'perform'">执行人</span>
                            <span v-else-if="row.rule === 'super'">超级管理员</span>
                        </template>
                        <template slot-scope="{ row }" slot="action">
                            <Button type="primary" size="small" @click="edit_code(row)"
                                    v-if="row.username !== 'admin'">更改密码
                            </Button>
                            <Button type="success" size="small" @click="edit_rule(row)" class="margin-left-10">
                                权限
                            </Button>
                            <Button type="info" size="small" @click="edit_user(row)" class="margin-left-10">详细信息
                            </Button>
                            <template v-if="row.username !== 'admin'">
                                <Poptip
                                        confirm
                                        title="确定删除改用户吗？"
                                        transfer
                                        @on-ok="delUser(row)">
                                    <Button type="warning" size="small" v-if="row.id !== 1" class="margin-left-10">删除
                                    </Button>
                                </Poptip>
                            </template>
                        </template>
                    </Table>
                </div>
                <br>
                <Page :total="page_number" show-elevator @on-change="current_page" :page-size="10"
                      :current.sync="current"></Page>
            </Card>
        </Col>

        <edit_password v-model="edit_password" is_admin></edit_password>

        <edit_rule is_admin v-model="is_open" @success="current_page"></edit_rule>

        <edit_info v-model="is_edit" @call="current_page(current)" :user_info="payload"></edit_info>
    </div>
</template>
<script lang="ts">
    import '../../styles/tablesmargintop.css'
    import edit_password from "@/components/modal/edit_password.vue";
    import {Mixins, Component} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";
    import edit_rule from "@/components/modal/edit_rule.vue";
    import edit_info from "@/components/modal/edit_info.vue";
    import module_verify from "@/store/modules/verify";
    import module_user from "@/store/modules/user";

    @Component({components: {edit_password, edit_rule, edit_info}})
    export default class user_info extends Mixins(att_mixins) {

        regExp_password = (rule: any, value: string, callback: any) => {
            let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
            if (!pPattern.test(value)) {
                callback(new Error('至少1个大写字母,1个小写字母,1个数字'))
            } else {
                callback()
            }
        };

        valideuserinfoPassword = (rule: any, value: string, callback: any) => {
            if (value !== this.userinfo.password) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        };

        is_edit = false

        columns = [
            {
                title: '用户名',
                key: 'username',
                sortable: true
            },
            {
                title: '角色',
                key: 'rule',
                sortable: true,
                slot: 'rule'
            },
            {
                title: '姓名',
                key: 'real_name',
                sortable: true
            },
            {
                title: '部门',
                key: 'department',
                sortable: true
            },
            {
                title: 'email',
                key: 'email',
                sortable: true
            },
            {
                title: '操作',
                key: 'action',
                width: 300,
                align: 'center',
                slot: 'action'
            }
        ];
        // 新建用户
        userinfo = {
            username: '',
            password: '',
            confirm_password: '',
            group: '',
            checkbox: '',
            department: '',
            mail: '',
            real_name: ''
        };
        userInfoValidate = {
            username: [{
                required: true,
                message: '请输入用户名',
                trigger: 'blur'
            }],
            password: [
                {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                },
                {
                    min: 6,
                    message: '请至少输入6个字符',
                    trigger: 'blur'
                },
                {
                    max: 32,
                    message: '最多输入32个字符',
                    trigger: 'blur'
                },
                {
                    validator: this.regExp_password,
                    trigger: 'blur'
                }
            ],
            confirm_password: [
                {
                    required: true,
                    message: '请再次输入新密码',
                    trigger: 'blur'
                },
                {
                    validator: this.valideuserinfoPassword,
                    trigger: 'blur'
                }
            ],
            group: [
                {
                    required: true,
                    message: '请输入权限',
                    trigger: 'blur'
                }
            ],
            department: [
                {
                    required: true,
                    message: '请输入部门名称',
                    trigger: 'blur'
                },
                {
                    min: 2,
                    message: '请至少输入2个字符',
                    trigger: 'blur'
                },
                {
                    max: 32,
                    message: '最多输入32个字符',
                    trigger: 'blur'
                }
            ],
            real_name: [
                {
                    required: true,
                    message: '请输入姓名',
                    trigger: 'blur'
                },
                {
                    min: 2,
                    message: '请至少输入2个字符',
                    trigger: 'blur'
                },
                {
                    max: 32,
                    message: '最多输入32个字符',
                    trigger: 'blur'
                }],
            mail: [
                {
                    required: true,
                    message: '请输入工作邮箱',
                    trigger: 'blur'
                },
                {
                    min: 2,
                    message: '请至少输入2个字符',
                    trigger: 'blur'
                },
                {
                    max: 32,
                    message: '最多输入32个字符',
                    trigger: 'blur'
                }]
        };

        // 用户名
        username = '';

        payload = {} as any

        edit_code(row: { username: string; }) {
            this.edit_password = true;
            module_user.fetch_user_info(row)
        }

        edit_user(row: any) {
            this.payload = JSON.parse(JSON.stringify(row))
            this.payload.multi = this.connectionList.multi
            this.is_edit = true;
        }

        edit_rule(row: { username: string; }) {
            this.$http.post(`${this.$config.url}/manage_user/fetch/group`, {
                username: row.username
            })
                .then((res: { data: { group_list: never[]; group: never[]; }; }) => {
                    let group = JSON.parse(JSON.stringify(res.data))
                    group.username = row.username
                    module_verify.fetch_user_permissions(group)
                })
                .catch((err: any) => this.$config.err_notice(this, err))
                .finally(() => this.is_open = true)
        }

        registered() {
            let is_validate: any = this.$refs['userinfova'];
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    this.loading = true;
                    this.$http.post(`${this.$config.url}/manage_user`, {
                        'user_info': this.userinfo
                    })
                        .then((res: { data: string; }) => {
                            this.$config.notice(res.data);
                        })
                        .catch((error: any) => {

                            this.$config.err_notice(this, error)
                        })
                        .finally(() => {
                            this.current_page(this.current);
                            is_validate.resetFields()
                            this.loading = !this.loading;
                        })
                }
            })
        }

        current_page(vl = 1) {
            this.$http.get(`${this.$config.url}/manage_user?page=${vl}&con=${JSON.stringify(this.query)}`)
                .then((res: { data: { multi: any; data: never[]; page: number; }; }) => {
                    this.connectionList.multi = res.data.multi;
                    this.table_data = res.data.data;
                    this.page_number = res.data.page;
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }

        delUser(row: { username: string; }) {
            let step = this.current;
            if (this.table_data.length === 1) {
                step = step - 1
            }
            this.$http.delete(`${this.$config.url}/manage_user?user=${row.username}`)
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data)
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
                .finally(() => this.current_page(step))
        }

        queryData() {
            this.query.valve = true;
            this.current_page()
        }

        queryCancel() {
            this.query.valve = false;
            this.current_page()
        }

        mounted() {
            this.current_page();
        }
    }
</script>
<style lang="less" scoped>
    @import '../../styles/common.less';
    @import '../../styles/table.less';
</style>
