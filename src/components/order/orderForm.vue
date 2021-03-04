<template>
    <div>
        <Row type="flex" justify="center" align="middle">
            <Col span="10">
                <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="100" id="fontsize">
                    <FormItem label="工单类型:" required>
                        <Select v-model="formItem.tp" @on-change="changedTp">
                            <Option :value="0" label="DDL"></Option>
                            <Option :value="1" label="DML"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="环境:" prop="idc">
                        <Select v-model="formItem.idc" @on-change="fetchDiffSource">
                            <Option v-for="i in fetchData.idc" :key="i" :value="i">{{ i }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="连接名:" prop="source">
                        <Select v-model="formItem.source" @on-change="fetchBase" filterable>
                            <Option
                                v-for="i in fetchData.source"
                                :value="i"
                                :key="i"
                                :label="i"
                            ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="库名:" prop="data_base">
                        <Select v-model="formItem.data_base" placeholder="请选择" filterable>
                            <Option v-for="item in fetchData.base" :value="item" :key="item" :label="item"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="工单说明:" prop="text">
                        <Input v-model="formItem.text" placeholder="请输入" type="textarea" :rows=4 maxlength="100"
                               show-word-limit></Input>
                    </FormItem>
                    <FormItem label="审核人:" prop="assigned" required>
                        <Select v-model="formItem.assigned" filterable>
                            <Option v-for="i in fetchData.assigned" :value="i" :key="i">{{ i }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="定时执行">
                        <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择时间点"
                                    :options="invalidDate"
                                    @on-change="getDate"
                                    :editable="false"></DatePicker>
                    </FormItem>
                    <FormItem label="是否备份" prop="backup">
                        <RadioGroup v-model="formItem.backup">
                            <Radio :label=1>是</Radio>
                            <Radio :label=0>否</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem>
                        <Button
                            type="error"
                            icon="md-trash"
                            @click.native="clearForm()"
                        >重置
                        </Button>
                        <Button type="primary" icon="md-arrow-round-forward" @click.native="nextStep()"
                                style="margin-left: 10%">下一步
                        </Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
    </div>

</template>

<script lang="ts">
import {Mixins, Component} from "vue-property-decorator";
import fetch_mixin from "@/mixins/fetch";
import modules_order from "@/store/modules/order";


@Component({})
export default class order_form extends Mixins(fetch_mixin) {

    jwt = sessionStorage.getItem('jwt')

    clearForm() {
        modules_order.clear_order()
    }

    nextStep() {
        let is_validate: any = this.$refs['formItem'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                modules_order.changed_always({one: false, two: true, three: false})
                modules_order.changed_step(1)
            } else {
                this.$Message.warning("请填写必选项信息!")
            }
        })
    }

    changedTp(vl: number) {
        modules_order.changed_is_dml(vl === 1)
    }

    mounted() {
        modules_order.clear_order()
        this.fetchIDC();
    }
}
</script>

<style lang="less" scoped>
.div-a {
    position: absolute;
    z-index: 1000;
    width: 100%;
}

#fontsize .ivu-form-item-label {
    font-size: 13px;
    font-weight: bold;
}
</style>>
