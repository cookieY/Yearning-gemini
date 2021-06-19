<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="md-clipboard"></Icon>
                公告
            </p>
            <template v-if="user === 'admin'">
                <mavon-editor v-model="md_data" :ishljs="true" @save="post_board" :boxShadow="false"/>
            </template>
            <template v-else>
                <mavon-editor v-model="md_data" :ishljs="true" :subfield="false" defaultOpen="preview"
                              :editable="false" :toolbarsFlag="false" :boxShadow="false" style="z-index: 1"/>
            </template>
        </Card>
    </div>
</template>

<script lang="ts">
import {AxiosResponse} from 'axios'
import {Component, Mixins} from "vue-property-decorator";
import {FetchCommonGetApis} from "@/apis/commonApis";
import {Res} from "@/interface";
import {request} from "@/libs/requests";
import Basic from "@/mixins/basic";

@Component
export default class board extends Mixins(Basic) {
    md_data = '';
    user = sessionStorage.getItem("user")
    post_board(vl: string) {
        request.post(`${this.$config.url}/manage/board/post`, {
            board: vl
        })
    }

    mounted() {
        FetchCommonGetApis('board', {})
            .then((res: AxiosResponse<Res>) => {
                this.md_data = res.data.payload.Board
            })
    }
}
</script>

<style scoped>

</style>
