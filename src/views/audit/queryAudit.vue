<style>
  @import "../../styles/common.less";
</style>
<template>
  <div>
    <Row>
      <Card>
        <p slot="title">
          <Icon type="md-person"></Icon>
          查询审核
        </p>
        <Row>
          <Col span="24">
            <Form inline>
              <FormItem>
                <Input placeholder="账号名" v-model="find.user"></Input>
              </FormItem>
              <FormItem>
                <DatePicker format="yyyy-MM-dd HH:mm" type="datetimerange" placeholder="请选择查询的时间范围"
                            v-model="find.picker" @on-change="find.picker=$event" style="width: 250px"
                            :editable="false"></DatePicker>
              </FormItem>
              <FormItem>
                <Button type="success" @click="queryData">查询</Button>
                <Button type="primary" @click="queryCancel" class="margin-left-10">重置</Button>
                <Button type="info" @click="queryQuickCancel" class="margin-left-10">全部中止</Button>
              </FormItem>
            </Form>
            <Table border :columns="columns" :data="query_info" stripe>
              <template slot-scope="{ row }" slot="action">
                <Button type="error" size="small" @click="stop_query(row)" v-if="row.QueryPer === 1" ghost>中止查询</Button>
                <Button type="error" @click="reject(row)" v-if="row.QueryPer === 2" ghost size="small">驳回</Button>
                <Button type="success" @click="savedata(row)" v-if="row.QueryPer === 2" ghost size="small"
                        class="margin-left-10">同意
                </Button>
              </template>
            </Table>
            <br>
            <Page :total="per_pn" show-elevator @on-change="permisson_list" :page-size="20" ref="perpage"></Page>
          </Col>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'Query_audit',
        data() {
            return {
                query_info: [],
                columns: [
                    {
                        title: '申请编号',
                        key: 'WorkId'
                    },
                    {
                        title: '时间',
                        key: 'Date'
                    },
                    {
                        title: '查询说明',
                        key: 'Text',
                        tooltip: true
                    },
                    {
                        title: '是否导出',
                        key: 'Export'
                    },
                    {
                        title: '申请人',
                        key: 'Username'
                    },
                    {
                        title: '真实姓名',
                        key: 'Realname'
                    },
                    {
                        title: '状态',
                        key: 'QueryPer',
                        render: (h, params) => {
                            const row = params.row
                            let color = ''
                            let text = ''
                            if (row.QueryPer === 2) {
                                color = 'primary'
                                text = '待审核'
                            } else if (row.QueryPer === 0) {
                                color = 'error'
                                text = '驳回'
                            } else if (row.QueryPer === 1) {
                                color = 'success'
                                text = '同意/查询'
                            } else {
                                color = 'warning'
                                text = '查询结束'
                            }
                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        slot: 'action'
                    }
                ],
                per_pn: 1,
                find: {
                    picker: [],
                    user: '',
                    valve: false
                }
            }
        },
        methods: {
            queryQuickCancel() {
                axios.put(`${this.$config.url}/audit/query/cancel`)
                    .then(res => {
                        this.$config.notice(res.data);
                        this.permisson_list()
                    })
                    .catch(err => this.$config.err_notice(this,err))
            },
            permisson_list(vl = 1) {
                axios.put(`${this.$config.url}/audit/query/fetch`, {
                    page: vl,
                    find: this.find
                })
                    .then(res => {
                        this.query_info = res.data.data;
                        this.query_info.forEach((item) => {
                            (item.Export === 1) ? item.Export = '是' : item.Export = '否'
                        });
                        this.per_pn = res.data.page
                    })
                    .catch(error => {
                        this.$config.err_notice(this,error)
                    })
            },
            savedata(row) {
                axios.post(`${this.$config.url}/audit/query/agreed`, {'WorkId': row.WorkId})
                    .then(res => {
                        this.$config.notice(res.data);
                        this.$refs.perpage.currentPage = 1;
                        this.permisson_list()
                    })
                    .catch(error => {
                        this.$config.err_notice(this,error)
                    })
            },
            reject(row) {
                axios.post(`${this.$config.url}/audit/query/disagreed`, {'WorkId': row.WorkId})
                    .then(res => {
                        this.$config.notice(res.data)
                        this.$refs.perpage.currentPage = 1
                        this.permisson_list()
                    })
                    .catch(error => {
                        this.$config.err_notice(this,error)
                    })
            },
            stop_query(vl) {
                axios.post(`${this.$config.url}/audit/query/undo`, {'WorkId': vl.WorkId})
                    .then(res => {
                        this.$config.notice(res.data)
                        this.permisson_list()
                    })
                    .catch(err => this.$config.err_notice(this,err))
            },
            queryData() {
                this.find.valve = true
                this.permisson_list()
            },
            queryCancel() {
                this.find = this.$config.clearPicker(this.find)
                this.permisson_list()
            }
        },
        mounted() {
            this.permisson_list()
        }
    }
</script>

<style scoped>

</style>
