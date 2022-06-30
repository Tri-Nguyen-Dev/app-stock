<template lang="pug">
  //- Button(type="button" icon='pi pi-download' class="p-button-outlined p-button-primary bg-white" label='Export file' @click='click') 
  Button(class="p-button-outlined p-button-primary bg-white btn-export" @click='click')
    .icon.icon-download.bg-primary.mr-2
    <span class="ml-2">Export file</span>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class Export extends Vue {
  @Prop() click!: ()=> void
}

export default Export
</script>
<style lang="sass" scoped>
  .btn-export
    justify-content: center
</style>

