<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    单号：{{ this.order.work_id }}
                </p>
                <h3>工单基础信息</h3>
                <br>
                <basic></basic>
                <h3>操作</h3>
                <br>
                <Row>
                    <Col span="24">
                        <Form inline>
                            <FormItem>
                                <Button type="info" @click.native="$router.go(-1)" size="small">返回</Button>
                            </FormItem>
                            <FormItem>
                                <Button type="warning" v-if="order.status === 1" @click.native="open_form()"
                                        size="small">查看回滚语句
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button type="primary"
                                        v-if="order.status === 0 || order.status ===4 || order.status ===0"
                                        @click.native="open_form()" size="small">重新提交
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Poptip
                                        confirm
                                        title="确定要撤销工单吗？"
                                        @on-ok="delOrder(order.work_id)"
                                        transfer>
                                    <Button type="primary" v-if="order.status === 2 " ghost size="small">工单撤销
                                    </Button>
                                </Poptip>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <h3>SQL详情</h3>
                <br>
                <collapse></collapse>
            </Card>
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
