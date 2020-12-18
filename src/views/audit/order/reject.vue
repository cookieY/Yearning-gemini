<template>
    <Modal v-model="is_open" @on-ok="rejectText" @on-cancel="cancel">
        <p slot="header" style="color:#f60;font-size: 16px">
            <Icon type="information-circled"></Icon>
            <span>SQL工单驳回理由说明</span>
        </p>
        <Input v-model="reject" type="textarea" :autosize="{minRows: 15,maxRows: 15}"
               placeholder="请填写驳回说明"></Input>
    </Modal>
</template>

<script lang="ts">
    import {Component, Mixins, Prop, Watch} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";
    import module_init_args from "@/store/modules/init_args";
    import {AuditStateSQL} from "@/apis/auditApis";

    @Component({components: {}})
    export default class reject extends Mixins(att_mixins) {

        private reject = '';

        @Prop({
            type: Boolean,
            required: true,
            default: false
        }) public value !: boolean;

        @Watch('value')
        get_visible(vl: boolean) {
            this.is_open = vl
        }

        get order() {
            return module_init_args.order_item
        }

        rejectText() {
            AuditStateSQL({work_id:this.order.work_id as string,text:this.reject,tp:'reject'})
                .then(() => {
                    this.$router.go(-1)
                })

        }

        cancel() {
            this.$emit("input", false)
        }
    }
</script>

<style scoped>

</style>
