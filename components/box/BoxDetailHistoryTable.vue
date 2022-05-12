<template lang="pug">
DataTable.w-full.table__sort-icon.h-full.flex.flex-column(
  responsiveLayout="scroll"
  :value='locationHistory'  
  dataKey="id"
  :resizableColumns="true"
  :paginator="false" 
  :rows="20"
  )
  Column(field="no" header="NO" sortable)
    template(#body='slotProps')
      span.font-bold  {{ (pageNumber - 1) * pageSize + slotProps.index +1 }}
  Column(field="createdAt" header="TIME" sortable bodyClass="font-semibold"  :styles="{width: '900px'}"  )
    template(#body='{data}')
      span.font-bold {{ data.createdAt | dateTimeHour12 }}
  Column(field="originalLocation" header="ORIGINAL LOCATION" className="text-right" sortable)
    template(#body="{data}")
      .flex.align-items-center.cursor-pointer.justify-content-end
        span.text-600.font-bold.font-sm {{ data.originalLocation }}
  Column(field="newLocation" header="NEW LOCATION" className="text-right" :sortable="true" bodyClass="font-semibold")
    template(#body="{data}")
      .flex.align-items-center.cursor-pointer.justify-content-end
        span.text-primary.font-bold.font-sm {{ data.newLocation.name }}
        .icon.icon-arrow-up-right.bg-primary
  Column(field="createdBy.id" header="CREATOR ID" sortable )
  template(#empty)
    div.flex.align-items-center.justify-content-center.flex-column
      img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" )
      p.text-900.font-bold.mt-3 List is empty!
  template(#footer)
    Pagination(
      :paging="paging"
      :total="totalHistory"
      @onPage="onPageHistory")

</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { PAGINATE_DEFAULT } from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
import { Paging } from '~/models/common/Paging'
const nsStoreBoxDetail = namespace('box/box-detail')

@Component({
  components: {
    Pagination
  }
})
class BoxDetailHistory extends Vue {
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }

  pageSize: number = 20
  pageNumber: number = 1

  // getParamApi(){
  //   return {
  //     pageNumber: this.pageNumber,
  //     pageSize: this.pageSize
  //   }
  // }

  @nsStoreBoxDetail.State
  locationHistory: []

  @nsStoreBoxDetail.State
  totalHistory!: number

  @nsStoreBoxDetail.Action
  actLocationHistory!: (params: any) => Promise<void>

  async mounted() {
    await this.actLocationHistory({ id: this.$route.params.id })
  }

  async onPageHistory(event: any) {
    this.pageNumber = event.page + 1
    await this.actLocationHistory({ id: this.$route.params.id })

  }
}

export default BoxDetailHistory
</script>

