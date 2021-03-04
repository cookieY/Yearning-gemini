<template>
    <Row>
        <Col span="5">
            <Card>
                <p slot="title">
                    <Icon type="md-settings"></Icon>
                    添加用户
                </p>
                <CustomForm :item="userinfo" :rule="userInfoValidate" :label-value="userLabelValue" ref="reg">
                    <template slot="rule">
                        <Select v-model="userinfo.rule" placeholder="请选择">
                            <Option value="admin">操作人</Option>
                            <Option value="guest">提交人</Option>
                        </Select>
                    </template>
                </CustomForm>
                <Button type="primary" @click.native="registered" style="margin-left: 35%" :loading="loading">
                    注册
                </Button>
            </Card>
        </Col>
        <Col span="19" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="md-people"></Icon>
                    系统用户表
                </p>
                <Form>
                    <Input v-model="find.username" placeholder="请填写用户名" style="width: 20%" clearable></Input>
                    <Input v-model="find.dept" placeholder="请填写部门" style="width: 20%" clearable
                           class="margin-left-10"></Input>
                    <Button @click="queryData" type="primary" class="margin-left-10">查询</Button>
                    <Button @click="queryCancel" type="warning" class="margin-left-10">重置</Button>
                </Form>
                <div class="edit-table-con-1">
                    <Table border :columns="columns" :data="table_data" stripe>
                        <template slot-scope="{ row }" slot="rule">
                            <span v-if="row.rule === 'admin'">操作人</span>
                            <span v-else-if="row.rule === 'guest'">提交人</span>
                            <span v-else-if="row.rule === 'super'">超级管理员</span>
                        </template>
                        <template slot-scope="{ row }" slot="action">
                            <Button type="primary" size="small" @click="edit_code(row)">更改密码
                            </Button>
                            <Button type="success" size="small" @click="edit_rule(row)" class="margin-left-10">
                                权限
                            </Button>
                            <Button type="info" size="small" @click="edit_user(row)" class="margin-left-10">详细信息
                            </Button>
                            <template v-if="row.username !== 'admin'">
                                <Button type="warning" size="small" v-if="row.id !== 1" class="margin-left-10"
                                        @click="show_depend(row)">删除
                                </Button>
                            </template>
                        </template>
                    </Table>
                </div>
                <br>
                <Page :total="page_number" show-elevator @on-change="current_page" :page-size="10"
                      :current.sync="current"></Page>
            </Card>
        </Col>

        <Modal v-model="is_depend" title="依赖清单">
            <Divider orientation="left">自定义流程</Divider>
            <Tag type="border" v-for="i in depend_list.source" :key="`source-${i.source}`">{{ i.source }}</Tag>
            <Divider orientation="left">权限组</Divider>
            <Tag type="border" v-for="i in depend_list.grained" :key="`grained-${i.name}`">{{ i.name }}</Tag>
            <div slot="footer">
                <Button type="error" @click="del_user" :disabled="del_disabled">删除</Button>
            </div>
        </Modal>

        <ChangePassword v-model="edit_password" is_admin></ChangePassword>
        <RulesLimits is_admin v-model="is_open" @success="current_page(current)"></RulesLimits>
        <EditProfile v-model="is_edit" @call="current_page(current)" :user_info="payload"></EditProfile>
    </Row>
</template>
<script lang="ts">
import ChangePassword from "@/components/modal/changePassword.vue";
import {Mixins, Component} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import RulesLimits from "@/components/modal/rulesLimits.vue";
import EditProfile from "@/components/modal/editProfile.vue";
import module_verify from "@/store/modules/verify";
import module_user from "@/store/modules/user";
import {DependUser, UserInfo} from "@/views/manage/user/types";
import {UserCreateOrEditApi, UserDeleteApi, UserDependGetApi} from "@/apis/userApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import i18n from "@/language";
import CustomForm, {Label} from "@/components/customForm/customForm.vue";

@Component({components: {ChangePassword, RulesLimits, EditProfile, CustomForm}})
export default class user_info extends Mixins(Basic) {

    regExp_password = (rule: any, value: string, callback: any) => {
        let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
        if (!pPattern.test(value)) {
            callback(new Error('至少1个大写字母,1个小写字母,1个数字'))
        } else {
            callback()
        }
    };

    valid_Password = (rule: any, value: string, callback: any) => {
        if (value !== this.userinfo.password) {
            callback(new Error('两次输入密码不一致'))
        } else {
            callback()
        }
    };

    is_depend = false
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
    userinfo: UserInfo = {
        username: '',
        password: '',
        confirm_password: '',
        rule: '',
        department: '',
        email: '',
        real_name: ''
    };
    userLabelValue: Label = {
        username: {name: '用户名'},
        password: {name: '密码', type: 'password'},
        confirm_password: {name: '确认密码', type: 'password'},
        rule: {name: '角色'},
        department: {name: '部门'},
        email: {name: '电子邮件'},
        real_name: {name: '姓名'},
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
                validator: this.valid_Password,
                trigger: 'blur'
            }
        ],
        rule: [
            {
                required: true,
                message: '请输入角色',
                trigger: 'change'
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
        email: [
            {
                required: true,
                message: '请输入工作邮箱',
                trigger: 'blur'
            },
            {type: 'email', message: i18n.t('sign_up_validate.mail_format'), trigger: 'blur'}
        ]
    };

    // 用户名
    username = '';

    del_disabled = true

    payload = {} as any

    depend_list = {} as DependUser

    url = `${this.$config.url}/manage/user`

    edit_code(row: { username: string }) {
        this.edit_password = true;
        module_user.fetch_user_info(row)
    }

    edit_user(row: any) {
        this.payload = JSON.parse(JSON.stringify(row))
        this.is_edit = true;
    }

    edit_rule(row: { username: string; }) {
        UserDependGetApi({tp: 'group', user: row.username})
            .then((res: AxiosResponse<Res>) => {
                let group = JSON.parse(JSON.stringify(res.data.payload))
                group.username = row.username
                module_verify.fetch_user_permissions(group)
            })
            .finally(() => this.is_open = true)
    }

    registered() {
        const verify = this.$config.formVerify(this.$refs.reg)
        if (verify.isOk) {
            this.loading = true;
            UserCreateOrEditApi({tp: 'create', user: this.userinfo})
                .finally(() => {
                    verify.next.resetFields()
                    this.current_page(this.current);
                    this.loading = !this.loading;
                })
        }
    }

    show_depend(row: { username: string; }) {
        this.is_depend = !this.is_depend
        this.del_disabled = true
        this.username = row.username
        UserDependGetApi({tp: 'depend', user: row.username})
            .then((res: AxiosResponse<Res>) => {
                this.depend_list = res.data.payload
            })
            .finally(() => {
                if (this.depend_list.grained.length === 0 && this.depend_list.source.length === 0) {
                    this.del_disabled = !this.del_disabled
                }
            })
    }

    del_user() {
        UserDeleteApi(this.username)
            .finally(() => {
                this.current_page(this.table_data.length === 1 ? this.current - 1 : this.current)
                this.is_depend = !this.is_depend
            })
    }

    mounted() {
        this.current_page();
    }
}
</script>
<style lang="less" scoped>
@import '../../../styles/common.less';
@import '../../../styles/table.less';
</style>
