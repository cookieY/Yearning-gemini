<template>
  <div>
    <Row>
      <Card>
        <p slot="title">
          <Icon type="ios-crop"/>
          用户权限
        </p>
        <div>
          <Input v-model="query.username" placeholder="请填写用户名" style="width: 15%" clearable
                 class="margin-left-10"></Input>
          <Button @click="queryData" type="success" class="margin-left-10">查询</Button>
          <Button @click="queryCancel" type="warning" class="margin-left-10">重置</Button>
          <br>
          <br>
          <Table border :columns="columns" :data="table_data" stripe height="550">
            <template slot-scope="{ row }" slot="action">
              <Button type="info" size="small" @click="edit_rule(row)" style="margin-right: 5px">
                查看与编辑
              </Button>
            </template>
          </Table>
        </div>
        <br>
        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="10" :current.sync="current"></Page>
      </Card>
    </Row>

    <edit_rule is_admin :is_open="is_open" :username="rule_form.username" :group_list="group_list"
               :group_props="rule_form.group" @cancel="cancel" @success="post_ok"></edit_rule>
  </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import edit_rule from "@/components/edit_rule.vue";
    import {Mixins, Component} from "vue-property-decorator";
    import att_mixins from "../../mixins/att";

    @Component({components: {edit_rule}})
    export default class user_access extends Mixins(att_mixins) {
        columns = [
            {
                title: 'ID',
                key: 'ID',
                width: 85,
                sortable: true
            },
            {
                title: '用户名',
                key: 'Username',
                sortable: true
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                slot: 'action'
            }
        ];
        rule_form = {
            username: '',
            group: []
        };

        edit_rule(vl: { Username: string; Group: never; }) {
            this.rule_form = {
                username: vl.Username,
                group: vl.Group
            };
            this.is_open = true;
        }

        current_page(vl = 1) {
            axios.get(`${this.$config.url}/group?page=${vl}&con=${JSON.stringify(this.query)}`)
                .then(res => {
                    this.table_data = res.data.data;
                    this.group_list = res.data.group_list;
                    this.page_number = parseInt(res.data.page);
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                })
        }

        queryData() {
            this.query.valve = true;
            this.current_page()
        }

        queryCancel() {
            this.$config.clearObj(this.formItem);
            this.current_page()
        }

        cancel() {
            this.is_open = false;
            this.rule_form.group = []
        }

        post_ok() {
            this.current_page(this.current)
        }

        mounted() {
            this.current_page()
        }
    }
</script>

<style scoped lang="less">
  @import '../../styles/common.less';
</style>
