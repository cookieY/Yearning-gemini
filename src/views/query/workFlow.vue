<template>
  <div>
    <Row>
      <Card>
        <div class="step-header-con">
          <h3>{{ stepData.title }}</h3>
          <h5>{{ stepData.describe }}</h5>
        </div>
        <p class="step-content"></p>
        <Row>
          <i-col span="8">
            <Alert type="warning" show-icon>
              注意事项:
              <span slot="desc">
              1.必须填写查询说明
              <br>
              2.根据查询条件预估所需的查询时间
              <br>
              3.所有提交的查询语句均会进行审计记录
              <br>
              4.仅支持查询语句,不可使用非查询语句
              <br>
              5.已限制最大limit数，如自己输入的limit数大于平台配置的最大limit数则以平台配置的Limit数为准
            </span>
            </Alert>
          </i-col>
          <i-col span="12">
            <Form ref="formItem" :model="formItem" :rules="stepRules" :label-width="150">
              <FormItem label="环境:" prop="idc">
                <Select v-model="formItem.idc" @on-change="fetchSource">
                  <Option v-for="i in fetchData.idc" :key="i" :value="i">{{i}}</Option>
                </Select>
              </FormItem>

              <FormItem label="审核人:" prop="assigned">
                <Select v-model="formItem.assigned" filterable>
                  <Option v-for="i in fetchData.assigned" :value="i" :key="i">{{i}}</Option>
                </Select>
              </FormItem>

              <FormItem label="是否需要导出数据:" prop="export" v-if="export_list">
                <RadioGroup v-model="formItem.export">
                  <Radio :label=1>是</Radio>
                  <Radio :label=0>否</Radio>
                </RadioGroup>
              </FormItem>

              <FormItem label="查询说明：" prop="text">
                <Input v-model="formItem.text" type="textarea" :autosize="{minRows: 4,maxRows: 8}"
                       placeholder="请填写查询说明"/>
              </FormItem>
              <FormItem label="">
                <Button @click="handleSubmit" style="width:100px;" type="primary">提交</Button>
              </FormItem>
            </Form>
          </i-col>
        </Row>
        <Steps>
          <Step v-for="item in stepList1" :title="item.title" :content="item.describe" :key="item.title"></Step>
        </Steps>
      </Card>
    </Row>
  </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import fetch_mixins from "@/mixins/fetch_mixin";
    import {Component,Mixins} from "vue-property-decorator";

    @Component({components: {}})
    export default class work_flow extends Mixins(fetch_mixins) {
        $config: any;
        export_list = false;
        stepData = {
            title: 'Yearning SQL查询系统',
            describe: `欢迎你！ ${sessionStorage.getItem('user')}`
        };
        stepList1 = [
            {
                title: '提交',
                describe: '提交查询申请'
            },
            {
                title: '审核',
                describe: '等待审核结果'
            },
            {
                title: '查询',
                describe: '审核完毕，进入查询页面'
            }
        ];
        stepRules = {
            text: [
                {required: true, message: '请填写查询说明', trigger: 'blur'}
            ],
            idc: [{
                required: true,
                message: '环境地址不得为空',
                trigger: 'change'
            }],
            source: [{
                required: true,
                message: '连接名不得为空',
                trigger: 'change'
            }],
            assigned: [{
                required: true,
                message: '审核人不得为空',
                trigger: 'change'
            }]
        };
        item = {};
        formItem:any = {
            text: '',
            idc: '',
            export: 0,
            assigned: '',
            source:''
        };

        fetchSource(idc: string) {
            if (idc) {
                axios.get(`${this.$config.url}/fetch/source/${idc}/query`)
                    .then(res => {
                        if (res.data.x === 'query') {
                            this.fetchData.assigned = res.data.assigned
                        } else {
                            this.$config.notice('非法劫持参数！')
                        }
                    })
                    .catch(error => {
                        this.$config.err_notice(this,error)
                    })
            }
        }

        handleSubmit() {
            let is_validate:any = this.$refs['formItem'];
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    axios.post(`${this.$config.url}/query/refer`, {
                        'idc': this.formItem.idc,
                        'source': this.formItem.source,
                        'export': this.formItem.export,
                        'assigned': this.formItem.assigned,
                        'text': this.formItem.text
                    })
                        .then(() => {
                            this.$router.push({
                                name: 'query_apply'
                            })
                        })
                        .catch(err => {
                        this.$config.err_notice(this,err)
                    })
                }
            })
        }

        fetchQueryStatus() {
            axios.put(`${this.$config.url}/query/status`)
                .then(res => {
                    if (res.data.status === 1) {
                        this.$router.push({
                            name: 'query_page'
                        })
                    } else if (res.data.status === 2) {
                        this.$router.push({
                            name: 'query_apply'
                        })
                    } else {
                        this.fetchIDC();
                        this.export_list = res.data.export;
                    }
                })
        }

        mounted() {
            this.fetchQueryStatus();
        }

    }
</script>

<style lang="less">
  .step {
    &-header-con {
      text-align: center;

      h3 {
        margin: 10px 0;
      }

      h5 {
        margin: 0 0 5px;
      }
    }

    &-content {
      padding: 5px 20px 26px;
      margin-bottom: 20px;
      border-bottom: 1px solid #dbdddf;
    }

    &-form {
      padding-bottom: 10px;
      border-bottom: 1px solid #dbdddf;
      margin-bottom: 20px;
    }
  }
</style>
