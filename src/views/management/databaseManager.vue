<style lang="less">
  @import '../../styles/common.less';
  @import '../../styles/table.less';
</style>
<template>
  <div>
    <Col span="5">
      <Card>
        <p slot="title">
          <Icon type="md-refresh"/>
          添加数据库
        </p>
        <div class="edittable-testauto-con">
          <Form ref="formValidate" :model="formItem" :label-width="100" :rules="ruleInline">
            <Form-item label="环境:" prop="add">
              <Select v-model="formItem.add">
                <Option v-for="list in comList" :value="list" :key="list">{{ list }}</Option>
              </Select>
            </Form-item>
            <Form-item label="连接名称:" prop="name">
              <Input v-model="formItem.name" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="数据库地址:" prop="ip">
              <Input v-model="formItem.ip" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="端口:" prop="port">
              <Input v-model="formItem.port" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="用户名:" prop="username">
              <Input v-model="formItem.username" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="密码:" prop="password">
              <Input v-model="formItem.password" placeholder="请输入" type="password"></Input>
            </Form-item>
            <Form-item label="数据源类型:">
              <RadioGroup v-model="formItem.isquery">
                <Radio :label="2">读写</Radio>
                <Radio :label="1">读</Radio>
                <Radio :label="0">写</Radio>
              </RadioGroup>
            </Form-item>
            <Button type="info" @click="testConnection()">测试连接</Button>
            <Button type="success" @click="addConnection()" style="margin-left: 5%">确定</Button>
            <Button type="warning" @click="resetForm()" style="margin-left: 5%">重置</Button>
          </Form>
        </div>
      </Card>
    </Col>
    <Col span="19" class="padding-left-10">
      <Card>
        <p slot="title">
          <Icon type="md-apps"/>
          数据库详情表
        </p>
        <Input v-model="query.connection_name" placeholder="请填写连接名" style="width: 15%" clearable></Input>
        <Select v-model="query.computer_room" placeholder="请填写环境" style="width: 15%" class="margin-left-10">
          <Option v-for="list in comList" :value="list" :key="list">{{ list }}</Option>
        </Select>
        <Button @click="queryData" type="primary" class="margin-left-10">查询</Button>
        <Button @click="queryCancel" type="warning" class="margin-left-10">重置</Button>
        <div class="edittable-con-1">
          <Table :columns="columns" :data="table_data">
            <template slot-scope="{ row }" slot="is_query">
              <Tag checkable color="primary" v-if="row.IsQuery === 0">写</Tag>
              <Tag checkable color="success" v-if="row.IsQuery === 1">读</Tag>
              <Tag checkable color="warning" v-if="row.IsQuery === 2">读写</Tag>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button type="info" size="small" @click="viewConnectionModal(row)" style="margin-right: 5px">详细信息</Button>
              <Poptip
                      confirm
                      title="删除数据源将会删除对应的所有工单信息,确定要删除吗？"
                      @on-ok="delConnection(row)"
                      transfer
              >
                <Button type="warning" size="small">删除</Button>
              </Poptip>
            </template>
          </Table>
        </div>
        <br>
        <Page :total="page_number" show-elevator @on-change="getPageInfo" :page-size="10"
              :current.sync="current"></Page>
      </Card>
    </Col>

    <Modal v-model="is_open" :width="500" okText="保存" @on-ok="modifyBase">
      <h3 slot="header" style="color:#2D8CF0">数据库连接信息</h3>
      <Form :label-width="100" label-position="right">
        <FormItem label="环境">
          <Input v-model="edit_base_info.IDC" readonly></Input>
        </FormItem>
        <FormItem label="连接名称:">
          <Input v-model="edit_base_info.Source" readonly></Input>
        </FormItem>
        <FormItem label="数据库地址:">
          <Input v-model="edit_base_info.IP"></Input>
        </FormItem>
        <FormItem label="端口:">
          <Input v-model="edit_base_info.Port"></Input>
        </FormItem>
        <FormItem label="用户名:">
          <Input v-model="edit_base_info.Username"></Input>
        </FormItem>
        <FormItem label="密码:">
          <Input v-model="edit_base_info.Password" type="password"></Input>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>
