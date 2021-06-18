<style>
@import "../../../styles/common.less";
</style>
<template>
    <Card>
        <template slot="title">
            <Row type="flex" justify="space-between" align="middle">
                <Col span="7">
                    <p><Icon type="logo-rss"></Icon>查询审核</p>
                </Col>
                <Col span="2">
                    <Tooltip content="更改所有工单的状态为查询结束" placement="top-start">
                        <Button @click="change_order_state({work_id:''},'cancel')">终止所有工单</Button>
                    </Tooltip>
                </Col>
                <Col span="15">
                    <nav-search :is_order="false" text="输入申请人,回车搜索" @search="common_search"></nav-search>
                </Col>
            </Row>
        </template>
        <Table border :columns="columns" :data="table_data" stripe size="small">
            <template slot-scope="{ row }" slot="action">
                <template v-if="row.query_per === 1">
                    <Button type="error" size="small" @click="change_order_state(row,'stop')"
                            ghost>中止查询
                    </Button>
                </template>
                <template v-else-if="row.query_per !== 3">
                    <Button type="error" @click="change_order_state(row,'reject')" ghost size="small">
                        驳回
                    </Button>
                    <Button type="success" @click="change_order_state(row,'agreed')" ghost
                            size="small"
                            class="margin-left-10">同意
                    </Button>
                </template>
            </template>
        </Table>
        <br>
        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"
              :current.sync="current"></Page>
    </Card>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import render from "@/interface/render";
import {ChangeAuditQueryState} from "@/apis/queryApis";
import NavSearch from "@/components/search/navSearch.vue";

@Component({components: {NavSearch}})
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
            align: 'center',
            slot: 'action'
        }
    ]
    url = `${this.$config.url}/audit/query/list`

    change_order_state(row: { work_id: string }, tp: string) {
        ChangeAuditQueryState({work_id: row.work_id, tp: tp})
            .finally(() => this.current_page(this.current))
    }

    mounted() {
        this.current_page()
    }
}
</script>

<style scoped>

</style>
