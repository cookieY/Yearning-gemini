<template>
  <div>
    <Card>
      <Row>
        <Col span="23">
          <Button type="text" icon="md-add-circle" @click="openModel">打开数据源</Button>
          <Button type="text" icon="md-copy" @click="opensnip" class="margin-left-10">新建snippet</Button>
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
        <Cell v-for="i in fetchData.source" :title="i" :name="i" :key="i"/>
      </CellGroup>
      <div slot="footer">
        <Button type="success" @click="deferReply">结束查询</Button>
      </div>
    </Modal>

    <Modal v-model="openSnippet" title="新建Snippet" @on-ok="addsnip">
      <Form>
        <FormItem label="Snippet标签名"><Input v-model="addSnippet.title"></Input></FormItem>
        <FormItem label="Snippet"><Input v-model="addSnippet.text" type="textarea" :rows="4"></Input></FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script lang="ts">
    import query_sql from "@/views/query/querySql.vue";
    import axios from 'axios'
    import {Component, Vue} from "vue-property-decorator";

    @Component({components: {query_sql}})
    export default class multiSource extends Vue {
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
        $config:any;

        deferReply() {
            axios.delete(`${this.$config.url}/query/undo`)
                .then(res => this.$config.notice(res.data))
                .catch(err => this.$config.err_notice(this, err));
            this.$router.push({
                name: 'query'
            })
        }

        addsnip() {
            if (this.$store.state.snippet === null) {
                this.$store.state.snippet = []
            }
            for (let i of this.$store.state.snippet) {
                if (i.title === this.addSnippet.title) {
                    this.$Message.error('snippet标签名不得重复!');
                    return
                }
            }
            if (this.$store.state.snippet.length > 14) {
                this.$Message.error('snippet最多保存15个!');
                return
            }
            this.$store.commit('snippetTag', this.addSnippet)
            this.$Message.success('snippet已保存!');
        }

        opensnip() {
            this.openSnippet = true
        }

        handleTabRemove(name:any) {
            let idx = this.sourceList.indexOf(name);
            this.sourceList.splice(idx, 1);
        }

        openModel() {
            this.openSource = true;
            this.fetchSource()

        }

        choiceSource(vl:string) {
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
            axios.get(`${this.$config.url}/fetch/source/${this.idc}/query`)
                .then(res => {
                    if (res.data.x === 'query') {
                        this.fetchData.source = res.data.source;
                    } else {
                        this.$config.notice('非法劫持参数！')
                    }
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                })
        }

        mounted() {
            axios.put(`${this.$config.url}/query/status`)
                .then(res => {
                    if (res.data.status !== 1) {
                        this.$router.push({
                            name: 'query'
                        });
                    } else {
                        this.idc = res.data.idc;
                        this.openModel()
                    }

                })
                .catch(err => this.$config.err_notice(this, err))
        }
    }
</script>

<style scoped>

</style>
