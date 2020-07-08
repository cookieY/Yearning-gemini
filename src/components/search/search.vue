<template>
    <Form inline ref="queryForm">
        <FormItem>
            <Input :placeholder="text" v-model="find.text" @on-keyup.enter="queryData"></Input>
        </FormItem>
        <FormItem>
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

    @Component({components: {}})
    export default class search extends Mixins(att_mixins) {

        @Prop({
            type: String,
            required: true,
            default: ''
        }) public text !: string

        queryData() {
            this.find.valve = true;
            this.$store.commit("search_args/post_search_args", this.find)
            this.$emit("refresh")
        }

        queryCancel() {
            this.$store.commit("search_args/post_search_args", this.$config.clearPicker(this.find))
            this.current = 1;
            this.$emit("refresh")
        }

        destroyed() {
            this.$store.commit("search_args/post_search_args", this.$config.clearPicker(this.find))
        }
    }
</script>

<style scoped>

</style>