<style lang="less">
    @import '../../styles/common.less';
    @import '../../styles/table.less';
</style>
<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="md-person"></Icon>
                    我的工单
                </p>
                <search text="工单说明" @refresh="current_page"></search>
                <Row>
                    <Col span="24">
                        <Table border :columns="columns" :data="table_data" stripe size="small">
                            <template slot-scope="{ row }" slot="action">
                                <Button type="success" @click="openOrder(row)" size="small"
                                        ghost
                                        class="margin-left-10">
                                    工单信息
                                </Button>
                            </template>
                        </Table>
                    </Col>
                </Row>
                <br>
                <Page :total="page_number" show-elevator @on-change="current_page" :page-size="20"
                      :current.sync="current"></Page>
            </Card>
        </Row>

    </div>
</template>
<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";
    import render from "@/interface/render";
    import search from "@/components/search/search.vue";
    import module_init_args from "@/store/modules/init_args";

    @Component({components: {search}})
    export default class my_order extends Mixins(att_mixins) {

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
                title: '审核/执行人',
                key: 'assigned',
                sortable: true
            },
            {
                title: '多级审核执行人',
                key: 'executor',
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

        url = `${this.$config.url}/user/order`

        current_page(vl = 1) {
            this.fetch_page(vl, this.url)
        }

        openOrder(row: any) {
            module_init_args.fetch_order_item(row)
            this.$router.push({
                name: 'profile',
            })
        }

        mounted() {
            this.current_page()
        }
    }
</script>
<!-- remove delete request -->
