<template>
    <Form inline ref="queryForm" :model="find">
        <FormItem prop="text">
            <Input :placeholder="text" v-model="find.text" @on-keyup.enter="queryData"></Input>
        </FormItem>
        <FormItem prop="picker">
            <DatePicker format="yyyy-MM-dd HH:mm" type="datetimerange" placeholder="请选择查询的时间范围"
                        v-model="find.picker" @on-change="find.picker=$event" style="width: 250px"
                        :editable="false"></DatePicker>
        </FormItem>
        <FormItem>
            <Button type="success" @click="queryData">查询</Button>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="queryCancel">重置</Button>
        </FormItem>
    </Form>
</template>

<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import att_mixins from "../../mixins/basic";
import modules_search from "@/store/modules/search";
@Component({components: {}})
export default class search extends Mixins(att_mixins) {
    @Prop({
        type: String,
        required: true,
        default: ''
    }) public text !: string
    queryData() {
        this.find.valve = true;
        modules_search.post_search_args(this.find)
        this.$emit("refresh")
    }
    queryCancel() {
        this.resetFields('queryForm')
        this.current = 1;
        this.$emit("refresh")
    }
    beforeDestroy() {
        this.resetFields('queryForm')
    }
}
</script>

<style scoped>
</style>