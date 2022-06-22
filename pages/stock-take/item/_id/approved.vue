<template lang="pug">
  .grid.flex.grid-nogutter.stock
    NoteInfo(:noteInfor="noteInfor" :homeItem="homeItem" :breadcrumbItem="breadcrumbItem")
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .stock-takeItem.flex.flex-column
        .stock-takeItem__header
          div
            h1.text-heading Approving Stock-take Note Detail
            span.text-subheading {{ total }} total items
        .stock-takeItem__content
          DataTable.m-h-700(
            :value='items'
            dataKey='id'
            :rows='20'
            responsiveLayout="scroll"
            :rowClass="rowClass"
            :resizableColumns="true"
            :class="{ 'table-wrapper-empty': !items || items.length <= 0 }"
          )
            Column(field='no' header='NO' :styles="{'width': '3rem'}" bodyClass='text-bold')
              template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
            Column(field='barCode' header='BARCODE' :sortable='true' )
            Column(field='itemName' header='ITEM NAME' :sortable='true' )
            Column(field='boxCode' header='BOX CODE' :sortable='true' bodyClass='font-semibold' )
              template(#body='{data}')
                span {{data.boxCode}}
                badge.bg-green-400.ml-2(value="CHECKING" v-if="data.isChecking")
            Column(field="location" header="LOCATION" :sortable="true" className="text-right")
              template(#body="{data}")
                div(v-if="data.location")
                  .flex.align-items-center.cursor-pointer.justify-content-end
                    span.text-primary.font-bold.font-sm.text-white-active {{ data.location }}
                    .icon.icon-arrow-up-right.bg-primary.bg-white-active
            div(v-if="!isCheckAssignee")
              Column(field='inventoryQuantity' header='INVENTORY Q.TY' :sortable='true' className="text-center")
              Column(field='countedQuantity' header='COUNTED Q.TY' :sortable='true' className="text-center")
                template.text-center(#body='{data}' class="text-center")
                  .text-center
                    span( v-if="!isDetail" ) {{data.countedQuantity}}
                    InputNumber.w-7rem( v-else   v-model="data.countedQuantity" :min="0" mode="decimal"
                      inputClass="w-full" @input='handleDeliveryChange(data)'
                    )
              Column(field='discrepancy'  header='DISCREPANCY ' :sortable='true' className="text-center" )
                template(#body='{data}')
                  .text-center(v-if="data.countedQuantity !== null")
                    span(v-model="data.discrepancy") {{data.discrepancy}}

              Column(field='status' header='STATUS' :sortable='true' className="text-center" s)
                template(#body='{ data }' )
                  span.table__status.table__status--available(
                    v-if="data.resultStatus === 'OK'"
                  ) {{ data.resultStatus }}
                  span.table__status.table__status--error(
                    v-else-if="data.resultStatus === 'NG'"
                  ) {{ data.resultStatus  }}
                  span.table__status.table__status--draft(
                    v-else
                  ) Waiting
              Column( v-if='isDetail' header='REPORT BOX ' className="text-right" )
                template(#body='{data}' )
                  Button.btn.btn-primary.border-0( @click='handleReport') Report

</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import NoteInfo from '~/components/stock-take/item-list/NoteInfo.vue'
const nsStoreItems = namespace('stock-take/box-detail')
const dayjs = require('dayjs')

@Component({
  components: {
    NoteInfo
  }
})
class stockTakeItemsDetail extends Vue {
  stockTakeItems: any = []
  items: [] = []
  isDetail: boolean = true

  // -- [ State ] ------------------------------------------------------------

  @nsStoreItems.State
  boxStockTakeDetail!: any

  @nsStoreItems.Action
  actGetBoxStockTakeDetail!: (params?: any) => Promise<void>

  @nsStoreItems.Action
  actSubmitBoxStockTakeDetail!: (params: any) => Promise<string>

  @nsStoreItems.Action
  actGetStockTakeLable!: (params: any) => Promise<string>

  @nsStoreItems.Action
  actGetAssignBoxStockTake!: (params?: any) => Promise<any>

  @nsStoreItems.Action
  actApproveStockTake!: (params?: any) => Promise<any>

  async mounted() {
    await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
    this.items = _.cloneDeep(this.boxStockTakeDetail.stockTakeItem)
    if(this.boxStockTakeDetail.status === 'COMPLETED') {
      this.isDetail = false
    }
  }

  get total() {
    return this.boxStockTakeDetail?.totalStockTakeItem
  }

  get sellerInfo() {
    const { stockTakeItem } = this.boxStockTakeDetail
    if(stockTakeItem) {
      const sumStockTakeItem = _.size(stockTakeItem)
      const firstStock: any = stockTakeItem[0]
      if(firstStock) {
        const stockSame = _.partition(stockTakeItem, ({ sellerEmail }) => sellerEmail === firstStock.sellerEmail)[0]
        if(_.size(stockSame) === sumStockTakeItem) {
          return firstStock
        }
      }
    }
  }

  get noteInfor() {
    const { createdAt, createdBy, approver, assignee } = this.boxStockTakeDetail
    return {
      id: this.boxStockTakeDetail?.id,
      status: this.boxStockTakeDetail?.status,
      creatorInfo: [
        { title:'Create Time', value: createdAt ?
          dayjs(new Date(createdAt)).format('YYYY-MM-DD') 
          : null, icon: 'icon-receipt-note' },
        { title:'Creator ID', value: createdBy?.staffId, icon: 'icon-tag-user' },
        { title:'PIC ID', value: assignee?.staffId, icon: 'icon-tag-user' },
        { title:'APPROVER ID', value: approver?.staffId, icon: 'icon-tag-user' },
        { title:'Warehouse', value: createdBy?.warehouse?.name, icon: 'icon-warehouse' },
        { title:'Items', value: this.total, icon: 'icon-frame' }
      ],
      sellerInfo: [
        { title:'Name', value: this.sellerInfo?.sellerName, icon: 'icon-sender-name' },
        { title:'Email', value: this.sellerInfo?.sellerEmail, icon: 'icon-sender-email' },
        { title:'Phone', value: this.sellerInfo?.sellerPhone, icon: 'icon-sender-phone' }
      ]
    }
  }

  get homeItem() {
    return { label: 'Stock Take', to: '/stock-take' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Note Take Detail',
        to: `/stock-take/item/${this.$route.params.id}/approved`
      }
    ]
  }

  get isCheckAssignee() {
    const { assignee, status } = this.boxStockTakeDetail
    return status === 'NEW' && !assignee
  }

  get isApprove() {
    const { finalResultStatus, status, approver } = this.boxStockTakeDetail
    return finalResultStatus === 'NG' && status === 'COMPLETED' && !approver
  }

  async handleAssignee() {
    const result = await this.actGetAssignBoxStockTake([
      this.$route.params.id
    ])
    if(result?.data) {
      await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
      this.items = _.cloneDeep(this.boxStockTakeDetail.stockTakeItem)
    }
  }

  async handleApprove() {
    const result = await this.actApproveStockTake({ id: this.$route.params.id })
    if(result?.data) {
      await this.$router.push(`/stock-take/item/${this.$route.params.id}/approve`)
    }
  }
}

export default stockTakeItemsDetail
</script>
<style lang="sass" scoped>
.stock
  @include tablet
    // margin: 50px
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
        overflow: auto
      @include tablet
        flex-direction: row
        justify-content: center
        align-items: baseline
        overflow: hidden

  ::-webkit-input-placeholder
    font-weight: normal

  ::-webkit-scrollbar
    width: 7px
    height: 7px
    background-color: #F5F5F5

  ::-webkit-scrollbar-track
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
    border-radius: 10px
    background-color: #F5F5F5

  ::-webkit-scrollbar-thumb
    border-radius: 10px
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
    background-color: #979AA4

.wrap-unit
  width: 300px
  margin-bottom: 16px

::v-deep.stock-takeItem
  min-height: calc(100vh - 32px)
  margin-top: 3rem
  @include desktop
    margin-top: 0px
    margin-left: 2rem
    height: calc(100vh - 32px)
  &__header
    flex-direction: column
    flex-wrap: wrap
    margin-bottom: 16px
    @include desktop
      flex-direction: row
      @include flex-center-space-between
    &--action
      margin-top: 12px
      display: flex
      @include flex-column
      flex-wrap:  wrap
      gap: 10px 16px
      @include desktop
        @include flex-center
        flex-direction: row
        margin-top: 0
  &__filter
    margin-bottom: $space-size-24
  &__content
    flex: 1
    border-radius: 4px
    position: relative
    overflow: hidden
  &__note
    border-left: 1px solid var(--gray-300)!important
  &__footer
    background: $color-white
    display: flex
    justify-content: space-between
    padding: 6px 8px
    align-items: center
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
    .table__action
      float: right
  .disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
  .pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  .p-calendar-w-btn
    .p-button
      background: none
      border: none
</style>