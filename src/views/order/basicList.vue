<template>
    <div>
        <Card>
            <template slot="title">
                <Row type="flex" justify="end">
                    <Col span="10">
                        <p><Icon type="md-person"></Icon>我的工单</p>
                    </Col>
                    <Col span="14">
                    <nav-search @search="search"></nav-search>
                    </Col>
                </Row>
            </template>

            <Table border :columns="columns" :data="table_data" stripe size="small">
                <template slot-scope="{ row }" slot="action">
                    <Button type="success" @click="openOrder(row)" size="small"
                            ghost
                            class="margin-left-10">
                        工单信息
                    </Button>
                </template>
            </Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"
                  :current.sync="current"></Page>
        </Card>
    </div>

</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import render from "@/interface/render";
import module_init_args from "@/store/modules/init_args";
import NavSearch from "@/components/search/navSearch.vue";

@Component({components: {NavSearch}})
export default class BasicList extends Mixins(Basic) {
    columns = [
        {
            title: '工单编号:',
            key: 'work_id',
            sortable: true
        },
        {
            title: '工单说明',
            key: 'text',
            tooltip: true
        },
        {
            title: '工单类型',
            key: 'type',
            render: render.type
        },
        {
            title: '是否备份',
            key: 'backup',
            render: render.backup
        },
        {
            title: '提交时间:',
            key: 'date',
            sortable: true
        },
        {
            title: '当前操作人',
            key: 'assigned',
            sortable: true
        },
        {
            title: '状态',
            key: 'status',
            render: render.tag,
            sortable: true
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            slot: 'action',
            width: 300
        }
    ];

    url = `${this.$config.url}/common/list`

    search() {
        this.current = 1
        this.current_page()
    }

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