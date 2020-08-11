<template>
    <div>
        <Table :columns="col" :data="table_data">
            <template slot-scope="{row}" slot="action">
                <Tag color="primary">{{row.action}}</Tag>
            </template>
        </Table>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import detail_mixins from "@/mixins/detail_mixin";

    @Component({components: {}})
    export default class StepDetail extends Mixins(detail_mixins) {
        col = [
            {
                title: '相关人',
                key: 'username'
            },
            {
                title: '操作',
                key: 'action',
                slot: 'action'
            },
            {
                title: '操作时间',
                key: 'time'
            },
            {
                title: '驳回信息',
                key: 'rejected'
            }
        ]

        mounted() {
            this.$http.get(`${this.$config.url}/audit/steps?work_id=${this.order.work_id}`)
                .then((res: { data: never[]; }) => this.table_data = res.data)
                .catch((err: any) => this.$config.err_notice(this, err))
        }
    }
</script>

<style scoped>

</style>