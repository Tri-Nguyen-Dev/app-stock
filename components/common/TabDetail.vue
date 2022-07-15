<template lang="pug">
  .bg-white.border-round-top.sub-tab(class='col-12 md:col-12 lg:col-4 xl:col-3')
    .border-bottom-1.border-gray-300.flex
      Breadcrumb(:home='homeItem', :model='breadcrumbItem')
    .border-bottom-1.border-gray-300
    .sub-title.px-3
      slot(name="title")
    .sub--scroll.px-3
      slot(name="content")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class TabDetail extends Vue {
  @Prop({ default: null }) noteInfor: any
  @Prop({ default: null }) homeItem: any
  @Prop({ default: null }) breadcrumbItem: any
}

export default TabDetail
</script>
<style lang="sass" scoped>
::v-deep.sub-tab
  height: calc(100vh - 150px)
  overflow: hidden
  display: flex
  flex-direction: column
  @include desktop
    height: calc(100vh - 32px)
    max-width: 23rem
    overflow: hidden

  .sub--scroll
    display: flex
    align-items: center
    flex-direction: column
    flex: 1
    overflow: auto
    @include desktop
      height: calc(100vh - 250px)
      overflow: auto
    @include tablet
      height: calc(100vh - 300px)
      flex-direction: row
      justify-content: center
      align-items: baseline
      overflow: hidden
      
  .p-menuitem-link
    display: flex !important
  .wapprer-note
    width: 100%
    min-height: 72px
    border-radius: 4px
    background-color: $text-color-200
    padding: 12px
  .status-note
    display: flex
    justify-content: space-between
</style>
