<template>
    <Form :label-width="80" :model="order">
        <Row>
            <Col span="8">
                <FormItem label="环境">
                    <span>{{order.idc}}</span>
                </FormItem>
                <FormItem label="数据源">
                    <span>{{order.source}}</span>
                </FormItem>
                <FormItem label="数据库">
                    <span>{{order.data_base}}</span>
                </FormItem>
                <FormItem label="定时执行">
                    <span>{{order.delay}}</span>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="数据表">
                    <span>{{order.table}}</span>
                </FormItem>
                <FormItem label="当前状态">
                    <Tag color="primary" v-if="order.status === 2">审核中</Tag>
                    <Tag color="error" v-else-if="order.status === 0">驳回</Tag>
                    <Tag color="success" v-else-if="order.status === 1">已执行</Tag>
                    <Tag color="error" v-else-if="order.status === 4">执行失败</Tag>
                    <Tag color="primary" v-else-if="order.status === 5">待执行</Tag>
                    <Tag color="warning" v-else-if="order.status === 2">执行中</Tag>
                </FormItem>
                <FormItem label="提交时间">
                    <span>{{order.date}}</span>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="提交人">
                    <span>{{order.username}}</span>
                </FormItem>
                <FormItem label="工单说明">
                    <span>{{order.text}}</span>
                </FormItem>
                <FormItem label="工单类型">
                    <Tag color="success" v-if="order.type===0">ddl</Tag>
                    <Tag color="magenta" v-else-if="order.type === 1">dml</Tag>
                </FormItem>
            </Col>
        </Row>
    </Form>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import OrderProfileMixins from "@/mixins/orderProfile";
    @Component({components: {}, mixins: [OrderProfileMixins]})
    export default class basic extends Vue {
    }
</script>

<style scoped>

</style>