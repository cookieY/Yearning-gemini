<template>
    <div>
        <Modal v-model="is_open" :ok-text="'提交工单'" width="800" @on-ok="referOrder" @on-cancel="cancel" >
            <Divider plain orientation="left">基本信息</Divider>
            <Row type="flex" justify="end" align="bottom">
                <Col span="12" class="cell">
                    <div class="title">用户名: {{ order.username }}</div>
                    <br>
                    <div class="title">环境: {{ order.idc }}</div>
                    <br>
                    <div class="title">定时执行: {{ order.delay }}</div>
                    <br>
                </Col>
                <Col span="12" class="cell">
                    <div class="title">连接名: {{ order.source }}</div>
                    <br>
                    <div class="title">数据库库名: {{ order.data_base }}</div>
                    <br>
                </Col>
            </Row>
            <template  v-if="this.order.status === 0">
                <Divider plain orientation="left">重新提交的语句</Divider>
                <Input v-model="sqls"

                       type="textarea" :rows="5"></Input>
            </template>

            <template v-if="this.order.status ===1 || this.order.status === 4">
                <Divider plain orientation="left">回滚语句</Divider>
                <Table :columns="roll_column" :data="roll_data"
                       height="200" :show-header="false" size="small"
                       no-data-text="该工单没有生成回滚语句! 请检查提交工单时是否已选择备份/数据库设置是否正确。<br/>详细情况请访问:https://guide.yearning.io/attention.html"></Table>
                <br>
                <Page :total="page_number" show-elevator @on-change="rollback" :page-size="5"
                      :current.sync="current"></Page>
            </template>
            <Divider plain orientation="left">提交信息</Divider>
            <Form>
                <FormItem label="工单提交说明:">
                    <Input v-model="order.text" placeholder="最多不超过20个字" style="width: 600px" type="textarea" :rows="3"></Input>
                </FormItem>
                <FormItem label="是否备份">
                    <RadioGroup v-model="order.backup">
                        <Radio :label=1>是</Radio>
                        <Radio :label=0>否</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script lang="ts">
import {Component, Mixins, Prop, Watch} from "vue-property-decorator";
import OrderProfileMixins from "@/mixins/orderProfile";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import {FetchCommonGetApis, FetchCommonPostApis} from "@/apis/commonApis";

@Component({components: {}})
export default class postForm extends Mixins(OrderProfileMixins) {

    @Prop({
        type: Boolean,
        required: true,
        default: false
    }) public value !: boolean;

    @Watch('value')
    get_visible(vl: boolean) {
        if (vl && this.order.backup === 1) {
            this.rollback()
        }
        this.is_open = vl
    }

    roll_data: { sql: string }[] = [];

    roll_column = [
        // {
        //     type: 'expand',
        //     width: 50,
        //     render: render.expand
        // },
        {
            title: '当前检查的sql',
            key: 'sql',
            // render: render.sub_sql
            tooltip: true

        },
    ];

    cancel() {
        this.is_open = false;
        this.current = 1;
        this.$emit('input', false);
    }

    referOrder() {
        let order = Object.assign({} as any, this.order)
        FetchCommonPostApis("roll_order", {
            data: order,
            sqls: this.sqls,
            tp: this.order.status
        })
            .then(() => {
                this.$router.go(-1)
            })
    }

    rollback(vl = 1) {
        FetchCommonGetApis('roll', {work_id: this.order.work_id, page: vl})
            .then((res: AxiosResponse<Res>) => {
                this.roll_data = res.data.payload.sql;
                this.page_number = res.data.payload.count
            })
    }
}
</script>

<style scoped>
.cell {
    display: table-cell;
    padding-bottom: 16px;
    line-height: 20px;
    padding-left: 16px;
    padding-right: 16px;
}

.title {
    font-size: 13px;
    color: #515a6e;
    white-space: nowrap;
    font-weight: bolder;
}
</style>