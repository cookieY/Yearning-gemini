<template>
    <div>
        <RadioGroup v-model="find.status" type="button" button-style="solid" @on-change="searchChange">
            <template v-if="!is_record">
                <template v-if="is_order">
                    <Radio v-for="i in order_state" :key="i.key" :label="i.key">{{ i.title }}</Radio>
                </template>
                <template v-else>
                    <Radio v-for="i in query_state" :key="i.key" :label="i.key">{{ i.title }}</Radio>
                </template>
            </template>
        </RadioGroup>
        <DatePicker format="yyyy-MM-dd HH:mm" type="datetimerange" placeholder="请选择查询的时间范围"
                    v-model="find.picker" @on-change="searchChange" style="width: auto;margin-left: 1%"
                    :editable="false"></DatePicker>
        <Input suffix="ios-search" :placeholder=text v-model="find.text"
               style="width: 200px;margin-left: 1%" clearable @on-enter="searchChange" @on-clear="searchChange"/>
    </div>
</template>

<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import modules_search from "@/store/modules/search";

@Component({components: {}})
export default class NavSearch extends Mixins(Basic) {

    @Prop({
        type: Boolean,
        required: false,
        default: true
    }) public is_order !: boolean
    @Prop({
        type: Boolean,
        required: false,
        default: false
    }) public is_record !: boolean

    @Prop({
        type: String,
        required: false,
        default: "输入工单说明，回车搜索"
    }) public text !: string

    order_state = [
        {
            title: "全部",
            key: 7
        },
        {
            title: "审核中",
            key: 2
        },
        {
            title: "已执行",
            key: 1
        },
        {
            title: "执行失败",
            key: 4
        },
        {
            title: "驳回",
            key: 0
        }

    ]

    query_state = [
        {
            title: "全部",
            key: 7
        },
        {
            title: "待审核",
            key: 2
        },
        {
            title: "同意/查询",
            key: 1
        },
        {
            title: "驳回",
            key: 0
        },
        {
            title: "查询结束",
            key: 3
        },

    ]

    searchChange() {
        modules_search.post_search_args(this.find)
        this.$emit("search")
    }
}
</script>

<style scoped>

</style>