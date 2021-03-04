<style>
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="md-person"></Icon>
                    查询审核
                </p>
                <Row>
                    <Col span="24">
                        <search text="申请人" @refresh="current_page"></search>
                        <Button type="warning" @click="change_order_state({work_id:''},'cancel')" class="margin-left-10" size="small">全部中止</Button>
                        <br>
                        <br>
                        <Table border :columns="columns" :data="table_data" stripe>
                            <template slot-scope="{ row }" slot="action">
                                <Button type="error" size="small" @click="change_order_state(row,'stop')" v-if="row.query_per === 1"
                                        ghost>中止查询
                                </Button>
                                <Button type="error" @click="change_order_state(row,'reject')" v-if="row.query_per === 2" ghost size="small">
                                    驳回
                                </Button>
                                <Button type="success" @click="change_order_state(row,'agreed')" v-if="row.query_per === 2" ghost
                                        size="small"
                                        class="margin-left-10">同意
                                </Button>
                            </template>
                        </Table>
                        <br>
                        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="20"
                              :current.sync="current"></Page>
                    </Col>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import Basic from "@/mixins/basic";
    import render from "@/interface/render";
    import search from "@/components/search/search.vue";
    import {ChangeAuditQueryState} from "@/apis/queryApis";

    @Component({components: {search}})
    export default class query_audit extends Mixins(Basic) {
        columns = [
            {
                title: '申请编号',
                key: 'work_id'
            },
            {
                title: '时间',
                key: 'date'
            },
            {
                title: '查询说明',
                key: 'text',
                tooltip: true
            },
            {
                title: '是否导出',
                key: 'export',
                render: render.queryExport
            },
            {
                title: '申请人',
                key: 'username'
            },
            {
                title: '真实姓名',
                key: 'real_name'
            },
            {
                title: '状态',
                key: 'query_per',
                render: render.query_tag
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                slot: 'action'
            }
        ]
        url = `${this.$config.url}/audit/query/list`

        change_order_state (row: { work_id: string }, tp:string) {
            ChangeAuditQueryState({work_id:row.work_id,tp:tp})
                .finally(() => this.current_page(this.current))
        }

        mounted() {
            this.current_page()
        }
    }
</script>

<style scoped>

</style>
