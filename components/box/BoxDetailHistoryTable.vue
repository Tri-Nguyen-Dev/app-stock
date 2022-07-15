<template lang="pug">
DataTable(
  responsiveLayout="scroll"
  :value='locationHistory'
  dataKey="id"
  :resizableColumns="true"
  :paginator="false"
  :rows="20"
  )
  Column(field="no" header="NO" sortable)
    template(#body='slotProps')
      span.font-bold  {{ (paging.pageNumber) * paging.pageSize + slotProps.index +1 }}
  Column(field="createdAt" header="CHANGE TIME" sortable bodyClass="font-semibold"  :styles="{width: '900px'}"  )
    template(#body='{data}')
      span.font-bold {{ data.createdAt | dateTimeHour24 }}
  Column(field="originalLocation" header="ORIGINAL LOCATION" className="text-right" sortable)
    template(#body="{data}")
      div(v-if='data.originalLocation')
        .flex.align-items-center.cursor-pointer.justify-content-end
          span.text-600.font-bold.font-sm {{ data.originalLocation.name }}
  Column(field="newLocation" header="NEW LOCATION" className="text-right" :sortable="true" bodyClass="font-semibold")
    template(#body="{data}")
      div(v-if='data.newLocation')
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
      @onPage="onPageHistory($event)")

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

  getParamApi(){
    return {
      id: this.$route.params.id
    }
  }

  @nsStoreBoxDetail.State
  locationHistory: []

  @nsStoreBoxDetail.State
  totalHistory!: number

  @nsStoreBoxDetail.Action
  actLocationHistory!: (params: any) => Promise<void>

  async mounted() {
    await this.actLocationHistory(this.getParamApi())
  }

  async onPageHistory(event: any) {
    this.paging.pageNumber = event.page
    this.paging.pageSize = event.rows
    await this.actLocationHistory({ pageNumber: this.paging.pageNumber, pageSize: this.paging.pageSize, ...this.getParamApi() })
  }

}

export default BoxDetailHistory
</script>

<style lang="sass" scoped>
.p-column-header-content
  .p-column-title
    color: #464D64
    font-weight: 700
    text-transform: uppercase
    letter-spacing: 1px
.p-datatable
  .p-datatable-thead
    tr
      th
        background: var(--surface-300)
.p-paginator
  justify-content: end
  .p-paginator-first , .p-paginator-last
    display: none
  .p-paginator-element
    border: none
    color: var(--surface-900)
  .p-paginator-pages
    .p-paginator-page.p-highlight
      background-color: var(--surface-0)
      box-shadow: none
      color: var(--primary-color) !important
    .p-paginator-page.p-paginator-element
      font-weight:  bold
      border: none
      color: var(--surface-500)
</style>
