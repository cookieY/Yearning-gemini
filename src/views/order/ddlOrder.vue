<template>
    <div>
        <Row>
            <Col span="24">
                <orderFormContainer></orderFormContainer>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import orderFormContainer from "@/components/order/orderFormContainer.vue";
    import att_mixins from "@/mixins/basic";
    import modules_order from "@/store/modules/order";

    @Component({components: {orderFormContainer}})
    export default class ddl_order extends Mixins(att_mixins) {
        mounted() {
            if (!modules_order.ddl_save) {
                modules_order.clear_always()
                modules_order.clear_order()
            }
            modules_order.changed_is_dml(false)
            for (let i of this.$config.highlight.split("|")) {
                this.wordList.push({vl: i, meta: "关键字"});
            }
        }
    }
</script>
