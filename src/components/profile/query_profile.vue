<template>
    <div>
        <Card>
            <p slot="title" style="height: 45px">
                <Icon type="android-send"></Icon>
                工单{{ this.$route.query.workid }}详细信息
                <br>
                <Button type="text" @click.native="$router.go(-1)">返回</Button>
            </p>
            <Table border :columns="columns" :data="table_data" class="tabletop" style="background: #5cadff"
                   size="large"></Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="current_page" :page-size="20"
                  ref="page"></Page>
        </Card>
        <BackTop></BackTop>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";

    @Component({components: {}})
    export default class query_profile extends Mixins(att_mixins) {
        columns = [
            {
                title: '序号:',
                key: 'id',
                sortable: true
            },
            {
                title: '查询语句:',
                key: 'sql',
                sortable: true
            },
            {
                title: '查询时间:',
                key: 'time',
                sortable: true
            },
            {
                title: '查询耗时(ms):',
                key: 'ex_time',
                sortable: true
            },
            {
                title: '数据源:',
                key: 'source',
                sortable: true
            },
            {
                title: '数据库:',
                key: 'base_name',
                sortable: true
            }
        ]

        current_page(vl = 1) {
            this.$http.put(`${this.$config.url}/audit/query/fetch/record/detail`, {
                'work_id': this.$route.query.workid,
                'page': vl
            })
                .then((res: { data: { data: never[]; count: number; }; }) => {
                    this.table_data = res.data.data;
                    this.page_number = res.data.count
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }

        mounted() {
            this.current_page()
        }
    }

</script>