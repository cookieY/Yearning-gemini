<template>
    <div>
        <Card>
            <template slot="title">
                <Row type="flex" justify="end">
                    <Col span="2">
                        <p>
                            <Icon type="md-create"></Icon>
                            工单审核
                        </p>
                    </Col>
                    <Col span="8">
                        <Poptip trigger="hover" title="提示" content="此开关用于打开实时表格数据更新功能">
                            <i-switch v-model="valve" @on-change="refreshForm" size="large">
                                <span slot="open">打开</span>
                                <span slot="close">关闭</span>
                            </i-switch>
                        </Poptip>
                    </Col>
                    <Col span="14">
                        <nav-search @search="search"></nav-search>
                    </Col>
                </Row>
            </template>
            <Table border :columns="columns" :data="table_data" stripe size="small">
                <template slot-scope="{ row }" slot="action">
                    <template v-if="row.status !== 5">
                        <Button type="success" @click="orderDetail(row)"
                                size="small" ghost>
                            详情
                        </Button>
                        <Poptip
                            confirm
                            title="确定要中止该工单吗？"
                            @on-ok="delayKill(row)"
                            transfer>
                            <Button type="error" v-if="row.status === 3 && row.delay !== 'none'"
                                    size="small" ghost class="margin-left-10">
                                延时工单中止
                            </Button>
                        </Poptip>

                        <Button ghost size="small" class="margin-left-10" @click="timerOsc(row)"
                                type="warning" v-if="row.status === 3 && row.type === 0">osc进度
                        </Button>
                    </template>
                </template>
                <template slot-scope="{ row }" slot="delay">
                    <span v-if="row.delay !== 'none'">{{ row.delay }}</span>
                    <span v-else>无</span>
                </template>
            </Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"
                  :current.sync="current"></Page>
        </Card>
        <osc v-model="is_osc"></osc>
    </div>
</template>
<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import search from "@/components/search/search.vue";
import profile from "@/components/profile/testing.vue";
import osc from "@/views/audit/order/osc.vue";
import reject from "@/views/audit/order/reject.vue";
import render from "@/interface/render";
import {AuditKillOrder} from "@/apis/auditApis";
import modules_order from "@/store/modules/order";
import module_init_args from "@/store/modules/init_args";
import Basic from "@/mixins/basic";
import NavSearch from "@/components/search/navSearch.vue";

@Component({components: {search, profile, osc, reject, NavSearch}})
export default class platform_audit extends Mixins(Basic) {
    columns = [
        {
            title: '工单编号:',
            key: 'work_id',
            sortable: true,
            sortType: 'desc',
            width: 155
        },
        {
            title: '工单说明:',
            key: 'text',
            tooltip: true
        },
        {
            title: '工单类型',
            key: 'type',
            render: render.type
        },
        {
            title: '提交时间:',
            key: 'date',
            sortable: true
        },
        {
            title: '提交账号',
            key: 'username',
            sortable: true
        },
        {
            title: '真实姓名',
            key: 'real_name',
            sortable: true
        },
        {
            title: '定时执行',
            key: 'delay',
            slot: 'delay'
        },
        {
            title: '当前操作人',
            key: 'assigned',
            sortable: true
        },
        {
            title: '状态',
            key: 'status',
            width: 150,
            render: render.tag,
            sortable: true
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            slot: 'action'
        }
    ];
    reboot = 0;
    valve = true;
    is_osc = false;
    url = `${this.$config.url}/audit/order/list`

    search() {
        this.current = 1
        this.current_page()
    }

    delayKill(vl: { work_id: string }) {
        AuditKillOrder({work_id: vl.work_id})
            .then(() => {
                this.current_page()
            })
    }

    timerOsc(vl: { work_id: string }) {
        this.is_osc = true;
        modules_order.fetch_order_osc_id(vl.work_id)
    }

    orderDetail(row: any) {
        module_init_args.fetch_order_item(row)
        this.$router.push({
            name: 'profile',
            query: {
                isAdmin: JSON.stringify(true)
            }
        })
    }

    refreshForm(vl: boolean) {
        if (vl) {
            let vm = this;
            this.reboot = setInterval(function () {
                vm.current_page(vm.current);
            }, 5000)
        } else {
            clearInterval(this.reboot)
        }
    }

    mounted() {
        this.current_page();
        this.refreshForm(this.valve)
    }

    destroyed() {
        clearInterval(this.reboot)
    }
}
</script>

<style lang="less" scoped>
@import '../../../styles/common.less';
@import '../../../styles/table.less';

.demo-Circle-custom {
    & h1 {
        color: #3f414d;
        font-size: 28px;
        font-weight: normal;
    }

    & p {
        color: #657180;
        font-size: 14px;
        margin: 10px 0 15px;
    }

    & span {
        display: block;
        padding-top: 15px;
        color: #657180;
        font-size: 14px;

        &:before {
            content: '';
            display: block;
            width: 50px;
            height: 1px;
            margin: 0 auto;
            background: #e0e3e6;
            position: relative;
            top: -15px;
        }
    ;
    }

    & span i {
        font-style: normal;
        color: #3f414d;
    }
}

p {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
}
</style>
