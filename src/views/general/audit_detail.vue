<template>
  <Modal v-model="open" width="1000" @on-cancel="cancel">
    <p slot="header" style="color:#f60;font-size: 16px">
      <Icon type="information-circled"></Icon>
      <span>SQL工单详细信息</span>
    </p>
    <Form label-position="right">
      <FormItem label="环境:">
        <span>{{ formItem.IDC }}</span>
      </FormItem>
      <FormItem label="连接名称:">
        <span>{{ formItem.Source }}</span>
      </FormItem>
      <FormItem label="数据库库名:">
        <span>{{ formItem.DataBase }}</span>
      </FormItem>
      <FormItem label="数据库表名:">
        <span>{{ formItem.Table }}</span>
      </FormItem>
      <FormItem label="定时执行:">
        <span>{{ formItem.Delay }}</span>
      </FormItem>
      <FormItem label="工单说明:">
        <span>{{ formItem.Text }}</span>
      </FormItem>
      <FormItem>
        <Table :columns="sql_columns" :data="sql_data" :max-height="300"></Table>
      </FormItem>
      <FormItem label="选择执行人:" v-if="multi && auth === 'admin'" required>
        <Select v-model="multi_name" style="width: 20%">
          <Option v-for="i in multi_list" :value="i.Username" :key="i.Username">{{i.Username}}</Option>
        </Select>
      </FormItem>
    </Form>

    <div slot="footer" >
      <Button type="warning" @click.native="testTo()" :loading="loading">
        <span v-if="!loading">检测sql</span>
        <span v-else>检测中</span>
      </Button>
      <Button type="error" @click="reject()">驳回</Button>
      <template v-if="multi">
        <Button type="success" @click="agreed()" :disabled="summit" v-if="auth === 'admin'">同意</Button>
        <Button type="success" @click="perform()" :disabled="summit" v-if="auth === 'perform'">执行</Button>
      </template>
      <template v-else>
        <Button type="success" @click="perform()" :disabled="summit" >执行</Button>
      </template>
    </div>
  </Modal>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";
    import axios from "axios";

    @Component({components: {}})
    export default class audit_detail extends Vue {
        auth = sessionStorage.getItem('auth');
        loading = false;
        $config: any;
        summit = true;
        multi_name = '';

        @Prop({
            type: Boolean,
            required: true,
            default: false
        }) public is_open !: boolean;

        @Prop({
            type: Array,
            required: true,
            default: false
        }) public sql_columns !: object;

        @Prop({
            type: Boolean,
            required: true,
            default: false
        }) public multi !: boolean;

        @Prop({
            type: Array,
            required: true,
            default: []
        }) public multi_list !: object;

        get open() {
            return this.is_open
        }

        set open(vl) {

        }

        get formItem() {
            return this.$store.state.order_item;
        }

        get sql_data () {
            return this.$store.state.order_sql;
        }

        set sql_data (vl) {
            this.$store.state.order_sql = vl;
        }

        reject() {
            this.$emit("reject")
        }

        agreed() {
            this.$emit("agreed", this.multi_name, this.formItem.WorkId)
        }

        perform() {
            this.$emit("perform", this.formItem.WorkId)
        }

        cancel() {
            this.$emit("cancel");
            this.summit = true
        }

        testTo() {
            this.loading = true;
            let s = '';
            for (let i of this.sql_data) {
                s += i.SQL
            }
            let isDML = false;
            if (this.formItem.Type === 1) {
                isDML = true
            }
            axios.put(`${this.$config.url}/fetch/test`, {
                'source': this.formItem.Source,
                'database': this.formItem.DataBase,
                'table': this.formItem.Table,
                'sql': s,
                'isDMl': isDML
            })
                .then(res => {
                    this.sql_data = res.data;
                    let gen = 0;
                    this.sql_data.forEach((vl: { Level: number; }) => {
                        if (vl.Level !== 0) {
                            gen += 1
                        }
                    });
                    this.summit = gen !== 0;
                    this.loading = false
                })
                .catch(error => {
                        this.$config.err_notice(this,error)
                    })
        }
    }
</script>

<style scoped>

</style>
