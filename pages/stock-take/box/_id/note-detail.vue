<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto
      StockTakeNoteInfo(:info='stockTakeInfo')
      .grid.wapprer-unit.ml-4.mr-4
        .col-2.flex.align-items-center.justify-content-center
          .icon--large.bg-blue-700(class='icon-note')
        .col-10.flex.flex-column.justify-content-center
          div.font-normal.text-700.text-base Note
          Textarea.text-lg(:value='note' placeholder='Write something...' rows='2' cols=30)
    .col-9.pl-4.pr-1.flex.flex-column.h-full
      .grid
        .col-4
          h1.text-heading Stock-take Note
        .col-8.btn-right.flex.justify-content-end
          .btn.btn-primary.cursor-pointer.mr-2(@click='checkItems' v-if='isCheck')
            span.uppercase Check
          .btn.btn-primary.cursor-pointer.mr-2(@click='saveDraft' v-if='!isCheck && !isComplete')
            span.uppercase save draft
          .btn.btn-primary.cursor-pointer.mr-2(@click='submitNote' v-if='!isCheck && !isComplete')
            span.uppercase submit
          .btn.btn-primary.cursor-pointer.mr-2(@click='approveNote' v-if='isApprove')
            span.uppercase approve
          .btn.btn-primary.cursor-pointer.mr-2(@click='exportNote' v-if='isComplete')
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
            :rowClass='rowClass'
          )
            Column(:expander="true" )
            Column(field='no' header='NO' :styles="{'width': '1rem'}")
              template(#body='slotProps') {{ slotProps.index + 1 }}
            Column(field="boxCode" header="BOX CODE" :styles="{'width': '85%'}" sortable)
              template(#body="{data}")
                span.mr-2 {{data.boxCode}}
                badge.bg-green-400(value="CHECKING" v-if="data.isChecking")
            Column(field="location" header="LOCATION" sortable)
              template(#body="{data}")
                .flex.align-items-center.cursor-pointer
                  span.text-primary.font-bold.font-sm {{data.location}}
                  .icon--small.icon-arrow-up-right.bg-primary(v-if='data.location')
            Column(field="action" header="ACTION")
              template(#body="{data}")
                Button(@click='reportTakeNote(data)' :disabled="data.isChecking || isComplete")
                  span.uppercase report
            Column(field="status" header="STATUS" headerClass='grid-header-center' :styles="{'width': '15%'}" sortable)
              template(#body="{data}")
                .text-center
                  tag.table__status.table__status--error(v-if='data.status === "NG"') {{data.status}}
                  tag.table__status.table__status--available(v-else-if='data.status === "OK"') {{data.status}}
                  tag.table__status.table__status--draft(v-else) {{data.status}}
            template(#expansion="slotProps")
              div.orders-subtable.pb-2.pr-2
                DataTable.bg-white.table__sort-icon.w-full.h-full.flex.flex-column.child-table(
                  :value="slotProps.data.stockTakeBoxItem"
                  responsiveLayout="scroll"
                )
                  Column(field='no' header='NO' bodyClass='text-bold')
                    template(#body='slotProps') {{ slotProps.index + 1 }}
                  Column(field="barCode" header="Barcode" sortable)
                  Column(field="inventoryQuantity" header="INVENTORY QTY" sortable)
                  Column(field="countedQuantity" header="COUNTED QTY" :styles="{'width': '5%'}")
                    template(#body="{data}")
                      InputNumber.w-7rem(:disabled='isCheck || isComplete || data.isChecking' :min="0" v-model='data.countedQuantity' inputClass="w-full" ref='inputQuantity' @input='changeQuantity(data)')
                  Column(field="discrepancy" header=" VARIANT"  :styles="{'width': '80%'}")
                  Column(field="resultStatus" header="STATUS" headerClass='grid-header-center' :styles="{'width': '20%'}" sortable)
                    template(#body="{data}")
                      .text-center
                        tag.table__status.table__status--error(v-if='data.resultStatus === "NG"') {{data.resultStatus}}
                        tag.table__status.table__status--available(v-else-if='data.resultStatus === "OK"') {{data.resultStatus}}
                        tag.table__status.table__status--draft(v-else) {{data.resultStatus}}
            template(#empty)
              div.flex.align-items-center.justify-content-center.flex-column
                img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" )
                p.text-900.font-bold.mt-3 List is empty!
    ConfirmDialogCustom(
      title="Report Confirm"
      image="confirm-delete"
      :isShow="isShowModalReport"
      :onOk="handleReportItems"
      :onCancel="cancelReportBox"
      :loading="loadingSubmit"
    )
      template(v-slot:message)
        p(v-if="reportData") Do you want to report the quantity variant in the box {{ reportData.boxCode }}?
      template(v-slot:content)
        h3.text-left.text-900 NOTE:
        Textarea.text-left.w-full(v-model="valueReportNote" rows="4" placeholder="Please note here for your report if necessary")

</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import StockTakeNoteInfo from '~/components/stock-take/GeneralInfo.vue'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
const nsStoreStockTake = namespace('stock-take/box-detail')
const nsStorePackingDetail = namespace('stock-out/packing-box')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: {
    StockTakeNoteInfo,
    ConfirmDialogCustom
  }
})
class NoteBoxDetail extends Vue {
  stockTakeInfo: {
    createdAt?: any
    user?: any
    picId?: any
    totalBox?: number
    wareHouse?: any
    status?: any
    id: any
  } = {
    user: undefined,
    totalBox: 0,
    wareHouse: undefined,
    createdAt: 0,
    picId: '',
    status: '',
    id: ''
  }

  rowExpaned: any = []
  dataList: any[] = []
  isShowModalReport: boolean = false
  reportData: any = {}
  valueReportNote: string = ''
  loadingSubmit: boolean = false

  @nsStoreStockTake.State
  boxStockTakeDetail!: any

  @nsStoreUser.State
  user!: any

  @nsStoreStockTake.Action
  actGetBoxStockTakeDetail!: (params?: any) => Promise<void>

  @nsStoreStockTake.Action
  actSubmitBoxStockTakeDetail!: (params?: any) => Promise<any>

  @nsStoreStockTake.Action
  actGetAssignBoxStockTake!: (params?: any) => Promise<any>

  @nsStorePackingDetail.Action
  actCreateReport!:(data: any) => Promise<any>

  async mounted() {
    await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
    if(this.boxStockTakeDetail?.status !== 'NEW' && this.user?.staffId !== this.boxStockTakeDetail?.assignee?.staffId) {
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
              boxCode: element.boxCode,
              resultStatus: item.resultStatus || 'WAITING'
            }
          })
        }
      })
    )
    this.stockTakeInfo.createdAt = this.boxStockTakeDetail?.createdAt
    this.stockTakeInfo.user = this.boxStockTakeDetail?.createdBy
    this.stockTakeInfo.picId = this.boxStockTakeDetail?.assignee.staffId
    this.stockTakeInfo.totalBox = this.boxStockTakeDetail?.totalStockTakeBox
    this.stockTakeInfo.wareHouse = this.boxStockTakeDetail?.warehouse?.name
    this.stockTakeInfo.status = this.boxStockTakeDetail?.status
    this.stockTakeInfo.id = this.boxStockTakeDetail?.id
  }

  async checkItems() {
    const assigneeId = await this.actGetAssignBoxStockTake([
      this.$route.params.id
    ])
    if (assigneeId) {
      await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
      this.stockTakeInfo = {
        ...this.stockTakeInfo,
        picId: this.boxStockTakeDetail?.assignee?.staffId
      }
    }
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

  changeQuantity( data:any ) {
    if (data) {
      data.discrepancy = data.countedQuantity - data.inventoryQuantity
      if (data.countedQuantity === null) {
        data.resultStatus = 'WAITING'
      } else if (data.countedQuantity === data.inventoryQuantity) {
        data.resultStatus = 'OK'
      } else {
        data.resultStatus = 'NG'
      }
      const box = _.find(this.dataList, function ({ boxCode }) {
        if (boxCode === data.boxCode) {
          return true
        }
      })
      box.status = this.getStatusBox(box.stockTakeBoxItem)
    }
  }

  reportTakeNote( data:any ) {
    this.isShowModalReport = true
    this.reportData = data
  }

  exportNote() {}

  async saveDraft() {
    const submitData = _.flatten(
      _.map(this.dataList, ({ stockTakeBoxItem }) => {
        return _.map(stockTakeBoxItem, ({ id, countedQuantity }) => {
          return { id, countedQuantity }
        })
      })
    )
    const result = await this.actSubmitBoxStockTakeDetail({
      id: this.$route.params.id,
      isDraft: true,
      submitData
    })

    if (result) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Save draft successfully!',
        life: 3000
      })
      this.$router.push('/stock-take')
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Save draft take note failed!',
        life: 3000
      })
    }
  }

  async submitNote() {
    const submitData = _.flatten(
      _.map(this.dataList, ({ stockTakeBoxItem }) => {
        return _.map(stockTakeBoxItem, ({ id, countedQuantity }) => {
          return { id, countedQuantity }
        })
      })
    )
    const checkStatus = _.some(this.dataList, function square(n: any) {
      return n.status === null || n.status === 'WAITING'
    })

    if (!checkStatus) {
      const result = await this.actSubmitBoxStockTakeDetail({
        id: this.$route.params.id,
        isDraft: false,
        submitData
      })
      if (result) {
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Submit stock take successfully!',
          life: 3000
        })
        this.actGetBoxStockTakeDetail({
          id: this.$route.params.id,
          isDraft: false
        })
      }
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Cannot submit if status is waiting or unset!',
        life: 3000
      })
    }
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

  approveNote() {
    this.$router.push(`/stock-take/box/${this.$route.params.id}/approve`)
  }

  cancelReportBox(){
    this.isShowModalReport = false
  }

  get isCheck() {
    const { status, assignee } = this.boxStockTakeDetail
    return status === 'NEW' && assignee === null
  }

  get isComplete() {
    const { status } = this.boxStockTakeDetail
    return status === 'COMPLETED'
  }

  get isApprove() {
    const { status, finalResultStatus } = this.boxStockTakeDetail
    return status === 'COMPLETED' && finalResultStatus === 'NG'
  }

  rowClass(data: any) {
    return data.isChecking ? 'row-disable-bg' : ''
  }
}

export default NoteBoxDetail
</script>
<style lang="sass" scoped>
.packing__detail--container
  height: calc(100vh - 32px)
.btn-report
  height: 32px !important
  width: 57px !important
  font-size: 12px
.ng-tag
  background-color: #ffdcdc
  color: #c30e0e
::v-deep.parent-table .p-datatable-tbody > tr.p-datatable-row-expansion
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
