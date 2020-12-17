<template>
    <Modal
            v-model="is_open"
            title="OSC进度展示" :closable="false"
            @on-cancel="oscClose"
            @on-ok="oscKill"
            ok-text="osc终止"
    >
        <Col offset="6">
            <i-circle
                    :size="250"
                    :trail-width="4"
                    :stroke-width="5"
                    :percent="osc.percent"
                    stroke-linecap="square"
                    stroke-color="#43a3fb">
                <div class="demo-Circle-custom">
                    <h1>{{osc.percent}}%</h1>
                    <span>
                当前正在执行第
                <i>{{osc.current}}</i>
              条
            </span>
                </div>
            </i-circle>
        </Col>
    </Modal>
</template>

<script lang="ts">
    import {Component, Prop, Mixins, Watch} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";
    import modules_order from "@/store/modules/order";
    import {request} from "@/libs/requests";
    import {AxiosResponse} from "axios";
    import {Res} from "@/interface";

    @Component({components: {}})
    export default class osc extends Mixins(att_mixins) {
        osc = {
            percent: 0,
            current: 0
        };
        ws = 0;

        @Prop({
            type: Boolean,
            required: true,
            default: false
        }) public value !: boolean;

        @Watch('value')
        get_visible(vl: boolean) {
            if (vl) {
                this.openOSC()
                this.interval()
            }
            this.is_open = vl
        }

        get work_id() {
            return modules_order.osc_id
        }

        oscClose() {
            clearInterval(this.ws);
            this.$emit("input", false)
        }

        oscKill() {
            request.delete(`${this.$config.url}/audit/osc/${this.work_id}`)
                .finally(() => this.oscClose())
        }

        openOSC() {
            request.get(`${this.$config.url}/audit/osc/${this.work_id}`)
                .then((res: AxiosResponse<Res>) => {
                    this.osc.percent = res.data.payload.p;
                    this.osc.current = res.data.payload.s;
                })
        }

        interval() {
            let vm = this;
            this.ws = setInterval(function () {
                vm.openOSC()
            }, 3000)
        }
    }
</script>

<style scoped>

</style>
