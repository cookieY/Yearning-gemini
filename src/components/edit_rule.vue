<template>
  <Modal v-model="open" :width="800" @on-ok="is_post" :z-index="9999">
    <h3 slot="header" style="color:#2D8CF0">用户权限</h3>
    <Form :label-width="120" label-position="top">
      <FormItem label="用户名">
        <Input v-model="username" readonly></Input>
      </FormItem>
      <FormItem label="权限组" v-show="is_admin">
        <Select v-model="group" @on-change="marge_group" clearable multiple filterable>
          <Option v-for=" i in group_list" :key="i.Name" :value="i.Name" :label="i.Name"></Option>
        </Select>
      </FormItem>
      <template>
        <FormItem label="DDL及索引权限:">
          <Tag v-if="permission.ddl==='1'" color="success">是</Tag>
          <Tag v-else color="volcano">否</Tag>
        </FormItem>
        <template v-if="permission.ddl === '1'">
          <FormItem label="数据源:">
            <Tag color="purple" v-for="i in permission.ddl_source" :key="i"> {{i}}</Tag>
          </FormItem>
        </template>
        <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
        <br>
        <FormItem label="DML权限:">
          <Tag v-if="permission.dml==='1'" color="success">是</Tag>
          <Tag v-else color="volcano">否</Tag>
        </FormItem>
        <template v-if="permission.dml === '1'">
          <FormItem label="数据源:">
            <Tag color="geekblue" v-for="i in permission.dml_source" :key="i"> {{i}}</Tag>
          </FormItem>
        </template>
        <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
        <br>
        <FormItem label="数据查询权限:">
          <Tag v-if="permission.query==='1'" color="success">是</Tag>
          <Tag v-else color="volcano">否</Tag>
        </FormItem>
        <template v-if="permission.query === '1'">
          <FormItem label="数据源:">
            <Tag color="blue" v-for="i in permission.query_source" :key="i"> {{i}}</Tag>
          </FormItem>
        </template>
        <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
        <br>
        <FormItem label="选择上级审核人:">
          <Tag color="cyan" v-for="i in permission.auditor" :key="i"> {{i}}</Tag>
        </FormItem>
      </template>
      <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
      <br>
      <FormItem label="用户管理权限:">
        <Tag v-if="permission.user==='1'" color="success">是</Tag>
        <Tag v-else color="volcano">否</Tag>
      </FormItem>
      <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
      <br>
      <FormItem label="数据库管理权限:">
        <Tag v-if="permission.base==='1'" color="success">是</Tag>
        <Tag v-else color="volcano">否</Tag>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
    import axios from "axios";

    export default {
        name: "edit_rule",
        props: {
            is_open: Boolean,
            username: String,
            is_admin: Boolean,
            group_list: Array,
            group_props: Array
        },
        data() {
            return {
                permission: {
                    ddl: '0',
                    ddl_source: [],
                    dml: '0',
                    dml_source: [],
                    query: '0',
                    query_source: [],
                    user: '0',
                    base: '0',
                    auditor: []
                },
                post_group: []
            }
        },
        computed: {
            open: {
                get() {
                    return this.is_open
                },
                set() {
                    this.$emit("cancel")
                }
            },
            group: {
                get() {
                    return this.group_props
                },
                set(vl) {
                    this.post_group = vl;
                }
            }
        },
        methods: {
            is_post() {
                if (this.is_admin) {
                    axios.post(`${this.$config.url}/group/update`, {
                        'username': this.username,
                        'permission': this.permission,
                        'group': this.post_group,
                    })
                        .then(res => {
                            this.$config.notice(res.data);
                            this.$emit('success');
                        })
                        .catch(error => {
                        this.$config.err_notice(this,error)
                    })
                }
            },
            marge_group(group) {
                let g = [];
                if (group !== null) {
                    g = group
                }
                axios.post(`${this.$config.url}/group/fetch/marge`, {
                    "user": this.username,
                    "group": g,
                })
                    .then(res => {
                        this.permission = res.data;
                    })
                    .catch(err => this.$config.err_notice(this,err))
            }
        }
    }
</script>

<style scoped>

</style>
