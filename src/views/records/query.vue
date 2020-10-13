<style lang="less">
    @import "../../styles/common.less";
    @import "../../styles/table.less";
</style>
<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="md-person"></Icon>
                    查询审计
                </p>
                <Row>
                    <Col span="24">
                        <search text="工单编号" @refresh="current_page"></search>
                        <Button type="warning" @click="query_empty" class="margin-left-10" size="small">删除空查询记录</Button>
                        <br>
                        <br>
                        <Table border :columns="columns" :data="table_data" stripe size="small">
                            <template slot-scope="{ row }" slot="action">
                                <Button type="text" size="small" @click="open_detail(row)">详细信息</Button>
                            </template>
                        </Table>
                    </Col>
                </Row>
                <br>
                <Page :total="page_number" show-elevator @on-change="current_page" :page-size="20"></Page>
            </Card>
        </Row>
    </div>
</template>
<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";
    import search from "@/components/search/search.vue";
    import render from "@/interface/render";

    @Component({components: {search}})
    export default class query_record extends Mixins(att_mixins) {
        columns = [
            {
                title: '工单编号:',
                key: 'work_id',
                sortable: true
            },
            {
                title: '查询人',
                key: 'username'
            },
            {
                title: '查询人姓名',
                key: 'real_name'
            },
            {
                title: '工单说明',
                key: 'text'
            },
            {
                title: '是否导出',
                key: 'export',
                render: render.queryExport
            },
            {
                title: '提交时间:',
                key: 'date',
                sortable: true
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                slot: 'action'
            }
        ];
        url = `${this.$config.url}/audit/query/fetch/record`

        open_detail(row: { work_id: string, username: string }) {
            this.$router.push({
                name: 'query_review',
                query: {
                    workid: row.work_id,
                    user: row.username
                }
            });
        }

        query_empty() {
            this.$http.delete(`${this.$config.url}/audit/query/empty`)
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data);
                    this.current_page()
                })
                .catch((err: any) => this.$config.err_notice(this, err))
        }

        current_page(vl = 1) {
            this.fetch_page(vl, this.url)
        }

        mounted() {
            this.current_page();
        }
    }
</script>
