<template lang="pug">
  CommonTabDetail(:homeItem="homeItem" :breadcrumbItem="breadcrumbItem")
    template(v-slot:title)
      .packing__detail--content
        .my-3.font-bold.flex.align-items-center
          .icon-box-info.icon.bg-primary.mr-2
          span.uppercase.ml-1 note detail
        p.uppercase.font-bold(v-if='info.id') note id: {{info.id}}
        .div.status-note
          span.p-2.table__status.table__status--available {{info.status | trimUnderShift}}
          span.p-2.table__status.table__status--error(
            v-if='info.status === "COMPLETED"') {{ info.finalResultStatus  }}
    template(v-slot:content)
      .grid.m-0.mt-3(v-if='info.user')
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2' v-if='info.createdAt')
          StockUnit(title="Create time" :value="info.createdAt | dateTimeHour24" icon="icon-calendar")
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          StockUnit(title="Creator ID" :value="info.user.displayName|| `${info.user.firstName} ${info.user.lastName}`" icon="icon-user-octagon")
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2'   v-if='info.picId')
          StockUnit(title="PIC ID" :value="info.picId" icon="icon-user-octagon")
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2'   v-if='info.approveId')
          StockUnit(title="APPROVER ID" :value="info.approveId" icon="icon-user-octagon")
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          StockUnit(title="Warehouse" :value="info.wareHouse"   v-if='info.wareHouse' icon="icon-warehouse-info")
          StockUnit(title="Warehouse" :value="info.user.warehouse.name"  v-else icon="icon-warehouse-info")
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          StockUnit(title="Total box" :value="info.totalBox" icon="icon-total-inventory")
        slot(name='note')
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
</style>
