<template>
    <Card>
        <template slot="title">
            <Row type="flex" justify="space-between" align="middle">
                <Col span="7">
                    <p>
                        <Icon type="md-send"></Icon>
                        历史工单执行记录
                    </p>
                </Col>
                <Col span="17">
                    <nav-search is_record @search="common_search" text="输入工单编号,回车搜索"></nav-search>
                </Col>
            </Row>
        </template>
        <Table
            border
            stripe
            :columns="columns"
            :data="table_data"
            size="small"
        >
            <template slot-scope="{ row }" slot="action">
                <div>
                    <Button type="success" @click="openOrder(row)" size="small" ghost>
                        详细信息
                    </Button>
                </div>
            </template>
        </Table>
        <br>
        <Page
            :total="page_number"
            show-elevator
            @on-change="current_page"
            :page-size="15"
            :current.sync="current"
        ></Page>
    </Card>
</template>
<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import module_init_args from "@/store/modules/init_args";
import NavSearch from "@/components/search/navSearch.vue";

@Component({components: {NavSearch}})
export default class record extends Mixins(Basic) {
    columns = [
        {
            title: '工单',
            key: 'work_id'
        },
        {
            title: '工单说明',
            key: 'text',
            tooltip: true
        },
        {
            title: '执行时间',
            key: 'execute_time',
            sortType: 'desc'
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
            title: '当前操作人',
            key: 'assigned'
        },
        {
            title: '环境',
            key: 'idc'
        },
        {
            title: '连接名称',
            key: 'source'
        },
        {
            title: '库名',
            key: 'data_base'
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            slot: 'action'
        }
    ];

    url = `${this.$config.url}/audit/order/record`

    openOrder(row: any) {
        module_init_args.fetch_order_item(row)
        this.$router.push({
            name: 'profile',
            query: {
                isAdmin: JSON.stringify(false)
            }
        })
    }

    mounted() {
        this.current_page()
    }
}
</script>

<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";
</style>
