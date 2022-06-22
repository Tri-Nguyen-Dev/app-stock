<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto
      StockTakeNoteInfo(:info='stockTakeInfo')
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
          )
            Column(:expander="true" )
            Column(field='no' header='NO' :styles="{'width': '1rem'}")
              template(#body='slotProps') {{ slotProps.index + 1 }}
            Column(field="boxCode" header="BOX CODE" :styles="{'width': '100%'}" sortable)
              template(#body="{data}")
                span.mr-2 {{data.boxCode}}
                badge.bg-green-400(value="CHECKING" v-if="data.isChecking")
            Column(field="location" header="LOCATION" sortable)
              template(#body="{data}")
                .flex.align-items-center.cursor-pointer
                  span.text-primary.font-bold.font-sm {{data.location}}
                  .icon--small.icon-arrow-up-right.bg-primary
            Column(field="action" header="ACTION")
              template(#body="{data}")
                Button(@click='reportTakeNote' :disabled="data.isChecking")
                  span.uppercase report
            Column(field="status" header="STATUS" sortable)
              template(#body="{data}")
                .text-center
                  tag.table__status.table__status--error(v-if='data.status === "NG"') {{data.status}}
                  tag.table__status.table__status--available(v-else-if='data.status === "OK"') {{data.status}}
                  tag.table__status.table__status--draft(v-else) {{data.status}}
            template(#expansion="slotProps")
              div.orders-subtable.pb-2
                DataTable.bg-white.table__sort-icon.w-full.h-full.flex.flex-column.child-table(
                  :value="slotProps.data.stockTakeBoxItem"
                  responsiveLayout="scroll"
                )
                  Column(field='no' header='NO' bodyClass='text-bold')
                    template(#body='slotProps') {{ slotProps.index + 1 }}
                  Column(field="barCode" header="Barcode" :styles="{'width': '30%'}" sortable)
                  Column(field="inventoryQuantity" header="INVENTORY QTY" sortable)
                  Column(field="countedQuantity" header="COUNTED QTY" :styles="{'width': '5%'}")
                    template(#body="{data}")
                      InputNumber.w-7rem(:disabled='isCheck || isComplete' :min="0" v-model='data.countedQuantity' inputClass="w-full" ref='inputQuantity' @input='changeQuantity({ index: slotProps.index, barCode: data.barCode },$event)')
                  Column(field="discrepancy" header=" VARIANT" :styles="{'width': '100%'}")
                  Column(field="resultStatus" header="STATUS" :styles="{'width': '3%'}" sortable)
                    template(#body="{data}")
                      .text-center
                        tag.table__status.table__status--error(v-if='data.resultStatus === "NG"') {{data.resultStatus}}
                        tag.table__status.table__status--available(v-else-if='data.resultStatus === "OK"') {{data.resultStatus}}
                        tag.table__status.table__status--draft(v-else) {{data.resultStatus}}
            template(#empty)
              div.flex.align-items-center.justify-content-center.flex-column
                img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" )
                p.text-900.font-bold.mt-3 List is empty!

</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import StockTakeNoteInfo from '~/components/stock-take/GeneralInfo.vue'
const nsStoreStockTake = namespace('stock-take/box-detail')

@Component({
  components: {
    StockTakeNoteInfo
  }
})
class NoteBoxDetail extends Vue {
  stockTakeInfo: {
    createdAt?: any
    user?: any
    picId?: any
    totalBox?: number
    wareHouse?: any
  } = {
    user: undefined,
    totalBox: 0,
    wareHouse: undefined,
    createdAt: 0,
    picId: ''
  }

  rowExpaned: any = []
  isChecking: boolean = false
  dataList: any[] = []

  @nsStoreStockTake.State
  boxStockTakeDetail!: any

  @nsStoreStockTake.Action
  actGetBoxStockTakeDetail!: (params?: any) => Promise<void>

  @nsStoreStockTake.Action
  actSubmitBoxStockTakeDetail!: (params?: any) => Promise<any>

  @nsStoreStockTake.Action
  actGetAssignBoxStockTake!: (params?: any) => Promise<any>

  async mounted() {
    await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
    this.dataList = _.cloneDeep(
      this.boxStockTakeDetail.stockTakeBox.map((element: any) => {
        const checkingStatus = _.some(
          element.stockTakeBoxItem,
          function square(n: any) {
            return n.isChecking
          }
        )
        return {
          ...element,
          status: null,
          isChecking: checkingStatus,
          stockTakeBoxItem: element.stockTakeItem.map((item: any) => {
            return {
              ...item,
              boxCode: element.boxCode
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

  changeQuantity({ index, barCode }) {
    const itemIndex = _.findIndex(
      this.dataList[index].stockTakeBoxItem,
      (e: any) => {
        return e.barCode === barCode
      }
    )
    if (itemIndex !== -1) {
      const data = this.dataList[index].stockTakeBoxItem[itemIndex]
      data.discrepancy = data.countedQuantity - data.inventoryQuantity
      if (data.countedQuantity === null) {
        data.resultStatus = 'WAITING'
      } else if (data.countedQuantity === data.inventoryQuantity) {
        data.resultStatus = 'OK'
      } else {
        data.resultStatus = 'NG'
      }
      const statusWaiting = _.findIndex(
        this.dataList[index].stockTakeBoxItem,
        (e: any) => {
          return e.resultStatus === 'WAITING'
        }
      )
      const statusOk = _.every(
        this.dataList[index].stockTakeBoxItem,
        (e: any) => {
          return e.resultStatus === 'OK'
        }
      )
      if (statusWaiting !== -1) {
        this.dataList[index].status = 'WAITING'
      } else if (statusOk) {
        this.dataList[index].status = 'OK'
      } else {
        this.dataList[index].status = 'NG'
      }
    }
  }

  reportTakeNote() {}

  exportNote() {}

  saveDraft() {
    let draftData = this.dataList.map((element) => {
      return [...element.stockTakeBoxItem]
    })

    draftData = _.flatten(draftData)
    const submitData = _.map(draftData, function square(el: any) {
      return { ...el, isDraft: true }
    })

    this.actSubmitBoxStockTakeDetail({
      id: this.$route.params.id,
      submitData
    })

    this.$toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Save draft successfully!',
      life: 3000
    })
    this.$router.push('/stock-take')
  }

  async submitNote() {
    let submitData = this.dataList.map((element) => {
      return [...element.stockTakeBoxItem]
    })

    submitData = _.flatten(submitData)
    const checkStatus = _.some(this.dataList, function square(n: any) {
      return n.status === null || n.status === 'WAITING'
    })

    if (!checkStatus) {
      const result = await this.actSubmitBoxStockTakeDetail({
        id: this.$route.params.id,
        submitData
      })
      if (result) {
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Submit stock take successfully!',
          life: 3000
        })
        this.$router.push('/stock-take')
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

  get isCheck() {
    const { status, assignee } = this.boxStockTakeDetail
    return status === 'NEW' && assignee === null
  }

  get isComplete() {
    const { status } = this.boxStockTakeDetail
    return status === 'COMPLETED'
  }
}

export default NoteBoxDetail
</script>
<style lang="sass" scoped>
.packing__detail--container
  height: calc(100vh - 32px)
.packing__detail--left
  // height: calc( 100% - 32px) !important
.btn-report
  height: 32px !important
  width: 57px !important
  font-size: 12px
.ng-tag
  background-color: #ffdcdc
  color: #c30e0e
::v-deep.parent-table .p-datatable-tbody > tr
  background-color: #72a9ff  !important
  .child-table .p-datatable-tbody > tr
    background-color: #fff !important
::v-deep.parent-table .p-datatable-tbody > tr.p-datatable-row-expansion
  background-color: #fff !important
  & td
    padding-right: 0
</style>
