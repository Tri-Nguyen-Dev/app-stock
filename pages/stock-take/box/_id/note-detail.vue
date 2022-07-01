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
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          .col.flex.flex-column.justify-content-center
            div.font-normal.text-base.uppercase.font-bold PIC:
            Textarea.text-lg(:value='noteDetailInfo.submitNote' :disabled='isComplete' placeholder='Write something...' rows='2' cols=30)
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .stock-takeItem.flex.flex-column
        .stock-takeItem__header
          div
            h1.text-heading(v-if='isCheck') Stock-take Note
            h1.text-heading(v-else) Stock-take Note Detail
          .stock-takeItem__header--action.flex
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
            Column(field="action" header="ACTION" :hidden='isComplete || isCheck')
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
                  //- :selection.sync="slotProps.data.stockTakeBoxItem.selectedConfirm"
                  Column(field='no' header='NO' bodyClass='text-bold')
                    template(#body='slotProps') {{ slotProps.index + 1 }}
                  Column(field="barCode" header="Barcode" sortable)
                  Column(field="inventoryQuantity" header="INVENTORY QTY" sortable)
                  Column(field="countedQuantity" header="COUNTED QTY" :styles="{'width': '5%'}")
                    template(#body="{data}")
                      InputNumber.w-7rem(:disabled='isCheck || isComplete || data.isChecking' :min="0" v-model='data.countedQuantity' inputClass="w-full" ref='inputQuantity' @input='changeQuantity(data)' :useGrouping="false" mode="decimal")
                  //- Column(selectionMode="multiple" :headerStyle="{'width': '3em'}")
                  Column(field="discrepancy" header=" VARIANT"  :styles="{'width': '80%'}")
                    template(#body="{data}")
                      span(v-if='data.countedQuantity !== null') {{data.countedQuantity - data.inventoryQuantity}}
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
    ConfirmDialogCustom(
      title="Submit Warning"
      :isShow="isShowSubmitWarning"
      :onOk="okSubmitWarning"
      :onCancel="cancelSubmitWarning"
      :loading="loadingSubmit"
      type='warning'
    )
      template(v-slot:message)
        p Submitting is not allowed until all counted quantity has been filled!
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import StockTakeNoteInfo from '~/components/stock-take/GeneralInfo.vue'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { exportFileTypePdf } from '~/utils'
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
    note: any
  } = {
    user: undefined,
    totalBox: 0,
    wareHouse: undefined,
    createdAt: 0,
    picId: '',
    status: '',
    id: '',
    note: ''
  }

  rowExpaned: any = []
  dataList: any[] = []
  isShowModalReport: boolean = false
  reportData: any = {}
  valueReportNote: string = ''
  loadingSubmit: boolean = false
  selectedConfirm: any[] = []
  isShowSubmitWarning: boolean = false
  checkSubmit: boolean = false

  @nsStoreStockTake.State
  boxStockTakeDetail!: any

  @nsStoreUser.State
  user!: any

  @nsStoreUser.State
  receiptUrl!: any

  @nsStoreStockTake.Action
  actGetBoxStockTakeDetail!: (params?: any) => Promise<void>

  @nsStoreStockTake.Action
  actSubmitBoxStockTakeDetail!: (params?: any) => Promise<any>

  @nsStoreStockTake.Action
  actGetAssignBoxStockTake!: (params?: any) => Promise<any>

  @nsStorePackingDetail.Action
  actCreateReport!: (data: any) => Promise<any>

  @nsStoreStockTake.Action
  actApproveStockTake!: (params?: any) => Promise<any>

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
              boxCode: element.boxCode,
              resultStatus: item.resultStatus || 'WAITING',
              selectedConfirm: []
            }
          })
        }
      })
    )
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
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Assign stock take box successfully!',
        life: 3000
      })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Assign stock take box failed!',
        life: 3000
      })
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

  changeQuantity(data: any) {
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

  reportTakeNote(data: any) {
    this.isShowModalReport = true
    this.reportData = data
  }

  async exportNote() {
    const result = await this.actGetStockTakeLable({
      id: this.$route.params.id
    })
    if (result) {
      exportFileTypePdf(result, `Stock-Take-${this.$route.params.id}`)
    }
  }

  async saveDraft() {
    let submitData = _.flatten(
      _.map(this.dataList, ({ stockTakeBoxItem }) => {
        return _.map(stockTakeBoxItem, ({ id, countedQuantity }) => {
          return { id, countedQuantity }
        })
      })
    )
    submitData = { stockTakeItem: [...submitData] , submitNote: this.boxStockTakeDetail.note }
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
    let submitData = _.flatten(
      _.map(this.dataList, ({ stockTakeBoxItem }) => {
        return _.map(stockTakeBoxItem, ({ id, countedQuantity }) => {
          return { id, countedQuantity }
        })
      })
    )

    submitData = { stockTakeItem: [...submitData] , submitNote: this.boxStockTakeDetail.note }
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
      this.isShowSubmitWarning = true
    }
  }

  async handleReportItems() {
    if (this.reportData) {
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
        this.isShowModalReport = false
      }
    }
  }

  async approveNote() {
    const result = await this.actApproveStockTake({ id: this.$route.params.id })
    if (result) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'This box has been approve!',
        life: 3000
      })
      this.$router.push(`/stock-take/box/${this.$route.params.id}/approve`)
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Approve box failed!',
        life: 3000
      })
    }
  }

  cancelReportBox() {
    this.isShowModalReport = false
  }

  okSubmitWarning() {
    this.isShowSubmitWarning = false
    this.checkSubmit = true
  }

  cancelSubmitWarning() {
    this.isShowSubmitWarning = false
    this.checkSubmit = true
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

  get noteDetailInfo() {
    this.stockTakeInfo.createdAt = this.boxStockTakeDetail?.createdAt
    this.stockTakeInfo.user = this.boxStockTakeDetail?.createdBy
    this.stockTakeInfo.picId = this.boxStockTakeDetail?.assignee?.staffId
    this.stockTakeInfo.totalBox = this.boxStockTakeDetail?.totalStockTakeBox
    this.stockTakeInfo.wareHouse = this.boxStockTakeDetail?.warehouse?.name
    this.stockTakeInfo.status = this.boxStockTakeDetail?.status
    this.stockTakeInfo.id = this.boxStockTakeDetail?.id
    this.stockTakeInfo.note = this.boxStockTakeDetail?.submitNote
    return this.stockTakeInfo
  }

  rowClass(data: any) {
    return data.isChecking ? 'row-disable-bg' : ''
  }

  get homeItem() {
    return { label: '', to: '/stock-take', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      { label: `${this.isCheck ? 'Stock-take Note' : 'Stock-take Note Detail'}` }
    ]
  }
}

export default NoteBoxDetail
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
  .redInput.p-inputtext:enabled:focus
    box-shadow: 0 0 0 0.2rem rgb(38 143 255 / 50%) !important
</style>
