<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="md-person"></Icon>
                    工单审核
                </p>
                <Row>
                    <Col span="24">
                        <Form inline>
                            <FormItem>
                                <Poptip trigger="hover" title="提示" content="此开关用于打开实时表格数据更新功能">
                                    <i-switch v-model="valve" @on-change="refreshForm" size="large">
                                        <span slot="open">打开</span>
                                        <span slot="close">关闭</span>
                                    </i-switch>
                                </Poptip>
                            </FormItem>
                        </Form>
                        <search text="工单说明" @refresh="current_page" is_order></search>
                        <Table border :columns="columns" :data="table_data" stripe>
                            <template slot-scope="{ row }" slot="action">
                                <div>
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
                                </div>
                            </template>
                            <template slot-scope="{ row }" slot="delay">
                                <span v-if="row.delay !== 'none'">{{ row.delay }}</span>
                                <span v-else>无</span>
                            </template>
                        </Table>
                        <br>
                        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="20"
                              :current.sync="current"></Page>
                    </Col>
                </Row>
            </Card>
        </Row>
        <osc v-model="is_osc"></osc>
    </div>
</template>
<script lang="ts">
import audit_mixins from "@/mixins/audit_mixin";
import {Component, Mixins} from "vue-property-decorator";
import search from "@/components/search/search.vue";
import profile from "@/components/profile/testing.vue";
import osc from "@/views/audit/order/osc.vue";
import reject from "@/views/audit/order/reject.vue";

@Component({components: {search, profile, osc, reject}})
export default class platform_audit extends Mixins(audit_mixins) {
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
<!-- remove delete request -->
