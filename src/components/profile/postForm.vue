<template>
    <div>
        <Modal v-model="is_open" :ok-text="'提交工单'" width="800" @on-ok="referOrder" @on-cancel="cancel">
            <div class="step-header-con">
                <h3>Yearning SQL平台审核工单</h3>
            </div>
            <p class="step-content"></p>
            <Form class="step-form">
                <FormItem label="用户名:">
                    <p>{{ order.username }}</p>
                </FormItem>
                <FormItem label="环境:">
                    <p>{{ order.idc }}</p>
                </FormItem>
                <FormItem label="连接名:">
                    <p>{{ order.source }}</p>
                </FormItem>
                <FormItem label="数据库库名:">
                    <p>{{ order.data_base }}</p>
                </FormItem>
                <FormItem label="定时执行:">
                    <p>{{ order.delay }}</p>
                </FormItem>
                <FormItem>
                    <Input v-model="sqls"
                           v-if="this.order.status === 0 || this.order.status ===4"
                           type="textarea"></Input>
                    <template v-if="this.order.status ===1">
                        <Table :columns="roll_column" :data="roll_data"
                               height="300"></Table>
                        <br>
                        <Page :total="page_number" show-elevator @on-change="rollback" :page-size="5"
                              :current.sync="current"></Page>
                    </template>

                </FormItem>
                <FormItem label="工单提交说明:">
                    <Input v-model="order.text" placeholder="最多不超过20个字"></Input>
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
import detail_mixins from "../../mixins/detail_mixin";
import render from "@/interface/render";

@Component({components: {}})
export default class postForm extends Mixins(detail_mixins) {

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
        {
            type: 'expand',
            width: 50,
            render: render.expand
        },
        {
            title: '当前检查的sql',
            key: 'sql',
            render: render.sub_sql

        },
    ];

    cancel() {
        this.is_open = false;
        this.current = 1;
        this.$emit('input', false);
    }

    referOrder() {
        let order = Object.assign({} as any, this.order)
        order.assigned = order.relevant[0]
        this.$http.post(`${this.$config.url}/fetch/roll_order`, {
            'data': order,
            'sqls': this.sqls,
            'tp': this.order.status
        })
            .then(() => {
                this.$router.go(-1)
                this.$config.notice('工单已提交成功')
            })
            .catch((error: any) => {
                this.$config.err_notice(this, error)
            })
    }

    rollback(vl = 1) {
        this.$http.get(`${this.$config.url}/fetch/roll?workid=${this.order.work_id}&page=${vl}`)
            .then((res: { data: { sql: { sql: string; }[]; count: number; }; }) => {
                this.roll_data = res.data.sql;
                this.page_number = res.data.count
            })
            .catch((err: any) => {
                this.$config.err_notice(this, err)
            })
    }
}
</script>

<style scoped>

</style>