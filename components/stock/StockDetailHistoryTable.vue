<template lang="pug">
  DataTable.bg-white.table__sort-icon.w-full.h-full.flex.flex-column(
    v-if="historyLocationList.data"
    :value="historyLocationList.data.items"
    responsiveLayout="scroll"
    dataKey="id"
    :resizableColumns="true"
    :rows="20"
    :scrollable="false"
    @sort="sortData($event)"
  )
    Column(field="no" header="NO" :styles="{'width': '1%'}")
      template(#body="{ index }")
        span.font-semibold {{ (index + 1) + paginate.pageNumber * paginate.pageSize  }}
    Column(field="createdAt" header="TIME" sortable :styles="{'width': '100%'}")
      template(#body="{data}")
        div {{ data.createdAt | dateTimeHour12 }}
    Column(field="originalLocation" header="ORIGINAL LOCATION" sortable)
    Column(field="newLocation" header="NEW LOCATION" sortable)
    Column(field="createdBy" header="ID CREATOR" sortable)
    template(#footer)
      .pagination
        div.pagination__info
          img(:src="require('~/assets/icons/filter-left.svg')")
          span.pagination__total {{ getInfoPaginate }}
        Paginator(:first.sync="firstPage"  :rows="paginate.pageSize" :totalRecords="historyLocationList.data.total" @page="onPage($event)")
    template(#empty)
      div.flex.align-items-center.justify-content-center.flex-column
        img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" )
        p.text-900.font-bold.mt-3 List is empty!
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
const nsStoreStock = namespace('stock/stock-detail')

@Component
class StockDetailHistoryTable extends Vue {
  @nsStoreStock.State
  historyLocationList!: any

  @nsStoreStock.Action
  actGetHistoryLocation!: (params:any) => Promise<void>

  paginate: any = {
    pageNumber: 0,
    pageSize: 10
  }

  get getInfoPaginate() {
    const { pageNumber, pageSize } = this.paginate
    const start = (pageNumber + 1) * pageSize - (pageSize - 1)
    const convertStart = ('0' + start).slice(-2)
    const end = Math.min(start + pageSize - 1, this.historyLocationList.data.total)
    return `Showing ${convertStart} - ${end} of ${this.historyLocationList.data.total}`
  }

  async mounted() {
    await this.actGetHistoryLocation({ stockId: this.$route.params.sid, boxId: this.$route.params.bid })
  }
}

export default StockDetailHistoryTable
</script>
<style lang="sass" scoped></style>
