<template>
    <code>{{row}}</code>
</template>

<script lang="ts">
    import {Component, Mixins, Prop} from "vue-property-decorator";
    import att from "@/mixins/basic";

    @Component({components: {}})
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
