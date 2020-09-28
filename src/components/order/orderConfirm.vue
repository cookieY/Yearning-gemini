<template>
    <div>
        <h3>工单信息</h3>
        <br>
        <Form>
            <FormItem label="工单类型:">
                <span v-if="formItem.tp === 0">DDL</span>
                <span v-else>DML</span>
            </FormItem>
            <FormItem label="环境:">
                <span>{{ formItem.idc}}</span>
            </FormItem>

            <FormItem label="连接名:">
                <span>{{ formItem.source}}</span>
            </FormItem>

            <FormItem label="库名:">
                <span>{{ formItem.data_base}}</span>
            </FormItem>

            <FormItem label="表名:" prop="table">
                <Select v-model="formItem.table" placeholder="请选择" filterable>
                    <Option v-for="item in fetchData.table" :value="item" :key="item" :label="item"></Option>
                </Select>
            </FormItem>

            <FormItem label="工单说明:">
                <Input v-model="formItem.text" placeholder="请输入" type="textarea" :rows=4 maxlength="100"
                       show-word-limit readonly></Input>
            </FormItem>

            <FormItem label="审核人:">
                <span>{{ formItem.assigned}}</span>
            </FormItem>

            <FormItem label="定时执行">
                <span>{{formItem.delay}}</span>
            </FormItem>

            <FormItem label="是否备份">
                <RadioGroup v-model="formItem.backup">
                    <Radio :label=1 disabled>是</Radio>
                    <Radio :label=0 disabled>否</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem>
                <Alert>
                    <template slot="desc">
                        <p>1.错误等级 0正常,其他均为有问题。</p>
                        <p>2.只有错误等级等于0时提交按钮才会激活</p>
                    </template>
                </Alert>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import fetch_mixin from "@/mixins/fetch_mixin";

    @Component({})
    export default class orderConfirm extends Mixins(fetch_mixin) {
        mounted() {
            this.fetchTable()
        }
    }
</script>

<style scoped>

</style>
