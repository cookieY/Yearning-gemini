<template>
    <div>
        <Card>
            <Row>
                <Col span="23">
                    <Button type="text" icon="md-add-circle" @click="openModel">打开数据源</Button>
                    <Button type="text" icon="md-copy" @click="open_snip" class="margin-left-10">新建snippet</Button>
                    <Tabs type="card" name="source" @on-tab-remove="handleTabRemove" :value="focus">
                        <template v-for="(i,idx) in sourceList">
                            <TabPane :name="i" :label="i" tab="source" :key="i" v-if="idx===0">
                                <query_sql :source="i"></query_sql>
                            </TabPane>
                            <TabPane :name="i" :label="i" tab="source" :key="i" v-else closable>
                                <query_sql :source="i"></query_sql>
                            </TabPane>
                        </template>
                    </Tabs>
                </Col>
            </Row>
        </Card>
        <Modal v-model="openSource" title="数据源列表" :z-index="9999">
            <CellGroup @on-click="choiceSource">
                <Cell v-for="i in fetchData.source" :title="i" :name="i" :key="i" />
            </CellGroup>
            <div slot="footer">
                <Button type="error" @click="deferReply">结束查询</Button>
            </div>
        </Modal>

        <Modal v-model="openSnippet" title="新建Snippet" @on-ok="add_snip">
            <Form>
                <FormItem label="Snippet标签名"><Input v-model="addSnippet.title"></Input></FormItem>
                <FormItem label="Snippet"><Input v-model="addSnippet.text" type="textarea" :rows="4"></Input></FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script lang="ts">
    import query_sql from "@/views/query/querySql.vue";
    import {Component, Mixins} from "vue-property-decorator";
    import module_general from "@/store/modules/general";
    import att_mixins from "@/mixins/basic";

    @Component({components: {query_sql}})
    export default class multiSource extends Mixins(att_mixins) {
        focus = '';
        addSnippet = {
            title: '',
            text: ''
        };
        openSnippet = false;
        openSource = false;
        idc = '';
        fetchData = {
            source: []
        };
        sourceList = [] as any;

        deferReply() {
            this.$http.delete(`${this.$config.url}/query/undo`)
                .then((res: { data: string; }) => this.$config.notice(res.data))
                .catch((err: any) => this.$config.err_notice(this, err))
                .finally(() => this.$router.push({name: 'query'}))
        }

        add_snip() {
            module_general.snippetTag(this.addSnippet)
        }

        open_snip() {
            this.openSnippet = true
        }

        handleTabRemove(name: any) {
            let idx = this.sourceList.indexOf(name);
            this.sourceList.splice(idx, 1);
        }

        openModel() {
            this.openSource = true;
            this.fetchSource()

        }

        choiceSource(vl: string) {
            for (let i of this.sourceList) {
                if (i === vl) {
                    this.$Message.warning('不可重复打开相同数据源！');
                    return
                }
            }
            this.sourceList.push(vl);
            this.openSource = false;
            this.focus = vl
        }

        fetchSource() {
            this.$http.get(`${this.$config.url}/fetch/source?idc=${this.idc}&xxx=query`)
                .then((res: { data: { x: string; source: never[]; }; }) => {
                    if (res.data.x === 'query') {
                        this.fetchData.source = res.data.source;
                    } else {
                        this.$config.notice('非法劫持参数！')
                    }
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }

        mounted() {
            this.$http.put(`${this.$config.url}/query/status`)
                .then((res: { data: { status: number; idc: string; }; }) => {
                    if (res.data.status !== 1) {
                        this.$router.push({name: 'query'});
                    } else {
                        this.idc = res.data.idc;
                        this.openModel()
                    }

                })
                .catch((err: any) => this.$config.err_notice(this, err))
        }
    }
</script>

<style scoped>

</style>
