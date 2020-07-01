<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="logo-google"/>
                    权限组
                </p>
                <div>
                    <Button type="primary" @click="batchOpen">创建权限组</Button>
                    <Input v-model="query.username" placeholder="请填写权限组" style="width: 15%" clearable
                           class="margin-left-10"></Input>
                    <Button @click="queryData" type="success" class="margin-left-10">查询</Button>
                    <Button @click="queryCancel" type="warning" class="margin-left-10">重置</Button>
                    <br>
                    <br>
                    <Table border :columns="columns" :data="table_data" stripe height="550">
                        <template slot-scope="{ row }" slot="action">
                            <Button type="info" size="small" @click="editAuthGroup(row)" style="margin-right: 5px">
                                查看与编辑
                            </Button>
                            <Poptip
                                    confirm
                                    title="确定要清空该用户的权限吗？"
                                    @on-ok="deleteAuthGroup(row)"
                                    transfer
                            >
                                <Button type="warning" size="small">删除权限组</Button>
                            </Poptip>
                        </template>
                    </Table>
                </div>
                <br>
                <Page :total="page_number" show-elevator @on-change="current_page" :page-size="10"
                      :current.sync="current"></Page>
            </Card>
        </Row>

        <Modal v-model="addAuthGroupForm.open" :width="800" @on-ok="saveAddGroup" ok-text="保存">
            <h3 slot="header" style="color:#2D8CF0">权限组</h3>
            <Form :model="addAuthGroupForm" :label-width="120" label-position="top">
                <FormItem label="权限组名称:">
                    <Input v-model="addAuthGroupForm.group_name" :readonly="isReadOnly"></Input>
                </FormItem>
                <FormItem label="DDL及索引权限:">
                    <RadioGroup v-model="permission.ddl">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
                <template v-if="permission.ddl === '1'">
                    <FormItem label="连接名:">
                        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                            <Checkbox
                                    :indeterminate="indeterminate.ddl_source"
                                    :value="checkAll.ddl_source"
                                    @click.prevent.native="check_all_args('ddl_source', 'connection')">全选
                            </Checkbox>
                        </div>
                        <CheckboxGroup v-model="permission.ddl_source" @on-change="checkAllWithDDL">
                            <Checkbox v-for="i in connectionList.connection" :label="i.Source" :key="i.Source">
                                <Tag color="purple" :key="i.Source"> {{i.Source}}</Tag>
                            </Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </template>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <FormItem label="DML权限:">
                    <RadioGroup v-model="permission.dml">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
                <template v-if="permission.dml === '1'">
                    <FormItem label="连接名:">
                        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                            <Checkbox
                                    :indeterminate="indeterminate.dml_source"
                                    :value="checkAll.dml_source"
                                    @click.prevent.native="check_all_args('dml_source',  'connection')">全选
                            </Checkbox>
                        </div>
                        <CheckboxGroup v-model="permission.dml_source" @on-change="checkAllWithDML">
                            <Checkbox v-for="i in connectionList.connection" :label="i.Source" :key="i.Source">
                                <Tag color="geekblue" :key="i.Source"> {{i.Source}}</Tag>
                            </Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </template>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <FormItem label="数据查询权限:">
                    <RadioGroup v-model="permission.query">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
                <template v-if="permission.query === '1'">
                    <FormItem label="连接名:">
                        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                            <Checkbox
                                    :indeterminate="indeterminate.query_source"
                                    :value="checkAll.query_source"
                                    @click.prevent.native="check_all_args('query_source','query')">全选
                            </Checkbox>
                        </div>
                        <CheckboxGroup v-model="permission.query_source" @on-change="checkAllWithQuery">
                            <Checkbox v-for="i in connectionList.query" :label="i.Source" :key="i.Source">
                                <Tag color="blue" :key="i.Source"> {{i.Source}}</Tag>
                            </Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </template>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <FormItem label="选择上级审核人:">
                    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                        <Checkbox
                                :indeterminate="indeterminate.auditor"
                                :value="checkAll.auditor"
                                @click.prevent.native="check_all_args('auditor', 'person')">全选
                        </Checkbox>
                    </div>
                    <CheckboxGroup v-model="permission.auditor" @on-change="checkAllWithPerson">
                        <Checkbox v-for="i in connectionList.person" :label="i.Username" :key="i.Username">
                            <Tag color="cyan" :key="i.Username"> {{i.Username}}</Tag>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <FormItem label="用户管理权限:">
                    <RadioGroup v-model="permission.user">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <FormItem label="数据库管理权限:">
                    <RadioGroup v-model="permission.base">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import {Mixins, Component} from "vue-property-decorator";
    import att_mixins from "@/mixins/att";
    import choose_mixins from "@/mixins/choose_mixins";

    @Component
    export default class role_group extends Mixins(att_mixins,choose_mixins) {
        columns = [
            {
                title: 'ID',
                key: 'ID',
                width: 85,
                sortable: true
            },
            {
                title: '权限组',
                key: 'Name',
                sortable: true
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                slot: 'action'
            }
        ];
        addAuthGroupForm = {
            group_name: '',
            open: false
        };

        isReadOnly = false;

        saveAddGroup() {
            if (this.addAuthGroupForm.group_name === '') {
                this.$Message.error("权限组名称不可为空！")
                return
            }
            axios.post(`${this.$config.url}/group/update`, {
                'username': this.addAuthGroupForm.group_name,
                'permission': this.permission,
                'tp': 1
            })
                .then(res => {
                    this.$config.notice(res.data);
                    this.current = 1;
                    this.current_page()
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                });
            this.addAuthGroupForm.open = false
        }

        current_page(vl = 1) {
            axios.get(`${this.$config.url}/group?page=${vl}&con=${JSON.stringify(this.query)}&tp=1`)
                .then(res => {
                    this.table_data = res.data.group_list;
                    this.page_number = parseInt(res.data.page);
                    this.connectionList.connection = res.data.source;
                    this.connectionList.query = res.data.query;
                    this.connectionList.person = res.data.audit;
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                })
        }

        deleteAuthGroup(vl: { Name: string; }) {
            axios.delete(`${this.$config.url}/group/del/${vl.Name}`)
                .then(res => {
                    this.$config.notice(res.data);
                    this.current_page()
                })
                .catch(err => this.$config.err_notice(this, err))
        }

        queryData() {
            this.query.valve = true;
            this.current_page()
        }

        queryCancel() {
            this.$config.clearObj(this.formItem);
            this.current_page()
        }

        batchOpen() {
            this.addAuthGroupForm.open = true;
            this.isReadOnly = false;
            this.addAuthGroupForm.group_name = '';
            this.permission = this.$config.clearOption(this.permission);
            this.current_page();
        }

        editAuthGroup(vl: { Name: string; Permissions: any; }) {
            this.isReadOnly = true;
            this.addAuthGroupForm.open = true;
            this.addAuthGroupForm.group_name = vl.Name;
            this.permission = vl.Permissions;
            this.checkAllWithQuery(this.permission.query_source)
            this.checkAllWithDDL(this.permission.ddl_source)
            this.checkAllWithDML(this.permission.dml_source)
            this.checkAllWithPerson(this.permission.auditor)
        }

        mounted() {
            this.current_page()
        }
    }
</script>

<style scoped lang="less">
    @import '../../styles/common.less';
</style>
