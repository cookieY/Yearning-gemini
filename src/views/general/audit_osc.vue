<template>
  <Modal
          v-model="open"
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
    import {Component, Prop, Vue} from "vue-property-decorator";
    import axios from "axios";

    @Component({components: {}})
    export default class audit_osc extends Vue {
        $config: any;
        osc = {
            percent: 0,
            current: 0
        };
        ws = 0;

        @Prop({
            type: Boolean,
            required: true,
            default: false
        }) public is_open !: boolean;

        get open() {
            return this.is_open
        }

        set open(vl) {
        }

        get work_id() {
            return this.$store.state.osc_id
        }

        oscClose() {
            clearInterval(this.ws);
            this.$emit("cancel")
        }

        oscKill() {
            axios.delete(`${this.$config.url}/audit/fetch_osc/${this.work_id}`)
                .then(res => {
                    this.$config.notice(res.data);
                    this.oscClose()
                })
                .catch(err => {
                    this.$config.err_notice(this,err);
                    this.oscClose()
                })
        }

        openOSC() {
            if (this.open) {
                axios.get(`${this.$config.url}/audit/fetch_osc/${this.work_id}`)
                    .then(res => {
                        this.osc.percent = res.data.p;
                        this.osc.current = res.data.s;
                    })
                    .catch(err => this.$config.err_notice(this,err))
            }
        }

        mounted() {
            let vm = this;
            this.ws = setInterval(function () {
                vm.openOSC()
            }, 3000)
        }
    }
</script>

<style scoped>

</style>
