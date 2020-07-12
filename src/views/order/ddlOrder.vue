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

    @Component({components: {orderFormContainer}})
    export default class ddl_order extends Mixins(att_mixins) {
        mounted() {
            this.$store.commit("changed_is_dml", false);
            for (let i of this.$config.highlight.split("|")) {
                this.wordList.push({vl: i, meta: "关键字"});
            }
        }

        destroyed() {
            this.$store.commit("clear_order");
            this.$store.commit("clear_always");
        }
    }
</script>
