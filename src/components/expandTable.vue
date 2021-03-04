<template>
    <code>{{row}}</code>
</template>

<script lang="ts">
    import {Component, Mixins, Prop} from "vue-property-decorator";
    import Basic from "@/mixins/basic";

    @Component({components: {}})
    export default class expandTable extends Mixins(Basic) {
        @Prop({
            type: String,
            required: true,
            default: ""
        }) public row !: String;
    }
</script>

<style scoped>

</style>
