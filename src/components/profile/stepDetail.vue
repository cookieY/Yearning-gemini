<template>
    <div>
        <Table :columns="col" :data="table_data" max-height="200">
            <template slot-scope="{row}" slot="action">
                <Tag color="blue" v-if="row.action === '已提交'">{{row.action}}</Tag>
                <Tag color="error" v-else-if="row.action === '驳回'">{{row.action}}</Tag>
                <Tag color="success" v-else-if="row.action === '审核通过并执行'">{{row.action}}</Tag>
                <Tag color="primary" v-else>{{row.action}}</Tag>
            </template>
        </Table>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import OrderProfileMixins from "@/mixins/orderProfile";
    import {FetchCommonGetApis} from "@/apis/commonApis";
    import {AxiosResponse} from "axios";
    import {Res} from "@/interface";

    @Component({components: {}})
    export default class StepDetail extends Mixins(OrderProfileMixins) {
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
            FetchCommonGetApis('steps',{work_id:this.order.work_id as string})
                .then((res: AxiosResponse<Res>) => this.table_data = res.data.payload)
        }
    }
</script>

<style scoped>

</style>