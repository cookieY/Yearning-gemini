<template>
    <div>
        <Row>
            <Card dis-hover>
                <Row>
                    <Col span="5"><h2>工单编号:{{ this.order.work_id }}</h2></Col>
                    <Col span="5" offset="14">
                        <Button type="warning" v-if="order.status === 1" @click.native="open_form()">查看回滚语句
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
                    <Steps :current="2" size="small">
                        <Step title="工单提交">
                            <div slot="content">
                                <p>审核人: henry</p>
                                <p>提交时间: 2020-08-08</p>
                            </div>
                        </Step>
                        <Step title="工单审核"></Step>
                        <Step title="工单转交"></Step>
                        <Step title="工单执行"></Step>
                    </Steps>
                    <br>
                    <h3>SQL详情</h3>
                    <br>
                    <collapse></collapse>
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

    @Component({components: {collapse, basic, postForm}})
    export default class profile extends Mixins(detail_mixins) {
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
