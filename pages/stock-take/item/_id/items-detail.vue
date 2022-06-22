<template lang="pug">
  .grid.flex.grid-nogutter.driver
    div.bg-white.border-round-top.sub-tab(class='col-12 md:col-12 lg:col-4 xl:col-3')
      .col.flex.align-items-center.px-3
        Button(@click='$router.go(-1)').p-button-link
          .icon-arrow-left.icon.bg-primary.align-items-center
        Breadcrumb.font-bold(:home="homeItem" :model="breadcrumbItem")
      .border-bottom-1.border-gray-300
      .grid.flex.flex-column.my-4.p-3.grid-nogutter
        .col.flex
          .icon-box-info.icon.bg-primary.mr-2
          span.font-bold.text-700 Note Items Detail
        .col.mt-5
          span.font-bold Note ID: {{ boxStockTakeDetail.id }}
        .col.mt-5
          span.p-2.table__status.table__status--available {{boxStockTakeDetail.status}}
      div.sub--scroll.col-12
        .driver--info
          .col.border-bottom-1.border-gray-300
          div.wrap-unit.px-3
          .col.flex.my-3.mx-1
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase ID Information
          div.wrap-unit.px-4
            StockUnit(title="Create Time "  :value="boxStockTakeDetail.createdAt | dateTimeHour12" icon="icon-receipt-note")
          div.wrap-unit.px-4
            StockUnit(title="Creator ID " :value="creatorId"  icon="icon-tag-user")
          div.wrap-unit.px-4
            StockUnit(title="Warehouse"  :value="warehouse" icon="icon-warehouse")
          div.wrap-unit.px-4
            StockUnit(title="Items"  :value="total" icon="icon-frame")
        .driver--contact
          .col.border-bottom-1.border-gray-300
          div.wrap-unit.px-3
          .col.flex.my-3
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase Seller Information
          .wrap-unit.px-4
            StockUnit(title="Name" :value="abc" icon="icon-sender-name")
          .wrap-unit.px-4
            StockUnit(title="Email" :value="abc" icon="icon-sender-email")
          .wrap-unit.px-4
            StockUnit(title="Phone" :value="abc" icon="icon-sender-phone")
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
                    span( v-if="!isDetail" ) {{data.countedQuantity }}
                    InputNumber.w-7rem( v-else   v-model="data.countedQuantity" :min="0" mode="decimal"
                      inputClass="w-full" @input='handleDeliveryChange(data)'
                    )
              Column(field='discrepancy'  header='DISCREPANCY ' :sortable='true' className="text-center" )
                template(#body='{data}')
                  .text-center(v-if="data.countedQuantity !== null")
                    span {{data.countedQuantity - data.inventoryQuantity}}
              Column(field='status' header='STATUS' :sortable='true' className="text-center")
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
                  Button.btn.btn-primary.border-0( @click='handleReport(data)') Report
              ConfirmDialogCustom(
                title="Report Confirm"
                image="confirm-delete"
                :isShow="isShowModalReport"
                :onOk="handleReportItems"
                :onCancel="cancelReportBox"
                :loading="loadingSubmit"
              )
                template(v-slot:message)
                  p(v-if="reportData") Do you want to report the quantity discrepancy  in the box {{ reportData.boxCode }}?
                template(v-slot:content)
                  h3.text-left.text-900 NOTE:
                  Textarea.text-left.w-full(v-model="valueReportNote" rows="4" placeholder="Please note here for your report if necessary")
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { exportFileTypePdf, PAGINATE_DEFAULT } from '~/utils'
const nsStoreItems = namespace('stock-take/box-detail')
const nsStorePackingDetail = namespace('stock-out/packing-box')

@Component({
  components: {
    Pagination,
    ConfirmDialogCustom
  }
})
class stockTakeItemsDetail extends Vue {
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  stockTakeItems: any = []
  items: [] = []
  isDetail: boolean = true
  loadingSubmit: boolean = false
  isShowModalReport: boolean = false
  valueReportNote: string = ''
  reportData: {}

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

  @nsStorePackingDetail.Action
  actCreateReport!:(data: any) => Promise<any>

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

  get warehouse() {
    return this.boxStockTakeDetail?.createdBy?.warehouse?.name
  }

  get creatorId() {
    return this.boxStockTakeDetail?.createdBy?.staffId
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
    const result = await this.actSubmitBoxStockTakeDetail({
      id: this.$route.params.id,
      isDraft: true,
      submitData: this.saveItems
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
      isDraft: false,
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
    return { label: 'Stock Take', to: '/stock-take' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Note Take Detail',
        to: `/stock-take/item/${this.$route.params.id}/items-detail`
      }
    ]
  }

  get isCheckAssignee() {
    const { assignee, status } = this.boxStockTakeDetail
    return status === 'NEW' && !assignee
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

  handleReport(data) {
    this.isShowModalReport = true
    this.reportData = data
  }

  async handleReportItems() {
    if(this.reportData) {
      const result = await this.actCreateReport({
        boxNote: [
          {
            box: {
              id: this.reportData.boxCode
            },
            note: this.valueReportNote
          }
        ]

      })
      if (result) {
        this.isShowModalReport = false
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Add report successfully!',
          life: 3000
        })
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'This box has been reported!',
          life: 3000
        })
      }
    }
  }

  showFormReportBox() {
    this.isShowModalReport = true
  }

  cancelReportBox(){
    this.isShowModalReport = false
  }

}

export default stockTakeItemsDetail
</script>
<style lang="sass" scoped>
.driver
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
