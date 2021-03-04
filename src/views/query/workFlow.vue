<template>
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
                <Form ref="formItem" :model="sql_order" :rules="stepRules" :label-width="150">
                    <FormItem label="环境:" prop="idc">
                        <Select v-model="sql_order.idc" @on-change="fetchDiffSource">
                            <Option v-for="i in fetchData.idc" :key="i" :value="i">{{ i }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="审核人:" prop="assigned">
                        <Select v-model="sql_order.assigned" filterable>
                            <Option v-for="i in fetchData.assigned" :value="i" :key="i">{{ i }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="是否需要导出数据:" prop="export" v-if="export_list">
                        <RadioGroup v-model="sql_order.export">
                            <Radio :label=1>是</Radio>
                            <Radio :label=0>否</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="查询说明：" prop="text">
                        <Input v-model="sql_order.text" type="textarea" :autosize="{minRows: 4,maxRows: 8}"
                               placeholder="请填写查询说明"/>
                    </FormItem>
                    <FormItem label="">
                        <Button @click="handleSubmit" style="width:100px;" type="primary">提交</Button>
                    </FormItem>
                </Form>
            </i-col>
        </Row>
        <Steps>
            <Step v-for="item in stepList1" :title="item.title" :content="item.describe"
                  :key="item.title"></Step>
        </Steps>
    </Card>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import modules_order from "@/store/modules/order";
import QueryMixin from "@/mixins/query";
import {CommonPostApis, CommonPutApis} from "@/apis/queryApis";

@Component({components: {}})
export default class work_flow extends Mixins(QueryMixin) {
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

    fetchDiffSource(idc: string) {
        this.fetchSource(idc, 'query')
    }


    handleSubmit() {
        let is_validate: any = this.$refs['formItem'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                CommonPostApis('refer', this.sql_order)
                    .then(() => {
                        this.$router.push({name: 'query_apply'})
                    })
            }
        })
    }

    mounted() {
        modules_order.clear_sql_order()
        this.query_state();
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
