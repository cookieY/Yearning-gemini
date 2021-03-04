<template>
    <div>
        <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="check_all_args()">全选
        </Checkbox>
        <CheckboxGroup @on-change="checkSource" v-model="currentSource">
            <Checkbox v-for="i in sourceList" :label="i" :key="i">
                <Tag :color="color"> {{ i }}</Tag>
            </Checkbox>
        </CheckboxGroup>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";

@Component({components: {}})
export default class AllCheck extends Vue {

    @Prop({
        required: true,
        type: Array,
        default: () => {
            return []
        }
    }) public sourceList !: string[]

    @Prop({
        required: false,
        type: String,
        default: 'purple'
    }) public color !: string

    @Prop({
        required: true,
        type: Array,
        default: () => {
            return []
        }
    }) public origin !: string[]

    @Watch('origin')
    get_value(vl: string[]) {
        this.currentSource = vl
        this.checkSource()
    }

    private indeterminate = false;
    private checkAll = false
    private currentSource: string[] = []

    checkSource() {
        this.$emit('onChange', this.currentSource)
        if (this.currentSource.length === this.sourceList.length) {
            this.indeterminate = false;
            this.checkAll = true;
        } else if (this.currentSource.length > 0) {
            this.indeterminate = true;
            this.checkAll = false;
        } else {
            this.indeterminate = false;
            this.checkAll = false;
        }
    }

    check_all_args() {
        this.indeterminate ? this.checkAll = false : this.checkAll = !this.checkAll;
        this.indeterminate = false;
        if (this.checkAll) {
            this.currentSource = this.sourceList
            this.$emit('onChange', this.sourceList)
        } else {
            this.currentSource = [] as string[]
            this.$emit('onChange', [] as string[])
        }
    }
}
</script>

<style scoped>

</style>