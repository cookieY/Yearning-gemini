<template>
    <div>
        <Form :model="item" :rules="rule" ref="ruleForm" :label-width="labelWidth">
            <template v-for="(value,key) in item">
                <FormItem :key="key" :label="labelValue[key].name" v-if="labelValue[key]" :prop="key">
                    <slot v-bind="{value,key}" :name="key">
                        <template  v-if="labelValue[key].el === 'tag'">
                            <Tag :color="labelValue[key].color" v-for="i in item[key]" :key="i"> {{ i }}</Tag>
                        </template>
                        <Input v-model="item[key]" :type="labelValue[key].type"
                               :password="labelValue[key].type" v-else></Input>
                    </slot>
                </FormItem>
            </template>
        </Form>
    </div>

</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

interface LabelElement {
    name: string;
    type?: string;
    color?: string;
    el?: string;
}

interface ItemElement<T> {
    [propName: string]: T
}

export interface Label {
    [propName: string]: LabelElement
}

@Component({components: {}})
export default class CustomForm extends Vue {
    @Prop({
        required: true,
        type: Object,
        default: () => ({})
    }) labelValue !: Label

    @Prop({
        required: true,
        type: Object,
        default: () => ({})
    }) item !: ItemElement<string>[]

    @Prop({
        required: false,
        type: Object,
        default: () => ({})
    }) rule !: object

    @Prop({
        required: false,
        type: Number,
        default: 80
    }) labelWidth !: number
}
</script>

<style scoped>

</style>