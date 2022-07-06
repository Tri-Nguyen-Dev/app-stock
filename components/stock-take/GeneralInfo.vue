<template lang="pug">
.bg-white.border-round-top.sub-tab(class='col-12 md:col-12 lg:col-4 xl:col-3')
  .packing__detail--header.border-bottom-1.border-gray-300
    Breadcrumb(:home='homeItem', :model='breadcrumbItem')
  .packing__detail--content.pl-4.pr-4
    .my-3.font-bold.flex.align-items-center
      .icon-box-info.icon.bg-primary.mr-2
      span.uppercase.ml-1 note detail
    p.uppercase.font-bold(v-if='info.id') note id: {{info.id}}
    span.uppercase.font-bold.p-1(style='background-color: #eaf3eb; color: #16a469; border-radius: 4px;') {{info.status | trimUnderShift}}
  .grid.m-0.p-4(v-if='info.user')
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2' v-if='info.createdAt')
      StockUnit(title="Create time" :value="info.createdAt | dateTimeHour24" icon="icon-calendar")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
      StockUnit(title="Creator ID" :value="info.user.displayName" icon="icon-user-octagon")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2'   v-if='info.picId')
      StockUnit(title="PIC ID" :value="info.picId" icon="icon-user-octagon")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2'   v-if='info.approveId')
      StockUnit(title="APPROVER ID" :value="info.approveId" icon="icon-user-octagon")
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
      StockUnit(title="Warehouse" :value="info.wareHouse"   v-if='info.wareHouse' icon="icon-warehouse-info" link='airtag.site')
      StockUnit(title="Warehouse" :value="info.user.wareHouse"  v-if='info.user.wareHouse' icon="icon-warehouse-info" link='airtag.site')
    .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
      StockUnit(title="Total box" :value="info.totalBox" icon="icon-total-inventory")
    slot(name='note')
  //- .grid.ml-4.mr-4
  //-   .icon--large.bg-blue-700(class='icon-note')
  //-   span.font-normal.text-700.text-base.uppercase Note
  //- .grid.wapprer-unit.ml-4.mr-4.mt-2(v-if='boxStockTakeDetail.note')
  //-   .col.flex.flex-column.justify-content-center
  //-     div.font-normal.text-base.uppercase.font-bold Creator:
  //-     Textarea(:value='boxStockTakeDetail.note' disabled rows='2' cols=30)
  //- .grid.wapprer-unit.ml-4.mr-4.mt-2(v-if='boxStockTakeDetail.submitNote')
  //-   .col.flex.flex-column.justify-content-center
  //-     div.font-normal.text-base.uppercase.font-bold PIC:
  //-     Textarea.text-lg(:value='boxStockTakeDetail.submitNote' disabled rows='2' cols=30)
  //- .grid.wapprer-unit.ml-4.mr-4.mt-2
  //-   .col.flex.flex-column.justify-content-center
  //-     div.font-normal.text-base.uppercase.font-bold Approver:
  //-     Textarea.text-lg(:value='stockTakeInfo.note' rows='2' cols=30)
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class StockTakeNoteInfo extends Vue {
  @Prop() info!: any
  @Prop() homeItem!:any
  @Prop() breadcrumbItem!:any
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
::v-deep.sub-tab
  .p-menuitem-link
    display: flex !important
  .wapprer-note
    width: 100%
    min-height: 72px
    border-radius: 4px
    background-color: $text-color-200
    padding: 12px
</style>
