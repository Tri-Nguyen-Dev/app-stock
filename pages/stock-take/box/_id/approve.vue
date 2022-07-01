<template lang="pug">
  .grid.flex.grid-nogutter.stock
    StockTakeNoteInfo(:info='noteDetailInfo' :homeItem='homeItem' :breadcrumbItem='breadcrumbItem')
      template(#note)
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          .icon--large.bg-blue-700(class='icon-note')
          span.font-normal.text-700.text-base.uppercase Note
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2' v-if='boxStockTakeDetail.note')
          .col.flex.flex-column.justify-content-center
            div.font-normal.text-base.uppercase.font-bold Creator:
            Textarea(:value='boxStockTakeDetail.note' disabled rows='2' cols=30)
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2' v-if='boxStockTakeDetail.submitNote')
          .col.flex.flex-column.justify-content-center
            div.font-normal.text-base.uppercase.font-bold PIC:
            Textarea.text-lg(:value='boxStockTakeDetail.submitNote' disabled rows='2' cols=30)
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          .col.flex.flex-column.justify-content-center
            div.font-normal.text-base.uppercase.font-bold Approver:
            Textarea.text-lg(:value='stockTakeInfo.note' rows='2' cols=30)
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .stock-takeItem.flex.flex-column
        .stock-takeItem__header
          div
            h1.text-heading(v-if='this.boxStockTakeDetail.status === "APPROVED"')  Approved Stock-take Note Detail
            h1.text-heading(v-else)  Approving Stock-take Note Detail
          .stock-takeItem__header--action.flex
            Button.btn.btn-primary.border-0(@click='saveApprove' v-if='!isApproved') save
            Button.btn.btn-primary.border-0(@click='exportNote') export
        .stock-takeItem__content
          DataTable(
            v-if="dataList"
            :value="dataList"
            responsiveLayout="scroll"
            dataKey="boxCode"
            :resizableColumns="true"
            :rows="20"
            :scrollable="false"
            :class="{ 'table-wrapper-empty': !dataList || dataList.length <= 0 }"
            :expandedRows.sync="rowExpaned"
            :rowHover="false"
          )
            Column(:expander="true" )
            Column(field='no' header='NO')
              template(#body='slotProps') {{ slotProps.index + 1 }}
            Column(field="boxCode" header="BOX CODE" sortable)
              template(#body="{data}")
                span.mr-2 {{data.boxCode}}
            Column(field="location" header="LOCATION" :styles="{'width': '100%'}" sortable)
              template(#body="{data}")
                .flex.align-items-center.cursor-pointer
                  span.text-primary.font-bold.font-sm {{data.location}}
                  .icon--small.icon-arrow-up-right.bg-primary(v-if='data.location')
            template(#expansion="slotProps")
              div.orders-subtable.pb-2.pr-2
                DataTable.bg-white.table__sort-icon.w-full.h-full.flex.flex-column.child-table(
                  :value="slotProps.data.stockTakeBoxItem"
                  responsiveLayout="scroll"
                  :rowClass='rowClass'
                )
                  Column(field='no' header='NO' bodyClass='text-bold')
                    template(#body='slotProps') {{ slotProps.index + 1 }}
                  Column(field="barCode" header="Barcode" :styles="{'width': '100%'}" sortable)
                  Column(field="inventoryQuantity" header="INVENTORY QTY" sortable className="red-text")
                  Column(field="countedQuantity" header="COUNTED QTY" className="red-text")
                  Column(field="approvedQuantity" header="APPROVE QTY" className="red-text")
                    template(#body="{data}")
                      InputNumber.w-7rem(inputClass="w-full" v-model='data.approvedQuantity' @input='changeQuantity(data)' :disabled='isApproved')
                  Column(field="discrepancy" header="APPROVE VARIANT")
                    template(#body="{data}")
                      span(v-if='data.approvedQuantity !== null') {{data.discrepancy}}
            template(#empty)
              div.flex.align-items-center.justify-content-center.flex-column
                img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" )
                p.text-900.font-bold.mt-3 List is empty!
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import StockTakeNoteInfo from '~/components/stock-take/GeneralInfo.vue'
import { exportFileTypePdf } from '~/utils'
const nsStoreStockTake = namespace('stock-take/box-detail')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: {
    StockTakeNoteInfo
  }
})
class ApproveBoxStockTake extends Vue {
  stockTakeInfo: {
    createdAt?: any
    user?: any
    picId?: any
    approveId?: any
    totalBox?: number
    wareHouse?: any
    status?: any
    id?: any
    note?: any
  } = {
    user: undefined,
    totalBox: 0,
    wareHouse: undefined,
    createdAt: 0,
    picId: '',
    status: '',
    id: '',
    approveId: '',
    note: ''
  }

  rowExpaned: any = []
  dataList: any[] = []

  @nsStoreStockTake.State
  boxStockTakeDetail!: any

  @nsStoreUser.State
  user!: any

  @nsStoreUser.State
  receiptUrl!: any

  @nsStoreStockTake.Action
  actGetBoxStockTakeDetail!: (params?: any) => Promise<void>

  @nsStoreStockTake.Action
  actGetAssignBoxStockTake!: (params?: any) => Promise<any>

  @nsStoreStockTake.Action
  actApproveSubmit!: (params?: any) => Promise<any>

  @nsStoreStockTake.Action
  actGetStockTakeLable!: (params?: any) => Promise<any>

  async mounted() {
    await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
    if (
      this.boxStockTakeDetail?.status !== 'NEW' &&
      this.user?.staffId !== this.boxStockTakeDetail?.assignee?.staffId
    ) {
      this.$router.push('/stock-take')
    }
    this.dataList = _.cloneDeep(
      this.boxStockTakeDetail.stockTakeBox.map((element: any) => {
        const checkingStatus = _.some(
          element.stockTakeItem,
          function square(n: any) {
            return n.isChecking
          }
        )
        return {
          ...element,
          status: this.getStatusBox(element.stockTakeItem),
          isChecking: checkingStatus,
          stockTakeBoxItem: element.stockTakeItem.map((item: any) => {
            return {
              ...item,
              approvedQuantity: item.countedQuantity,
              boxCode: element.boxCode,
              resultStatus: item.resultStatus || 'WAITING'
            }
          })
        }
      })
    )
  }

  getStatusBox(stockTakeBoxItem: any) {
    if (!stockTakeBoxItem) return null
    const statusWaiting = _.findIndex(stockTakeBoxItem, (e: any) => {
      return e.resultStatus === 'WAITING' || !e.resultStatus
    })
    if (statusWaiting !== -1) {
      return 'WAITING'
    } else {
      const statusOk = _.every(stockTakeBoxItem, (e: any) => {
        return e.resultStatus === 'OK'
      })
      if (statusOk) {
        return 'OK'
      } else {
        return 'NG'
      }
    }
  }

  changeQuantity(data: any) {
    if (data) {
      data.discrepancy = data.approvedQuantity - data.inventoryQuantity
    }
  }

  async saveApprove() {
    let submitData = _.flatten(
      _.map(this.dataList, ({ stockTakeBoxItem }) => {
        return _.map(stockTakeBoxItem, ({ id, approvedQuantity }) => {
          return { id, approvedQuantity }
        })
      })
    )
    submitData = { stockTakeItem: [...submitData], approveNote: this.boxStockTakeDetail.note }
    const result = await this.actApproveSubmit({ id: this.$route.params.id , data: submitData })
    if (result) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Save approve stock take successfully!',
        life: 3000
      })
      this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Save approve stock take failed!',
        life: 3000
      })
    }
  }

  async exportNote() {
    const result = await this.actGetStockTakeLable({
      id: this.$route.params.id
    })
    if (result) {
      exportFileTypePdf(result, `Stock-Take-${this.$route.params.id}`)
    }
  }

  rowClass(data: any) {
    return (data.countedQuantity !== data.approvedQuantity || data.countedQuantity !== data.inventoryQuantity) && 'red-row'
  }

  get isApproved () {
    const { status } = this.boxStockTakeDetail
    return status === 'APPROVED'
  }

  get noteDetailInfo() {
    this.stockTakeInfo.createdAt = this.boxStockTakeDetail?.createdAt
    this.stockTakeInfo.user = this.boxStockTakeDetail?.createdBy
    this.stockTakeInfo.picId = this.boxStockTakeDetail?.assignee?.staffId
    this.stockTakeInfo.approveId = this.boxStockTakeDetail?.approver?.staffId
    this.stockTakeInfo.totalBox = this.boxStockTakeDetail?.totalStockTakeBox
    this.stockTakeInfo.wareHouse = this.boxStockTakeDetail?.warehouse?.name
    this.stockTakeInfo.id = this.boxStockTakeDetail?.id
    this.stockTakeInfo.status = this.boxStockTakeDetail?.status
    this.stockTakeInfo.note = this.boxStockTakeDetail?.approveNote
    return this.stockTakeInfo
  }

  get homeItem() {
    return { label: 'Note list', to: '/stock-take', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Stock-take Note Detail Approve' }
    ]
  }
}

export default ApproveBoxStockTake
</script>
<style lang="sass" scoped>
.stock
  @include tablet
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
::v-deep.parent-table .p-datatable-tbody > tr.p-datatable-row-expansion
  .red-row
    .red-text
      color: red
      .p-inputtext
        color: red
  & td
    padding-right: 0
    .child-table
      border: solid 1px #ececec
.wapprer-unit
  min-height: 72px
  border-radius: 4px
  background-color: $text-color-200
  .text-wrap
    word-break: break-all
  ::v-deep.p-inputtext
    border: none
    background: transparent
    padding: 0
    color: #000
    font-weight: 600
    box-shadow: none !important
    max-width: 100%
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
  &__footer
    background: $color-white
    display: flex
    justify-content: space-between
    padding: 6px 8px
    align-items: center
</style>
