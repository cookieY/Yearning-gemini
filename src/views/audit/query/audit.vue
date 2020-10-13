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
                        <search text="账号名" @refresh="current_page"></search>
                        <Button type="warning" @click="queryQuickCancel" class="margin-left-10" size="small">全部中止</Button>
                        <br>
                        <br>
                        <Table border :columns="columns" :data="table_data" stripe>
                            <template slot-scope="{ row }" slot="action">
                                <Button type="error" size="small" @click="stop_query(row)" v-if="row.query_per === 1"
                                        ghost>中止查询
                                </Button>
                                <Button type="error" @click="reject(row)" v-if="row.query_per === 2" ghost size="small">
                                    驳回
                                </Button>
                                <Button type="success" @click="post_order(row)" v-if="row.query_per === 2" ghost
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
    import att_mixins from "@/mixins/basic";
    import render from "@/interface/render";
    import search from "@/components/search/search.vue";

    @Component({components: {search}})
    export default class query_audit extends Mixins(att_mixins) {
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
        url = `${this.$config.url}/audit/query/fetch`

        queryQuickCancel() {
            this.$http.post(`${this.$config.url}/audit/query/handle/cancel`)
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data);
                    this.current_page()
                })
                .catch((err: any) => this.$config.err_notice(this, err))
        }

        current_page(vl = 1) {
            this.fetch_page(vl, this.url)
        }

        post_order(row: { work_id: string }) {
            this.$http.post(`${this.$config.url}/audit/query/handle/agreed`, {'work_id': row.work_id})
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data);
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
                .finally(() => this.current_page(this.current))
        }

        reject(row: { work_id: string }) {
            this.$http.post(`${this.$config.url}/audit/query/handle/disagreed`, {'work_id': row.work_id})
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data)
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
                .finally(() => this.current_page(this.current))
        }

        stop_query(vl: { work_id: string }) {
            this.$http.post(`${this.$config.url}/audit/query/handle/undo`, {'work_id': vl.work_id})
                .then((res: { data: any; }) => {
                    this.$config.notice(res.data)
                })
                .catch((err: any) => this.$config.err_notice(this, err))
                .finally(() => this.current_page(this.current))
        }

        mounted() {
            this.current_page()
        }
    }
</script>

<style scoped>

</style>
