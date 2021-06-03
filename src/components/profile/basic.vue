<template>
    <Row type="flex" justify="center" align="top">
        <Col span="6" class="cell">
            <div class="title">环境: {{ order.idc }}</div>
            <br>
            <div class="title">数据源: {{ order.source }}</div>
            <br>
            <div class="title">数据库: {{ order.data_base }}</div>
            <br>
            <div class="title">数据表: {{ order.table }}</div>
            <br>
            <div class="title">是否备份: {{ order.backup===0?"否":"是" }}</div>
        </Col>
        <Col span="6" class="cell">
            <div class="title">提交人: {{ order.username }}</div>
            <br>
            <div class="title">提交时间: {{ order.date }}</div>
            <br>
            <div class="title">工单说明: {{ order.text }}</div>
            <br>
            <div class="title">定时执行: {{ order.delay }}</div>
        </Col>
        <Col span="5">
            <div style="text-align: center">
                <p>当前状态</p>
                <h1 style="color: #2b85e4" v-if="order.status === 2">审核中</h1>
                <h1 style="color: #c1273e" v-else-if="order.status === 0">驳回</h1>
                <h1 style="color: #35ba71" v-else-if="order.status === 1">已执行</h1>
                <h1 style="color: #e42b47" v-else-if="order.status === 4">执行失败</h1>
                <h1 style="color: #2b85e4" v-else-if="order.status === 5">待执行</h1>
                <h1 style="color: #ee881a" v-else-if="order.status === 2">执行中</h1>
            </div>
        </Col>
        <Col span="7">
            <div style="text-align: center">
                <p>SQL类型</p>
                <h3 v-if="order.type===0">DDL</h3>
                <h3 v-else>DML</h3>
            </div>

        </Col>
    </Row>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import OrderProfileMixins from "@/mixins/orderProfile";

@Component({components: {}, mixins: [OrderProfileMixins]})
export default class basic extends Vue {
}
</script>

<style scoped>
.cell {
    display: table-cell;
    padding-bottom: 16px;
    line-height: 20px;
    padding-left: 16px;
    padding-right: 16px;
}

.title {
    font-size: 13px;
    color: #515a6e;
    white-space: nowrap;
    font-weight: bolder;
}
</style>