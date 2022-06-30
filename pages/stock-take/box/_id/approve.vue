<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto
      StockTakeNoteInfo(:info='noteDetailInfo' :homeItem='homeItem' :breadcrumbItem='breadcrumbItem')
      .grid.ml-4.mr-4
        .icon--large.bg-blue-700(class='icon-note')
        span.font-normal.text-700.text-base.uppercase Note
      .grid.wapprer-unit.ml-4.mr-4.mt-2(v-if='boxStockTakeDetail.note')
        .col.flex.flex-column.justify-content-center
          div.font-normal.text-base.uppercase.font-bold Creator:
          Textarea(:value='boxStockTakeDetail.note' disabled rows='2' cols=30)
      .grid.wapprer-unit.ml-4.mr-4.mt-2(v-if='boxStockTakeDetail.submitNote')
        .col.flex.flex-column.justify-content-center
          div.font-normal.text-base.uppercase.font-bold PIC:
          Textarea.text-lg(:value='boxStockTakeDetail.submitNote' disabled rows='2' cols=30)
      .grid.wapprer-unit.ml-4.mr-4.mt-2
        .col.flex.flex-column.justify-content-center
          div.font-normal.text-base.uppercase.font-bold Approver:
          Textarea.text-lg(:value='stockTakeInfo.note' rows='2' cols=30)
    .col-9.pl-4.pr-1.flex.flex-column.h-full
      .grid
        .col-6
          h1.text-heading(v-if='this.boxStockTakeDetail.status === "APPROVED"')  Approved Stock-take Note Detail
          h1.text-heading(v-else)  Approving Stock-take Note Detail
        .col-6.btn-right.flex.justify-content-end
          .btn.btn-primary.cursor-pointer.mr-2(@click='saveApprove' v-if='!isApproved')
            span.uppercase save
          .btn.btn-primary.cursor-pointer.mr-2(@click='exportNote')
            span.uppercase export
      .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
        .col.h-full.absolute.top-0.left-0.right-0.mt-2
          DataTable.bg-white.table__sort-icon.w-full.h-full.flex.flex-column.parent-table(
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

  get isApproving() {
    return this.boxStockTakeDetail.status === 'APPROVING'
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
    return { label: '', to: '/stock-take', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      { label: `${this.isApproving ? 'Approving' : 'Approved'}  Stock-take Note Detail`,
        to: `/stock-take/item/${this.$route.params.id}/approve`
      }
    ]
  }
}

export default ApproveBoxStockTake
</script>
<style lang="sass" scoped>
.packing__detail--container
  height: calc(100vh - 32px)
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
</style>
