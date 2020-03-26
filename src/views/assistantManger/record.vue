<template>
  <div>
    <Row>
      <Card>
        <p slot="title">
          <Icon type="md-send"></Icon>
          历史工单执行记录
        </p>
        <Form inline ref="queryForm">
          <FormItem>
            <Input placeholder="工单编号" v-model="find.text" @on-keyup.enter="queryData"></Input>
          </FormItem>
          <FormItem>
            <DatePicker format="yyyy-MM-dd HH:mm" type="datetimerange" placeholder="请选择查询的时间范围"
                        v-model="find.picker" @on-change="find.picker=$event" style="width: 250px"
                        :editable="false"></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="success" @click="queryData">查询</Button>
            <Button type="primary" @click="queryCancel" class="margin-left-10">重置</Button>
          </FormItem>
        </Form>
        <Row>
          <Col span="24">
            <Table
                    border
                    :columns="tab_columns"
                    :data="dataInfo"
                    class="tabletop"
                    style="background: #5cadff"
            >
              <template slot-scope="{ row }" slot="action">
                <div>
                  <Button type="success" @click="openOrder(row)" size="small" ghost>
                    详细信息
                  </Button>
                </div>
              </template>
            </Table>
            <br>
            <Page
                    :total="this.page_number"
                    show-elevator
                    @on-change="currentPage"
                    :page-size="20"
                    :current.sync="current"
            ></Page>
          </Col>
        </Row>
      </Card>
    </Row>
  </div>
</template>
<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import record_mixins from "@/mixins/record_mixin"

    @Component({components: {}, mixins: [record_mixins]})
    export default class record extends Vue {
    }
</script>

<style lang="less">
  @import "../../styles/common.less";
  @import "../../styles/table.less";
</style>
