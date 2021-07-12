<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";
</style>
<template>
    <Card>
        <template slot="title">
            <Row type="flex" justify="space-between" align="middle">
                <Col span="7">
                    <p>
                        <Icon type="md-pulse"></Icon>
                        查询审计
                    </p>
                </Col>
                <Col span="2">
                    <Button type="warning" @click="query_empty" class="margin-left-10" size="small">删除空查询记录</Button>
                </Col>
                <Col span="15">
                    <nav-search is_record @search="common_search" text="输入工单编号,回车搜索"></nav-search>
                </Col>
            </Row>
        </template>
        <Table border :columns="columns" :data="table_data" stripe size="small">
            <template slot-scope="{ row }" slot="action">
                <Button type="text" size="small" @click="open_detail(row)">详细信息</Button>
            </template>
        </Table>
        <br>
        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"  :current.sync="current"></Page>
    </Card>
</template>
<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import NavSearch from "@/components/search/navSearch.vue";
import render from "@/interface/render";
import {DeleteEmptyAuditQuery} from "@/apis/queryApis";

@Component({components: {NavSearch}})
export default class query_record extends Mixins(Basic) {
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
    url = `${this.$config.url}/audit/query/record`

    query_empty() {
        DeleteEmptyAuditQuery()
            .then(() => {
                this.current_page()
            })
    }

    open_detail(row: { work_id: string, username: string }) {
        this.$router.push({
            name: 'query_review',
            query: {
                workid: row.work_id,
                user: row.username
            }
        });
    }

    mounted() {
        this.current_page();
    }
}
</script>
