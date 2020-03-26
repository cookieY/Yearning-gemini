<template>
  <div>
    <Row>
      <Card>
        <p slot="title">
          <Icon type="md-clipboard"></Icon>
          公告
        </p>
        <template v-if="is_admin === 'admin'">
          <mavon-editor v-model="md_data" :ishljs="true" @save="post_board" :boxShadow="false"/>
        </template>
        <template v-else>
          <mavon-editor v-model="md_data" :ishljs="true" :subfield="false" defaultOpen="preview"
                        :editable="false" :toolbarsFlag="false" :boxShadow="false"/>
        </template>
      </Card>
    </Row>
  </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class board extends Vue {
        md_data = '';
        is_admin = sessionStorage.getItem('user');
        $config: any

        post_board(vl: string) {
            axios.post(`${this.$config.url}/group/board/post`, {
                board: vl
            })
                .then(res => this.$config.notice(res.data))
                .catch(err => this.$config.err_notice(this, err))
        }

        mounted() {
            axios.get(`${this.$config.url}/board`)
                .then(res => {
                    this.md_data = res.data
                })
                .catch(err => this.$config.err_notice(this, err))
        }
    }
</script>

<style scoped>

</style>
