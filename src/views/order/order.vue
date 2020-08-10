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
    import editor from '@/components/editor.vue'
    import {Component, Mixins} from "vue-property-decorator";
    import orderFormContainer from "@/components/order/orderFormContainer.vue";
    import att_mixins from "@/mixins/basic";

    @Component({components: {editor, orderFormContainer}})
    export default class dml_order extends Mixins(att_mixins) {

        mounted() {
            for (let i of this.$config.highlight.split('|')) {
                this.wordList.push({'vl': i, 'meta': '关键字'})
            }
        }
    }
</script>
