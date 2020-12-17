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
import {AxiosResponse} from 'axios'
import {Component, Vue} from "vue-property-decorator";
import {FetchCommonGetApis} from "@/apis/commonApis";
import {Res} from "@/interface";
import {request} from "@/libs/requests";

@Component
export default class board extends Vue {
    md_data = '';
    is_admin = sessionStorage.getItem('user');
    $config: any

    post_board(vl: string) {
        request.post(`${this.$config.url}/manage/board/post`, {
            board: vl
        })
    }

    mounted() {
        FetchCommonGetApis('board', {})
            .then((res: AxiosResponse<Res>) => {
                this.md_data = res.data.payload.board
            })
    }
}
</script>

<style scoped>

</style>
