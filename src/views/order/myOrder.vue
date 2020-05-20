<style lang="less">
    @import '../../styles/common.less';
    @import '../../styles/table.less';
</style>
<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="md-person"></Icon>
                    我的工单
                </p>
                <Form inline ref="queryForm">
                    <FormItem>
                        <Input placeholder="工单说明" v-model="find.text" @on-keyup.enter="queryData"></Input>
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
                <Row>
                    <Col span="24">
                        <Table border :columns="columnsName" :data="table_data" stripe size="small">
                            <template slot-scope="{ row }" slot="action">
                                <Button type="success" @click="open_modal(row)" size="small" ghost
                                        class="margin-left-10">
                                    工单信息
                                </Button>
                                <Button type="warning" @click="openOrder(row)" size="small"
                                        v-if="row.Status !== 2 && row.Status !==0"
                                        ghost
                                        class="margin-left-10">
                                    执行信息
                                </Button>
                                <Poptip
                                        confirm
                                        title="确定要撤销工单吗？"
                                        @on-ok="delOrder(row)"
                                        transfer>
                                    <Button type="primary" v-if="row.Status === 2" ghost size="small"
                                            class="margin-left-10">工单撤销
                                    </Button>
                                </Poptip>
                                <Button type="error" v-if="row.Status === 0" size="small" ghost
                                        class="margin-left-10" @click="orderReject(row)">驳回理由
                                </Button>
                            </template>
                        </Table>
                    </Col>
                </Row>
                <br>
                <Page :total="page_number" show-elevator @on-change="currentpage" :page-size="20"
                      :current.sync="current"></Page>
            </Card>
        </Row>

        <Modal v-model="openModal" width="1000">
            <p slot="header" style="color:#f60;font-size: 16px">
                <Icon type="information-circled"></Icon>
                <span>SQL工单详细信息</span>
            </p>
            <Form label-position="right">
                <FormItem label="环境:">
                    <span>{{ formItem.IDC }}</span>
                </FormItem>
                <FormItem label="连接名称:">
                    <span>{{ formItem.Source }}</span>
                </FormItem>
                <FormItem label="数据库库名:">
                    <span>{{ formItem.DataBase }}</span>
                </FormItem>
                <FormItem label="数据库表名:">
                    <span>{{ formItem.Table }}</span>
                </FormItem>
                <FormItem label="定时执行:">
                    <span>{{ formItem.Delay }}</span>
                </FormItem>
                <FormItem label="工单说明:">
                    <span>{{ formItem.Text }}</span>
                </FormItem>
                <FormItem>
                    <Table :columns="sql_columns" :data="sql" :max-height="300"></Table>
                </FormItem>
            </Form>
        </Modal>

        <Modal v-model="reject">
            <p slot="header" style="color:#ff0049;font-size: 16px">
                <Icon type="information-circled"></Icon>
                <span>驳回理由</span>
            </p>
            <p style="font-size: 16px">{{reject_text}}</p>
        </Modal>

    </div>
</template>
<script lang="ts">
    import axios from 'axios'
    import {Component, Mixins} from "vue-property-decorator";
    import att_mixins from "@/mixins/att";
    import expandRow from "@/components/expandTable.vue";

    @Component({components: {}})
    export default class my_order extends Mixins(att_mixins) {
        reject = false;
        openModal = false;
        columnsName = [
            {
                title: '工单编号:',
                key: 'WorkId',
                sortable: true
            },
            {
                title: '工单说明',
                key: 'Text',
                tooltip: true
            },
            {
                title: '是否备份',
                key: 'Backup'
            },
            {
                title: '提交时间:',
                key: 'Date',
                sortable: true
            },
            {
                title: '审核/执行人',
                key: 'Assigned',
                sortable: true
            },
            {
                title: '多级审核执行人',
                key: 'Executor',
                sortable: true
            },
            {
                title: '状态',
                key: 'Status',
                render: (h: any, params: { row: { Status: number }; }) => {
                    const row = params.row;
                    let color = '';
                    let text = '';
                    if (row.Status === 2) {
                        color = 'primary';
                        text = '待审核';
                    } else if (row.Status === 0) {
                        color = 'error';
                        text = '驳回';
                    } else if (row.Status === 1) {
                        color = 'success';
                        text = '已执行';
                    } else if (row.Status === 4) {
                        color = 'error';
                        text = '执行失败';
                    } else if (row.Status === 5) {
                        color = 'primary';
                        text = '待执行';
                    } else {
                        color = 'warning';
                        text = '执行中';
                    }

                    return h('Tag', {
                        props: {
                            type: 'dot',
                            color: color
                        }
                    }, text)
                },
                sortable: true
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                slot: 'action',
                width: 250
            }
        ];
        reject_text = '';
        table_data = [] as any;
        multi = false;
        sql = [];
        sql_columns = [
            {
                type: 'expand',
                width: 50,
                render: (h: any, params: { row: { SQL: string } }) => {
                    return h(expandRow, {
                        props: {
                            row: params.row.SQL
                        }
                    })
                }
            },
            {
                title: 'sql',
                key: 'SQL'
            }
        ];

        open_modal(vl: any) {
            axios.get(`${this.$config.url}/fetch/sql?k=${vl.WorkId}`)
                .then(res => {
                    this.sql = res.data
                })
                .catch(err => this.$config.err_notice(this, err));
            this.openModal = true;
            this.formItem = vl
        }

        currentpage(vl = 1) {
            axios.put(`${this.$config.url}/user/order`, {
                page: vl,
                find: this.find
            })
                .then(res => {
                    if (!res.data.multi) {
                        for (let i = 0; i < this.columnsName.length; i++) {
                            if (this.columnsName[i].key === 'Executor') {
                                this.columnsName.splice(i, 1)
                            }
                        }
                    }
                    this.table_data = res.data.data;
                    this.table_data.forEach((item: { Backup: string | number; }) => {
                        (item.Backup === 1) ? item.Backup = '是' : item.Backup = '否'
                    });
                    this.page_number = parseInt(res.data.page)
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                })
        }

        queryData() {
            this.find.valve = true;
            this.currentpage()
        }

        queryCancel() {
            this.find = this.$config.clearPicker(this.find);
            this.current = 1;
            this.currentpage()
        }

        openOrder(row: { WorkId: string, Status: string }) {
            this.$router.push({
                name: 'order_detail',
                query: {
                    workid: row.WorkId,
                    status: row.Status.toString()
                }
            })
        }

        orderReject(row: { Rejected: string }) {
            this.reject = true;
            this.reject_text = row.Rejected;
        }

        delOrder(row: { WorkId: string }) {
            axios.get(`${this.$config.url}/fetch/undo?work_id=${row.WorkId}`)
                .then(res => {
                    this.$config.notice(res.data);
                    this.currentpage(this.current)
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                })
        }

        mounted() {
            this.currentpage()
        }
    }
</script>
<!-- remove delete request -->
