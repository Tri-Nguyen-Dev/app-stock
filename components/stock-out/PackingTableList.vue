<template lang="pug">
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
  Column(field='imageUrl' header='IMAGE' :styles="{'width': '1%'}" headerClass="grid-header-center")
    template(#body='{ data }')
      .overflow-hidden.grid-cell-center
        img.h-2rem.w-2rem.border-round(
          :src="data.imagePath | getThumbnailUrl" alt='' width='100%' style="object-fit: cover;")
  Column(header='BARCODE' field='barCode' :sortable="true" sortField="_barCode" headerClass="grid-header-right" :styles="{'width': '10%'}")
    template(#body='{ data }')
      .grid-cell-right {{ data.barCode }}
  Column(header='SKU' field='sku' :sortable="true" sortField="_sku" headerClass="grid-header-right" :styles="{'width': '5%'}")
    template(#body='{ data }')
      .grid-cell-right {{ data.sku }}
  Column(header='STOCK NAME' field='name' :sortable="true" sortField="_name")
    template(#body='{ data }')
      .text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
  Column(header='TAG' field='tag' :sortable="true" sortField="_tag")
  Column(header='ORIGINAL BOX' field='originalBox' :sortable="true" sortField="_originalBox" :styles="{'width': '5%'}")
  Column(header='QUANTITY' field='quantity' :sortable="true" sortField="_quantity" :styles="{'width': '1%'}")
  Column(header='OUTGOING QUANTITY' field='outGoingQuantity' :sortable="true" sortField="_outGoingQuantity" :styles="{'width': '1%'}")
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingTableList extends Vue {
  originalList: {} = {}
}

export default PackingTableList
</script>
<style lang="sass">

</style>
