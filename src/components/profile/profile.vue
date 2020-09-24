<template>
    <div>
        <Row>
            <Card dis-hover>
                <Row>
                    <Col span="5"><h2>工单编号:{{ this.order.work_id }}</h2></Col>
                    <Col span="5" offset="14">
                        <Button type="warning" v-if="order.status === 1" @click.native="open_form()">
                            查看回滚语句
                        </Button>
                        <Button type="primary"
                                v-if="order.status === 0 || order.status ===4 || order.status ===0"
                                @click.native="open_form()">重新提交
                        </Button>
                        <Poptip
                            confirm
                            title="确定要撤销工单吗？"
                            @on-ok="delOrder(order.work_id)"
                            transfer>
                            <Button type="primary" v-if="order.status === 2 " ghost>工单撤销
                            </Button>
                        </Poptip>
                        <Button type="info" @click.native="$router.go(-1)" style="margin-left: 2%">返回</Button>
                    </Col>
                </Row>
                <br>
                <basic></basic>
            </Card>
            <br>
            <Row type="flex" justify="center">
                <Card dis-hover style="width: 98%;">
                    <p slot="title">执行进度</p>
                    <Tabs name="step">
                        <TabPane label="流程步骤" name="step">
                            <Steps :current="order.current_step" size="small">
                                <Step v-for="i in order_step" :key="i.title" :title="i.desc"
                                      :content="`相关人员:${i.auditor}`"></Step>
                            </Steps>
                        </TabPane>
                        <TabPane label="阶段详情">
                            <StepDetail></StepDetail>
                        </TabPane>
                    </Tabs>
                    <br>
                    <br>
                    <h3>SQL审核</h3>
                    <collapse></collapse>
                    <br>
                    <template v-if="order.assigned ===user">
                        <Testing></Testing>
                    </template>
                </Card>
            </Row>
        </Row>
        <BackTop :height="100" :bottom="200">
            <div class="top">返回顶端</div>
        </BackTop>

        <post-form v-model="is_open"></post-form>

    </div>
</template>

<script lang="ts">
import detail_mixins from "../../mixins/detail_mixin";
import {Component, Mixins} from "vue-property-decorator";
import collapse from "@/components/profile/collapse.vue";
import basic from "@/components/profile/basic.vue";
import postForm from "@/components/profile/postForm.vue";
import Testing from "@/components/profile/testing.vue";
import reject from "@/views/audit/order/reject.vue";
import module_init_args from "@/store/modules/init_args";
import StepDetail from "@/components/profile/stepDetail.vue";

@Component({components: {collapse, basic, postForm, Testing, reject, StepDetail}})
export default class profile extends Mixins(detail_mixins) {

    get order_step() {
        return module_init_args.order_step
    }

    user = sessionStorage.getItem('user')

    created() {
        this.$http.put(`${this.$config.url}/tpl`, {source: this.order.source})
            .then((res: { data: any; }) => {
                module_init_args.fetch_order_step(res.data.steps)
            })
    }

    mounted() {
        this.fetch_post_sql()
    }
}
</script>

<style lang="less">
@import '../../styles/common.less';
@import '../../styles/table.less';

.top {
    padding: 10px;
    background: rgba(0, 153, 229, .7);
    color: #fff;
    text-align: center;
    border-radius: 2px;
}
</style>
