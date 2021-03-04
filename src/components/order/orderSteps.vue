<template>
    <Steps :current="steps">
        <Step title="填写工单基本信息" content="填写工单信息并选择工单类型及上级审核人"></Step>
        <Step title="填写SQL语句" content="填写需要提交的SQL语句并检测通过"></Step>
        <Step title="确认工单并提交" content="检查工单信息确认并提交至对应审核人"></Step>
    </Steps>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import Basic from "@/mixins/basic";

   @Component({})
   export default class orderSteps extends Mixins(Basic){
   }
</script>

<style scoped>

</style>
