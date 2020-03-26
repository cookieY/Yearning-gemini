<style lang="less">
  @import "../../styles/common.less";
  @import "../../styles/table.less";
</style>
<template>
  <div>
    <Row>
      <Card>
        <p slot="title">
          <Icon type="md-person"></Icon>
          查询审计
        </p>
        <Row>
          <Col span="24">
            <Form inline>
              <FormItem>
                <Input placeholder="工单编号" v-model="find.text"></Input>
              </FormItem>
              <FormItem>
                <DatePicker format="yyyy-MM-dd HH:mm" type="datetimerange" placeholder="请选择查询的时间范围"
                            v-model="find.picker" @on-change="find.picker=$event" style="width: 250px"
                            :editable="false"></DatePicker>
              </FormItem>
              <FormItem>
                <Button type="success" @click="queryData">查询</Button>
                <Button type="primary" @click="queryCancel" class="margin-left-10">重置</Button>
                <Button type="warning" @click="query_empty" class="margin-left-10">删除空查询记录</Button>
              </FormItem>
            </Form>
            <Table border :columns="columns" :data="table_data" stripe size="small">
              <template slot-scope="{ row }" slot="action">
                <Button type="text" size="small" @click="open_detail(row)">详细信息</Button>
              </template>
            </Table>
          </Col>
        </Row>
        <br>
        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="20"></Page>
      </Card>
    </Row>
  </div>
</template>
<script lang="ts">
    import axios from 'axios';
    import {Component, Mixins} from "vue-property-decorator";
    import att_mixins from "@/mixins/att";

    @Component({components: {}})
    export default class query_record extends Mixins(att_mixins) {
        columns = [
            {
                title: '工单编号:',
                key: 'WorkId',
                sortable: true
            },
            {
                title: '查询人',
                key: 'Username'
            },
            {
                title: '查询人姓名',
                key: 'Realname'
            },
            {
                title: '工单说明',
                key: 'Text'
            },
            {
                title: '提交时间:',
                key: 'Date',
                sortable: true
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                slot: 'action'
            }
        ];
        table_data = [];

        open_detail(row: { WorkId: string, Username: string }) {
            this.$router.push({
                name: 'query_review',
                query: {
                    workid: row.WorkId,
                    user: row.Username
                }
            });
        }

        query_empty() {
            axios.delete(`${this.$config.url}/audit/query/empty`)
                .then(res => {
                    this.$config.notice(res.data);
                    this.current_page()
                })
                .catch(err => this.$config.err_notice(this, err))
        }

        current_page(vl = 1) {
            axios.put(`${this.$config.url}/audit/query/fetch/record`, {
                page: vl,
                find: this.find
            })
                .then(res => {
                    [this.table_data, this.page_number] = [res.data.data, res.data.page];
                })
                .catch(error => {
                    this.$config.err_notice(this, error);
                });
        }

        queryData() {
            this.find.valve = true;
            this.current_page()
        }

        queryCancel() {
            this.find = this.$config.clearPicker(this.find);
            this.current_page()
        }

        mounted() {
            this.current_page();
        }
    }
</script>
