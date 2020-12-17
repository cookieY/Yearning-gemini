<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="logo-google"/>
                    权限组
                </p>
                <div>
                    <Form inline>
                        <FormItem>
                            <Button type="primary" @click="batchOpen">创建权限组</Button>
                        </FormItem>
                        <FormItem>
                            <search text="请填写权限组" @refresh="current_page" is_group></search>
                        </FormItem>
                    </Form>
                    <Table border :columns="columns" :data="table_data" stripe height="550">
                        <template slot-scope="{ row }" slot="action">
                            <Button type="info" size="small" @click="editAuthGroup(row)" style="margin-right: 5px">
                                查看与编辑
                            </Button>
                            <Poptip
                                confirm
                                title="确定删除改权限组吗？"
                                @on-ok="delete_group(row)"
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
                <template>
                    <FormItem label="DDL数据源:">
                        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                            <Checkbox
                                :indeterminate="indeterminate.ddl_source"
                                :value="checkAll.ddl_source"
                                @click.prevent.native="check_all_args('ddl_source', 'connection')">全选
                            </Checkbox>
                        </div>
                        <CheckboxGroup v-model="permission.ddl_source" @on-change="checkAllWithDDL">
                            <Checkbox v-for="i in connectionList.connection" :label="i.source" :key="i.source">
                                <Tag color="purple" :key="i.source"> {{ i.source }}</Tag>
                            </Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </template>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <template>
                    <FormItem label="DML数据源:">
                        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                            <Checkbox
                                :indeterminate="indeterminate.dml_source"
                                :value="checkAll.dml_source"
                                @click.prevent.native="check_all_args('dml_source',  'connection')">全选
                            </Checkbox>
                        </div>
                        <CheckboxGroup v-model="permission.dml_source" @on-change="checkAllWithDML">
                            <Checkbox v-for="i in connectionList.connection" :label="i.source" :key="i.source">
                                <Tag color="geekblue" :key="i.source"> {{ i.source }}</Tag>
                            </Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </template>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <template>
                    <FormItem label="查询数据源:">
                        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                            <Checkbox
                                :indeterminate="indeterminate.query_source"
                                :value="checkAll.query_source"
                                @click.prevent.native="check_all_args('query_source','query')">全选
                            </Checkbox>
                        </div>
                        <CheckboxGroup v-model="permission.query_source" @on-change="checkAllWithQuery">
                            <Checkbox v-for="i in connectionList.query" :label="i.source" :key="i.source">
                                <Tag color="blue" :key="i.source"> {{ i.source }}</Tag>
                            </Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </template>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <FormItem label="查询审核人:">
                    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                        <Checkbox
                            :indeterminate="indeterminate.auditor"
                            :value="checkAll.auditor"
                            @click.prevent.native="check_all_args('auditor', 'person')">全选
                        </Checkbox>
                    </div>
                    <CheckboxGroup v-model="permission.auditor" @on-change="checkAllWithPerson">
                        <Checkbox v-for="i in connectionList.person" :label="i.username" :key="i.username">
                            <Tag color="cyan" :key="i.username"> {{ i.username }}</Tag>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script lang="ts">
import {Mixins, Component} from "vue-property-decorator";
import att_mixins from "@/mixins/basic";
import choose_mixins from "@/mixins/choose_mixins";
import search from "@/components/search/search.vue";
import {GroupCreateOrEditApi, GroupDeleteApi} from "@/apis/groupApis";

@Component({components: {search}})
export default class role_group extends Mixins(att_mixins, choose_mixins) {
    columns = [
        {
            title: 'ID',
            key: 'id',
            width: 85,
            sortable: true
        },
        {
            title: '权限组',
            key: 'name',
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

    url = `${this.$config.url}/manage/group`

    saveAddGroup() {
        if (this.addAuthGroupForm.group_name === '') {
            this.$Message.error("权限组名称不可为空！")
            return
        }
        GroupCreateOrEditApi({username: this.addAuthGroupForm.group_name, permission: this.permission, tp: 1})
            .finally(() => {
                this.current_page(this.current)
                this.addAuthGroupForm.open = false
            })
    }

    delete_group(vl: { name: string; }) {
        GroupDeleteApi(vl.name)
            .finally(() => this.current_page())
    }

    batchOpen() {
        this.addAuthGroupForm.open = true;
        this.isReadOnly = false;
        this.addAuthGroupForm.group_name = '';
        this.permission = this.$config.clearOption(this.permission);
        this.current_page();
    }

    editAuthGroup(vl: { name: string; permissions: any; }) {
        this.isReadOnly = true;
        this.addAuthGroupForm.open = true;
        this.addAuthGroupForm.group_name = vl.name;
        this.permission = Object.assign({}, vl.permissions)
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
@import '../../../styles/common.less';
</style>
