<template>
    <Collapse v-model="collapse" simple>
        <Panel name="sql" >
            提交的SQL语句
            <div slot="content">
                <RadioGroup v-model="switch_args.is_more" @on-change="fetch_post_sql">
                    <Radio label="10">
                        仅显示10条以内的SQL
                    </Radio>
                    <Radio label="0">
                        显示全部SQL
                    </Radio>
                </RadioGroup>
                <br>
                <br>
                <editor v-model="sqls" :is_read="true"   @init="editorInit"></editor>
            </div>
        </Panel>
        <Panel name="results" v-if="order.status ===1 || order.status ===4">
            执行结果
            <div slot="content">
                <Row>
                    <Col span="24">
                        <Table border :columns="columns" :data="results" class="tabletop"
                               style="background: #5cadff"
                               size="large"></Table>
                        <br>
                        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="10"
                              ref="page"></Page>
                    </Col>
                </Row>
            </div>
        </Panel>
    </Collapse >
</template>

<script lang="ts">

    import {Component, Vue} from "vue-property-decorator";
    import Editor from "../editor.vue";
    import detail_mixins from "../../mixins/detail_mixin";

    @Component({components: {Editor}, mixins: [detail_mixins]})
    export default class collapse extends Vue {
        editorInit() {
            require('brace/mode/mysql');
            require('brace/theme/xcode')
        }
    }
</script>

<style scoped>

</style>