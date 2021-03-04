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
                    <Input v-model="addAuthGroupForm.group_name" :readonly="disable"></Input>
                </FormItem>
                <FormItem label="DDL数据源:">
                    <AllCheck :source-list="connectionList.connection" @onChange="isDDLSelected"
                              :origin="permission.ddl_source" color="purple"></AllCheck>
                </FormItem>
                <FormItem label="DML数据源:">
                    <AllCheck :source-list="connectionList.connection" @onChange="isDMLSelected"
                              :origin="permission.dml_source" color="geekblue"></AllCheck>
                </FormItem>
                <FormItem label="查询数据源:">
                    <AllCheck :source-list="connectionList.query" @onChange="isQuerySelected"
                              :origin="permission.query_source" color="blue"></AllCheck>
                </FormItem>
                <FormItem label="查询审核人:">
                    <AllCheck :source-list="connectionList.person" @onChange="isAuditorSelected"
                              :origin="permission.auditor" color="cyan"></AllCheck>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script lang="ts">
import {Mixins, Component} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import search from "@/components/search/search.vue";
import {GroupCreateOrEditApi, GroupDeleteApi} from "@/apis/groupApis";
import AllCheck from "@/views/manage/group/allCheck.vue";
import {Permission} from "@/interface";

@Component({components: {search, AllCheck}})
export default class RoleGroup extends Mixins(Basic) {
    public columns = [
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
    private addAuthGroupForm = {
        group_name: '',
        open: false
    };
    public url = `${this.$config.url}/manage/group`
    private disable = false
    private permission: Permission = {
        ddl_source: [],
        dml_source: [],
        query_source: [],
        auditor: []
    };

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
        this.disable = false;
        this.addAuthGroupForm.group_name = '';
        this.permission = this.$config.clearOption(this.permission);
        this.current_page();
    }
    editAuthGroup(vl: { name: string; permissions: any; }) {
        this.disable = true;
        this.addAuthGroupForm.open = true;
        this.addAuthGroupForm.group_name = vl.name;
        this.permission = Object.assign({}, vl.permissions)
    }
    isDDLSelected(vl: any) {
        this.permission.ddl_source = vl
    }
    isDMLSelected(vl: any) {
        this.permission.dml_source = vl
    }
    isQuerySelected(vl: any) {
        this.permission.query_source = vl
    }
    isAuditorSelected(vl: any) {
        this.permission.auditor = vl
    }
    mounted() {
        this.current_page()
    }
}
</script>

<style scoped lang="less">
@import '../../../styles/common.less';
</style>
