<template>
    <div>
        <Card>
            <p slot="title" style="height: 45px">
                <Icon type="android-send"></Icon>
                工单{{ this.$route.query.workid }}详细信息
                <br>
                <Button type="text" @click.native="$router.go(-1)">返回</Button>
            </p>
            <Table border :columns="tabcolumns" :data="TableDataNew" class="tabletop" style="background: #5cadff"
                   size="large"></Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="currentpage" :page-size="20"
                  ref="page"></Page>
        </Card>
        <BackTop></BackTop>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'expend',
        data() {
            return {
                page_number: 1,
                tabcolumns: [
                    {
                        title: '序号:',
                        key: 'ID',
                        sortable: true
                    },
                    {
                        title: '查询语句:',
                        key: 'SQL',
                        sortable: true
                    },
                    {
                        title: '查询时间:',
                        key: 'Time',
                        sortable: true
                    },
                    {
                        title: '查询耗时(ms):',
                        key: 'ExTime',
                        sortable: true
                    },
                    {
                        title: '数据源:',
                        key: 'Source',
                        sortable: true
                    },
                    {
                        title: '数据库:',
                        key: 'BaseName',
                        sortable: true
                    }
                ],
                TableDataNew: []
            }
        },
        methods: {
            currentpage(vl = 1) {
                axios.put(`${this.$config.url}/audit/query/fetch/record/detail`, {
                    'WorkId': this.$route.query.workid,
                    'Page': vl
                })
                    .then(res => {
                        this.TableDataNew = res.data.data;
                        this.page_number = res.data.count
                    })
                    .catch(error => {
                        this.$config.err_notice(this,error)
                    })
            }
        },
        mounted() {
            this.currentpage()
        }
    }
</script>

<style scoped>

</style>
