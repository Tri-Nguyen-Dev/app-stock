<template lang="pug">
.order__packing--detail
  .packing__detail--header.border-bottom-1.border-gray-300
    Breadcrumb(:home='homeItem', :model='breadcrumbItem')
  .packing__detail--content.pl-4.pr-4
    .my-3.font-bold.flex.align-items-center
      span.uppercase.ml-1 note detail
    p.uppercase.font-bold(v-if='info.id') note id: {{info.id}}
    span.uppercase.font-bold.p-1(style='background-color: #eaf3eb; color: #16a469; border-radius: 4px;') {{info.status | trimUnderShift}}
  .grid.m-0.p-4(v-if='info.user')
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2' v-if='info.createdAt')
      StockUnit(title="Create time" :value="info.createdAt | dateTimeHour12" icon="icon-calendar")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
      StockUnit(title="Create ID" :value="info.user.displayName" icon="icon-user-octagon")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2'   v-if='info.picId')
      StockUnit(title="PIC ID" :value="info.picId" icon="icon-user-octagon")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2'   v-if='info.approveId')
      StockUnit(title="APPROVER ID" :value="info.approveId" icon="icon-user-octagon")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
      StockUnit(title="Warehouse" :value="info.wareHouse"   v-if='info.wareHouse' icon="icon-warehouse-info")
      StockUnit(title="Warehouse" :value="info.user.wareHouse"  v-if='info.user.wareHouse' icon="icon-warehouse-info")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
      StockUnit(title="Total box" :value="info.totalBox" icon="icon-total-inventory")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class StockTakeNoteInfo extends Vue {

  @Prop() info!: any
  get homeItem() {
    return { label: 'Note list', to: '/stock-take', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Add new note', to: '/stock-take/box/create' }
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
