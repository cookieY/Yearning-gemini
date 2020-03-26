<template>
  <div>
    <Row>
      <Card>
        <p slot="title" style="height: 45px">
          <Icon type="android-send"></Icon>
          工单{{ this.$route.query.workid }}详细信息
          <br>
          <Button type="text" v-if="this.$route.query.status === '1'" @click.native="rollback()">查看回滚语句</Button>
          <Button type="text" v-else-if="this.$route.query.status === '0' || this.$route.query.status ==='4'"
                  @click.native="repairOrder()">重新提交
          </Button>
          <Button type="text" @click.native="$router.go(-1)">返回</Button>
        </p>
        <Row>
          <Col span="24">
            <Table border :columns="columns" :data="TableDataNew" class="tabletop"
                   style="background: #5cadff"
                   size="large"></Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="current_page" :page-size="20"
                  ref="page"></Page>
          </Col>
        </Row>
      </Card>
    </Row>
    <BackTop :height="100" :bottom="200">
      <div class="top">返回顶端</div>
    </BackTop>
    <Modal v-model="reload_sql" :ok-text="'提交工单'" width="800" @on-ok="referOrder">

      <div class="step-header-con">
        <h3>Yearning SQL平台审核工单</h3>
      </div>
      <p class="step-content"></p>
      <Form class="step-form">
        <FormItem label="用户名:">
          <p>{{formItem.Username}}</p>
        </FormItem>
        <FormItem label="环境:">
          <p>{{formItem.IDC}}</p>
        </FormItem>
        <FormItem label="连接名:">
          <p>{{formItem.Source}}</p>
        </FormItem>
        <FormItem label="数据库库名:">
          <p>{{formItem.DataBase}}</p>
        </FormItem>
        <FormItem label="定时执行:">
          <p>{{formItem.Delay}}</p>
        </FormItem>
        <FormItem>
          <Input v-model="formItem.SQL"
                 v-if="this.$route.query.status === '0' || this.$route.query.status ==='4'"
                 type="textarea"></Input>
          <Table :columns="rollColumn" :data="rollData" v-if="this.$route.query.status ==='1'"
                 max-height="300"></Table>
        </FormItem>
        <FormItem label="工单提交说明:">
          <Input v-model="formItem.text" placeholder="最多不超过20个字"></Input>
        </FormItem>
        <FormItem label="是否备份">
          <RadioGroup v-model="formItem.Backup">
            <Radio :label=1>是</Radio>
            <Radio :label=0>否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
    import detail_mixins from "../mixins/detail_mixin";
    import {Component, Vue} from "vue-property-decorator";

    @Component({components: {}, mixins: [detail_mixins]})
    export default class my_order_list extends Vue {
    }
</script>

<style lang="less">
  @import '../styles/common.less';
  @import '../styles/table.less';

  .top {
    padding: 10px;
    background: rgba(0, 153, 229, .7);
    color: #fff;
    text-align: center;
    border-radius: 2px;
  }
</style>
