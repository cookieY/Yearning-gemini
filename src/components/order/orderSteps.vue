<template>
    <Steps :current="steps">
        <Step title="填写工单基本信息"></Step>
        <Step title="填写SQL语句" ></Step>
        <Step title="确认工单并提交" ></Step>
    </Steps>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";

   @Component({})
   export default class orderSteps extends Mixins(att_mixins){
   }
</script>

<style scoped>

</style>
