<template>
    <div class="edittable-test-con">
        <Card>
            <div class="margin-bottom-10" style="margin-top: 2%">
                <Row type="flex" justify="center" align="middle">
                    <Col span="22">
                        <orderSteps></orderSteps>
                    </Col>
                </Row>
                <br>
                <Row>
                    <div>
                        <transition name="fade">
                            <div v-if="always.one">
                                <orderForm></orderForm>
                            </div>
                            <div v-if="always.two">
                                <orderSQLs></orderSQLs>
                            </div>

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
}
</script>

