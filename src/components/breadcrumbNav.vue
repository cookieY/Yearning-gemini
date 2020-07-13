<template>
  <Breadcrumb>
    <BreadcrumbItem v-for="item in currentPath" :href="item.path" :key="item.name">{{item.title}}
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import module_general from "@/store/modules/general";
  @Component({})
  export default class breadcrumbNav extends Vue{
    currentPath = module_general.currentPath
  }
</script>