<script lang="ts">
    import axios from 'axios'
    import {Mixins, Component} from "vue-property-decorator";
    import att_mixins from "../../mixins/att";

    interface edit_modal {
        IDC: string,
        Source: string,
        IP: string,
        Port: string,
        Username: string,
        Password: string
    }

    const regExp_Name = (rule: any, value: any, callback: any) => {
        let pPattern = new RegExp("[`~!@#$^&*()={}':;',\\[\\]<>/?~！@#￥……&*（）——{}【】‘；：”“'。，、？]");
        if (pPattern.test(value)) {
            callback(new Error('特殊字符仅可使用|与-'))
        } else {
            callback()
        }
    };

    const regExp_password = (rule: any, value: any, callback: any) => {
        let pPattern = new RegExp("[`?？^$]");
        if (pPattern.test(value)) {
            callback(new Error('密码中不得含有? @ ^ $'))
        } else {
            callback()
        }
    };

    @Component
    export default class database_manager extends Mixins(att_mixins) {
        columns = [
            {
                title: '连接名称',
                key: 'Source'
            },
            {
                title: '查询数据源',
                key: 'IsQuery',
                slot: 'is_query'
            },
            {
                title: '数据库地址',
                key: 'IP'
            },
            {
                title: '环境',
                key: 'IDC'
            },
            {
                title: '操作',
                key: 'action',
                width: 300,
                slot: 'action'
            }
        ];
        // 添加表单验证规则
        ruleInline = {
            add: [
                {required: true, message: '请选择对应环境', trigger: 'change'}
            ],
            name: [
                {
                    required: true,
                    message: '请填写连接名称',
                    trigger: 'blur',

                },
                {
                    validator: regExp_Name,
                    trigger: 'blur'
                }
            ],
            ip: [{
                required: true,
                message: '请填写连接地址',
                trigger: 'blur'
            }],
            username: [{
                required: true,
                message: '请填写用户名',
                trigger: 'blur'
            }],
            port: [{
                required: true,
                message: '请填写端口',
                trigger: 'blur'
            }],
            password: [
                {
                    required: true,
                    message: '请填写密码',
                    trigger: 'blur'
                },
                {
                    validator: regExp_password,
                    trigger: 'blur'
                }
            ]
        };
        comList = [];
        edit_base_info = {} as edit_modal;

        resetForm() {
            this.formItem = this.$config.clearObj(this.formItem)
        }

        testConnection() {
            axios.put(`${this.$config.url}/management_db/test`, {
                'ip': this.formItem.ip,
                'user': this.formItem.username,
                'password': this.formItem.password,
                'port': parseInt(this.formItem.port)
            })
                .then(res => {
                    this.$config.notice(res.data)
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                })
        }

        addConnection() {
            let is_validate: any = this.$refs['formValidate'];
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    axios.post(`${this.$config.url}/management_db/add`, {
                        'source': this.formItem.name,
                        'idc': this.formItem.add,
                        'ip': this.formItem.ip,
                        'user': this.formItem.username,
                        'password': this.formItem.password,
                        'port': parseInt(this.formItem.port),
                        'isQuery': this.formItem.isquery
                    })
                        .then(res => {
                            this.$config.notice(res.data);
                            this.getPageInfo(this.current);
                            is_validate.resetFields()
                        })
                        .catch(error => {
                            this.$config.err_notice(this, error)
                        });
                }
            })
        }

        viewConnectionModal(row: edit_modal) {
            this.is_open = true;
            this.edit_base_info = row
        }

        delConnection(vl: { Source: string; }) {
            let step = this.current;
            if (this.table_data.length === 1) {
                step = step - 1
            }
            axios.delete(`${this.$config.url}/management_db/del/${vl.Source}`)
                .then(res => {
                    this.$config.notice(res.data);
                    this.getPageInfo(step)
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                })
        }

        getPageInfo(vl = 1) {
            axios.get(`${this.$config.url}/management_db/fetch/?page=${vl}&con=${JSON.stringify(this.query)}`)
                .then(res => {
                    this.table_data = res.data.data;
                    this.page_number = parseInt(res.data.page);
                    this.comList = res.data.custom;
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                })
        }

        modifyBase() {
            let x = JSON.parse(JSON.stringify(this.edit_base_info));
            x.Port = parseInt(x.Port);
            x.IsQuery = 0;
            axios.put(`${this.$config.url}/management_db/edit`, {
                'data': x
            })
                .then(res => this.$config.notice(res.data))
                .catch(err => this.$config.err_notice(this, err))
        }

        queryData() {
            this.query.valve = true;
            this.getPageInfo()
        }

        queryCancel() {
            this.$config.clearObj(this.formItem);
            this.getPageInfo()
        }

        mounted() {
            this.getPageInfo()
        }
    }
</script>

<style>
  @import '../../styles/tablesmargintop.css';
</style>
