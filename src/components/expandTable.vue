<template>
    <code>{{row}}</code>
</template>

<script lang="ts">
    import {Component, Mixins, Prop} from "vue-property-decorator";
    import editor from "@/components/editor.vue";
    import att from "@/mixins/att";

    @Component({components: {editor}})
    export default class expandTable extends Mixins(att) {
        @Prop({
            type: String,
            required: true,
            default: ""
        }) public row !: String;
    }
</script>

<style scoped>

</style>
