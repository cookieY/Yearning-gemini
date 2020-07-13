<template>
    <div class="edittable-test-con">
        <Card>
            <div class="margin-bottom-10" style="margin-top: 2%">
                <Row type="flex" justify="center" align="middle">
                    <Col span="16">
                        <orderSteps></orderSteps>
                    </Col>
                </Row>
                <br>
                <Row>
                    <div id="order" class="div-relative">
                        <transition name="fade">
                            <div v-if="always.one">
                                <orderForm></orderForm>
                            </div>
                        </transition>
                        <transition name="fade">
                            <div v-if="always.two">
                                <orderSQLs></orderSQLs>
                            </div>
                        </transition>
                        <transition name="fade">
                            <div v-if="always.three">
                                <orderIsPost></orderIsPost>
                            </div>
                        </transition>
                    </div>
                </Row>
            </div>
        </Card>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import orderSteps from "./orderSteps.vue"
    import orderForm from "./orderForm.vue"
    import att_mixins from "@/mixins/basic";
    import orderSQLs from "@/components/order/orderSQLs.vue";
    import orderIsPost from "@/components/order/orderIsPost.vue";

    @Component({components: {orderSteps, orderForm, orderSQLs, orderIsPost}})
    export default class orderFormContainer extends Mixins(att_mixins) {
        created() {
            let windows: any = window;
            windows.particlesJS.load('order', `${process.env.BASE_URL}particlesjs-config.json`);
        }
    }
</script>

<style scoped>
    .div-relative {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>
