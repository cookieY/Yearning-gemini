<template>
  <Modal v-model="open" @on-ok="rejectText" @on-cancel="cancel">
    <p slot="header" style="color:#f60;font-size: 16px">
      <Icon type="information-circled"></Icon>
      <span>SQL工单驳回理由说明</span>
    </p>
    <Input v-model="reject" type="textarea" :autosize="{minRows: 15,maxRows: 15}"
           placeholder="请填写驳回说明"></Input>
  </Modal>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";
    import axios from "axios"
    @Component({components: {}})
    export default class audit_reject extends Vue {
        reject = '';
        $config: any;
        @Prop({
            type: Boolean,
            required: true,
            default: false
        }) public is_open !: boolean;
        get open () {
            return this.is_open
        }
        set open (vl) {}

        get formItem() {
            return this.$store.state.order_item;
        }

        rejectText() {
            axios.post(`${this.$config.url}/audit/reject`, {
                'text': this.reject,
                'work': this.formItem.WorkId
            })
                .then(res => {
                    this.$config.notice(res.data);
                    this.$emit("post")
                })
                .catch(error => {
                    this.$config.err_notice(this,error)
                })
        }

        cancel() {
            this.$emit("cancel")
        }
    }
</script>

<style scoped>

</style>
