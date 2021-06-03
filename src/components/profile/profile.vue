<template>
    <div>
        <Card dis-hover>
            <Row>
                <Col span="5"><h2>工单编号:{{ this.order.work_id }}</h2></Col>
                <Col span="5" offset="14">
                    <ButtonGroup>
                        <Button type="default" @click.native="$router.go(-1)">返回</Button>
                        <Button type="default" v-if="order.status === 1 || order.status === 4" @click.native="open_form()">
                            查看回滚语句
                        </Button>
                        <Button type="default"
                                v-if="order.status === 0"
                                @click.native="open_form()">重新提交
                        </Button>
                        <Poptip
                            confirm
                            title="确定要撤销工单吗？"
                            @on-ok="delOrder(order.work_id)"
                            transfer>
                            <Button type="default" v-if="order.status === 2 && !JSON.parse($route.query.isAdmin) ">工单撤销
                            </Button>
                        </Poptip>
                    </ButtonGroup>

                </Col>
            </Row>
            <br>
            <basic></basic>
        </Card>
        <br>
        <Card dis-hover>
            <p slot="title">流程步骤</p>
            <Steps :current="order.current_step">
                <Step v-for="i in order_step" :key="i.title" :title="i.desc"
                      :content="`相关人员:${i.auditor}`"></Step>
            </Steps>
        </Card>
        <br>
        <Card>
            <p slot="title">流程记录</p>
            <StepDetail></StepDetail>
        </Card>
        <br>
        <Card>
            <p slot="title">SQL审核</p>
            <collapse></collapse>
            <br>
            <template v-if="order.assigned === user && JSON.parse($route.query.isAdmin)">
                <Testing></Testing>
            </template>
        </Card>
        <BackTop :height="100" :bottom="200">
            <div class="top">返回顶端</div>
        </BackTop>
        <post-form v-model="is_open"></post-form>
    </div>
</template>

<script lang="ts">
import OrderProfileMixins from "@/mixins/orderProfile";
import {Component, Mixins} from "vue-property-decorator";
import collapse from "@/components/profile/collapse.vue";
import basic from "@/components/profile/basic.vue";
import postForm from "@/components/profile/postForm.vue";
import Testing from "@/components/profile/testing.vue";
import reject from "@/views/audit/order/reject.vue";
import module_init_args from "@/store/modules/init_args";
import StepDetail from "@/components/profile/stepDetail.vue";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import {TplFetchProfile} from "@/apis/tplApis";

@Component({components: {collapse, basic, postForm, Testing, reject, StepDetail}})
export default class profile extends Mixins(OrderProfileMixins) {

    get order_step() {
        return module_init_args.order_step
    }

    user = sessionStorage.getItem('user')

    created() {
        TplFetchProfile(this.order.idc as string)
            .then((res: AxiosResponse<Res>) => {
                module_init_args.fetch_order_step(res.data.payload.steps)
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
