<template lang="pug">
.packing__original--table.bg-white.border-round.w-full
  .packing__original--header.flex
    .title__tab.font-bold.p-3.border-right-1.border-gray-300
      .icon.icon-info.inline-block.mr-2
      span.uppercase original box
    .box__tab.p-3.flex.align-items-center(:class="{'active': active}")
      .icon.icon-box-packing-outline.inline-block.mr-2
      span.uppercase 12258
    .box__tab.p-3.flex.align-items-center
      .icon.icon-box-packing-outline.inline-block.mr-2
      span.uppercase 12258
  .packing__original--content
    DataTable(
      @sort="sortData($event)"
      :class="{ 'table-wrapper-empty': !originalList || originalList.length <= 0 }"
      responsiveLayout="scroll"
      dataKey='id'
      :rowHover='true'
      :value='originalList'
    )
      Column(field='no' header='NO' :styles="{'width': '1%'}" )
        template(#body='{}')
          span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold
      Column(field='imageUrl' header='IMAGE' headerClass="grid-header-center")
        template(#body='{ data }')
          .overflow-hidden.grid-cell-center
            img.h-2rem.w-2rem.border-round(
              :src="data.imagePath | getThumbnailUrl" alt='' width='100%' style="object-fit: cover;")
      Column(header='BARCODE' field='barCode' :sortable="true" sortField="_barCode" headerClass="grid-header-right")
        template(#body='{ data }')
          .grid-cell-right {{ data.barCode }}
      Column(header='SKU' field='sku' :sortable="true" sortField="_sku" headerClass="grid-header-right")
        template(#body='{ data }')
          .grid-cell-right {{ data.sku }}
      Column(header='STOCK NAME' field='name' :sortable="true" sortField="_name")
        template(#body='{ data }')
          .text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
      Column(header='TAG' field='tag' :sortable="true" sortField="_tag")
      Column(header='QUANTITY' field='quantity' :sortable="true" sortField="_quantity")
      Column(header='OUTGOING QUANTITY' field='outGoingQuantity' :sortable="true" sortField="_outGoingQuantity")
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingOriginal extends Vue {
  originalList: {} = {}

  get active() {
  
  }
}

export default PackingOriginal
</script>
<style lang="sass" scoped>
::v-deep.packing__original--table
  .packing__original--content
    border-radius: 4px
    flex: 1
    position: relative
    overflow: hidden
    .p-datatable .p-datatable-thead > tr > th
      background: #fff !important
</style>
