<template lang="pug">
  .grid.flex.grid-nogutter.stock
    NoteInfo(:noteInfor="noteInfor" :homeItem="homeItem" :breadcrumbItem="breadcrumbItem")
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .inventory.flex.flex-column
        .inventory__header
          div
            h1.text-heading Stock Take Items Detail
            span.text-subheading {{ total }} total items
          .inventory__header--action.flex(v-if="isDetail")
            Button.btn.btn-primary.border-0(v-if="!isCheckAssignee" @click='handleSaveDraft') Save Draft
            Button.btn.btn-primary.border-0(v-if="!isCheckAssignee" @click='handleSubmit' :disabled='isDisabled' ) Submit
            Button.btn.btn-primary.border-0(v-if="isCheckAssignee" @click='handleAssignee') Check
          .inventory__header--action.flex(v-else)
            Button.btn.btn-primary.border-0(v-if="isApprove") Approve
            Button.btn.btn-primary.border-0(@click='exportpdf' ) Export
        .inventory__content
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
              Column(field='completeTime' header='REPORT BOX ' :sortable='true' className="text-right" )
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import { exportFileTypePdf, PAGINATE_DEFAULT } from '~/utils'
import NoteInfo from '~/components/stock-take/item-list/NoteInfo.vue'
const nsStoreItems = namespace('stock-take/box-detail')

@Component({
  components: {
    Pagination,
    NoteInfo
  }
})
class stockTakeItemsDetail extends Vue {
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
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

  get noteInfor() {
    return {
      id: this.boxStockTakeDetail?.id,
      status: this.boxStockTakeDetail?.status,
      creator: {
        createdAt: this.boxStockTakeDetail.createdAt,
        creatorID: this.boxStockTakeDetail?.createdBy?.staffId,
        warehouse: this.boxStockTakeDetail?.createdBy?.warehouse?.name
      },
      totalItem: this.total,
      seller: this.sellerInfo
    }
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

  get saveItems(){
    _.forEach(this.items, ( { id, countedQuantity }  ) => {
      this.stockTakeItems.push({
        id ,
        countedQuantity
      })
    })
    return this.stockTakeItems
  }

  async handleSaveDraft() {
    const newArr = this.saveItems.map(el => ({ ...el, isDraft: true }))
    const result = await this.actSubmitBoxStockTakeDetail({
      id: this.$route.params.id,
      submitData: newArr
    })
    if(result) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully Save Draft',
        life: 3000
      })
      await this.$router.push({ path: '/stock-take' })
      this.isDetail = !this.isDetail
    }
  }

  rowClass({ isChecking }) {
    if( isChecking ) {
      return 'row-disable'
    }
  }

  async handleSubmit(){
    const result = await this.actSubmitBoxStockTakeDetail({
      id: this.$route.params.id,
      submitData: this.saveItems
    })
    if(result) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully submit items',
        life: 3000
      })
    }
    this.isDetail = !this.isDetail

  }

  async exportpdf(){
    const result = await this.actGetStockTakeLable({ id : this.$route.params.id })
    if(result) {
      exportFileTypePdf(result, `Stock-Take-${ this.$route.params.id }`)
    }
    await this.$router.push({ path: '/stock-take' })
  }

  handleDeliveryChange( event : any ){
    event.discrepancy  = event.countedQuantity - event.inventoryQuantity
    if(event.discrepancy ===  0 ) {
      event.resultStatus = 'OK'
    }else if(event.discrepancy !== 0 && event.countedQuantity !== null ) {
      event.resultStatus = 'NG'
    } else {
      event.resultStatus = 'Waiting'
    }
  }

  get isDisabled() {
    return !!_.find(this.items , function (obj) {
      if(obj.resultStatus === 'Waiting' || obj.resultStatus === null ) {
        return true
      }
    })
  }

  get homeItem() {
    return { label: 'D/O List', to: '/stock-out/order-list' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Driver',
        to: `/stock-out/order/${this.$route.params.id}/driver` },
      { label: 'Information',
        to: `/stock-out/order/${this.$route.params.id}/driver/${this.$route.params.sid}`
      }
    ]
  }

  get isCheckAssignee() {
    const { assignee, status } = this.boxStockTakeDetail
    return status === 'NEW' && !assignee
  }

  get isApprove() {
    const { finalResultStatus, status } = this.boxStockTakeDetail
    return finalResultStatus === 'NG' && status === 'COMPLETED'
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
}

export default stockTakeItemsDetail
</script>
<style lang="sass" scoped>
.stock
  @include tablet
    margin: 50px
  ::v-deep.sub-tab
    height: calc(100vh - 100px)
    overflow: hidden
    @include desktop
      height: calc(100vh - 32px)
      max-width: 23rem
      overflow: hidden
    .sub--scroll
      display: flex
      align-items: center
      flex-direction: column
      height: calc(100vh - 32px)
      overflow: auto
      @include desktop
        height: calc(100vh - 250px)
        overflow: auto
      @include tablet
        height: calc(100vh - 300px)
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

::v-deep.inventory
  min-height: calc(100vh - 32px)
  margin-top: 3rem
  @include desktop
    margin-top: 0px
    margin-left: 3rem
    height: calc(100vh - 32px)
  &__header
    flex-direction: column
    flex-wrap: wrap
    margin-bottom: 24px
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
    .p-datatable-table
      .text-primary
        color: $primary-dark !important
        font-weight: $font-weight-medium
      .p-datatable-tbody
        & > tr
          background: $text-color-100
          .text-bold
            color: $text-color-700
            .p-inputnumber-input
              color: $text-color-700
        .outgoing__selected
          background: $color-white
          > .text-bold
            font-weight: $font-weight-bold
            color: $text-color-900
            .p-inputnumber-input
              font-weight: $font-weight-bold
              color: $text-color-900 !important
      .p-datatable-thead > tr > th
        white-space: unset
        .p-column-header-content
          .p-checkbox
            display: none
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important

</style>
