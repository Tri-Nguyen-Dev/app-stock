<template lang="pug">
.order__packing--detail
  .packing__detail--header.border-bottom-1.border-gray-300
    Breadcrumb(:home='homeItem', :model='breadcrumbItem')
  .packing__detail--content.p-4
    .my-3.font-bold.flex.align-items-center
      .icon.icon-info.inline-block
      span.uppercase.ml-1 note detail
    span.uppercase.font-bold.pl-1.mr-1(style='background-color: #00A469; color: #FFFFFF') new &nbsp;
  .grid.m-0.p-4
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
      StockUnit(title="Create ID" :value="'Test'" icon="icon-dollar-square-2")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
      StockUnit(title="Warehouse" :value="'Test'" icon="icon-warehouse-info")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
      StockUnit(title="Total box" :value="100" icon="icon-total-inventory")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class StockTakeNoteInfo extends Vue {
  @Prop() info!: any
  get homeItem() {
    return { label: '', to: '/', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      { label: '', to: '/', icon: 'pi pi-info-circle' },
      { label: '', to: '/', icon: 'pi pi-list' }
    ]
  }

}

export default StockTakeNoteInfo
</script>
<style lang="sass" scoped>
::v-deep.order__packing--detail
  .p-breadcrumb
    .p-menuitem-link
      display: flex
      align-items: center
      .p-menuitem-icon
        display: block !important
        height: 100%
      .p-menuitem-text
        margin-left: 4px
  .packing__detail--content
    .p-tabview .p-tabview-nav li
      .p-tabview-nav-link
        background: #fff
        border: none
        box-shadow: none !important

    .p-tabview .p-tabview-panels
      background: #fff
      padding: 1.25rem 0 0 0

    .p-highlight .p-tabview-nav-link
      color: #000 !important
      border-bottom: 2px solid #486AE2 !important
</style>
