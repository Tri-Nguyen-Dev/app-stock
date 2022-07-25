<template lang="pug">
  .grid.flex.grid-nogutter.stock
    NoteInfo(:noteInfor="noteInfor" :homeItem="homeItem" :breadcrumbItem="breadcrumbItem")
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .inventory.flex.flex-column
        .inventory__header
          div
            h1.text-heading {{ titlePage }}
            span.text-subheading All ({{ total }})
          .inventory__header--action.flex(v-if="isDetail")
            Button.btn.btn-primary.border-0(v-if="!isCheckAssignee" @click='handleSaveDraft') Save Draft
            Button.btn.btn-primary.border-0(v-if="!isCheckAssignee" @click='handleSubmit' :disabled='isDisabled' ) Submit
            Button.btn.btn-primary.border-0(v-if="isCheckAssignee" @click='handleAssignee') Check
          .inventory__header--action.flex(v-else)
            Button.btn.btn-primary.border-0(v-if="isApprove && user.role === 'admin'" @click="handleApprove") Approve
            Button.btn.btn-primary.border-0(@click='exportpdf' v-if='boxStockTakeDetail.status !== "CANCELLED" ' ) Export
        .inventory__content
          DataTable.m-h-700(
            :value='itemsData'
            dataKey='id'
            :rows='20'
            responsiveLayout="scroll"
            :resizableColumns="true"
            :class="{ 'table-wrapper-empty': !items || items.length <= 0 }"
          )
            Column(field='no' header='NO' :styles="{'width': '3rem'}" bodyClass='font-semibold')
              template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
            Column(field='barCode' header='BARCODE' :sortable='true' bodyClass='font-semibold')
            Column(field='itemName' header='ITEM NAME' :sortable='true' )
            Column(field='boxCode' header='BOX CODE' :sortable='true' bodyClass='font-semibold' )
              template(#body='{data}')
                span {{data.boxCode}}
                badge.bg-green-400.ml-2(value="BUSY" v-if="data.isChecking")
            Column(field="location" header="LOCATION" className="text-right")
              template(#body="{data}")
                div(v-if="data.location")
                  .flex.align-items-center.cursor-pointer.justify-content-end
                    span.text-primary.font-bold.font-sm.text-white-active {{ data.location }}
                    .icon.icon-arrow-up-right.bg-primary.bg-white-active
            div(v-if="!isCheckAssignee")
              Column(field='inventoryQuantity' header='INVENTORY Q.TY' className="text-center")
              Column(field='countedQuantity' header='COUNTED Q.TY')
                template(#body='{data}')
                  .text-center
                    span( v-if="!isDetail || data.isChecking " ) {{data.countedQuantity }}
                    InputNumber.w-7rem(v-else v-model="data.countedQuantity" :min="0" mode="decimal"
                      inputClass="w-full" @input='handleDeliveryChange(data)' :useGrouping="false"
                    )
              Column(field='discrepancy' header='VARIANT')
                template(#body='{data}')
                  .text-center(v-if="data.countedQuantity !== null")
                    span {{data.countedQuantity - data.inventoryQuantity}}
              Column(field='status' header='STATUS' className="text-center")
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
              Column( v-if=' isDetail ' header='REPORT BOX ' className="text-right" )
                template(#body='{data}' )
                  Button.btn.btn-primary.border-0( @click='handleReport(data)' :disabled="data.isChecking") Report
            template(#footer)
              .grid.grid-nogutter.stock__footer(v-if='isDetail && !isCheckAssignee')
                .col.stock__note
                  div(style="padding-left: 10.5px") Note:
                  InputText.inputSearchCode.w-full(v-model="submitNote" rows="1" cols="40" placeholder='Write something...' )
        ConfirmDialogCustom(
          title="Report Confirm"
          image="confirm-delete"
          :isShow="isShowModalReport"
          :onOk="handleReportItems"
          :onCancel="cancelReportBox"
          :loading="loadingSubmit"
        )
          template(v-slot:message)
            p(v-if="reportData") Do you want to report the quantity variant  in the box {{ reportData.boxCode }}?
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
import NoteInfo from '~/components/stock-take/item-list/NoteInfo.vue'
const dayjs = require('dayjs')
const nsStoreItems = namespace('stock-take/box-detail')
const nsStorePackingDetail = namespace('stock-out/packing-box')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: {
    Pagination,
    NoteInfo,
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
  reportData: any = {}
  submitNote: string = ''
  isStatusCancel: boolean = true

  // -- [ State ] ------------------------------------------------------------
  @nsStoreItems.State
  boxStockTakeDetail!: any

  @nsStoreUser.State
  user: any | undefined

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

  @nsStorePackingDetail.Action
  actCreateReport!: (data: any) => Promise<any>

  // -- [ Function ] ------------------------------------------------------------

  async mounted() {
    await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
    const status = this.boxStockTakeDetail?.status
    const staffId = this.boxStockTakeDetail?.assignee?.staffId
    if (
      this.user?.staffId !== staffId && status === 'DRAFT' ||
      this.user?.staffId !== staffId && status === 'IN_PROGRESS') {
      this.$router.push('/stock-take')
    } else if ( this.boxStockTakeDetail.status === 'COMPLETED' || status === 'CANCELLED' ) {
      this.isDetail = false
    }
  }

  get total() {
    return this.boxStockTakeDetail?.totalStockTakeItem
  }

  get itemsData() {
    this.items = _.cloneDeep(this.boxStockTakeDetail.stockTakeItem)
    return this.items
  }

  get noteInfor() {
    const { createdAt, createdBy, assignee, seller, note, submitNote } = this.boxStockTakeDetail
    const notes: any = []
    if (note) {
      notes.push({ position: 'Creator', author: createdBy?.staffId, value: note })
    }
    if (submitNote) {
      notes.push({ position: 'PIC', author: assignee?.staffId, value: submitNote })
    }
    return {
      id: this.boxStockTakeDetail?.id,
      status: this.boxStockTakeDetail?.status,
      finalResultStatus: this.boxStockTakeDetail?.finalResultStatus,
      creatorInfo: [
        {
          title: 'Created Time', value: createdAt ?
            dayjs(new Date(createdAt)).format('MM-DD-YYYY hh:mm A')
            : null, icon: 'icon-receipt-note'
        },
        { title: 'Creator ID', value: createdBy?.staffId, icon: 'icon-tag-user' },
        !this.isCheckAssignee ? { title: 'PIC ID', value: assignee?.staffId, icon: 'icon-tag-user' } : null,
        {
          title: 'Warehouse',
          value: this.boxStockTakeDetail?.warehouse?.name,
          icon: 'icon-warehouse',
          link: this.boxStockTakeDetail?.warehouse?.id
        },
        { title: 'Total item(s)', value: this.total, icon: 'icon-frame' }
      ],
      sellerInfo: [
        {
          title: 'Name', value: function (seller) {
            if (!seller) return null
            if (!seller.displayName && !seller.firstName && !seller.lastName) {
              return 'N/A'
            }
            return seller.displayName || seller.firstName + ' ' + seller.lastName
          }(seller), icon: 'icon-sender-name'
        },
        { title: 'Email Address', value: seller?.email, icon: 'icon-sender-email' },
        { title: 'Phone Number', value: seller?.phoneNumber, icon: 'icon-sender-phone' }
      ],
      notes
    }
  }

  get titlePage() {
    return `Stock-take Note ${this.boxStockTakeDetail?.status !== 'NEW' ? ' Detail' : ''}`
  }

  async handleSaveDraft() {
    const note = this.submitNote.trim()
    const result = await this.actSubmitBoxStockTakeDetail({
      id: this.$route.params.id,
      isDraft: true,
      submitData: {
        stockTakeItem: this.saveItems,
        note
      }
    })
    if (result) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Save draft successfully!',
        life: 3000
      })
      await this.$router.push({ path: '/stock-take' })
      this.isDetail = !this.isDetail
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Save draft take note failed!',
        life: 3000
      })
    }
  }

  async handleSubmit() {
    const note = this.submitNote.trim()
    const result = await this.actSubmitBoxStockTakeDetail({
      id: this.$route.params.id,
      isDraft: false,
      submitData: {
        stockTakeItem: this.saveItems,
        note
      }
    })
    if (result) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Submit stock take successfully!',
        life: 3000
      })
      this.isDetail = !this.isDetail
      await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Submit stock take box failed!',
        life: 3000
      })
    }
  }

  async exportpdf() {
    const result = await this.actGetStockTakeLable({ id: this.$route.params.id })
    if (result) {
      exportFileTypePdf(result, `Stock-Take-${this.$route.params.id}`)
    }
  }

  handleDeliveryChange(event: any) {
    event.discrepancy = event.countedQuantity - event.inventoryQuantity
    if (event.discrepancy === 0) {
      event.resultStatus = 'OK'
    } else if (event.discrepancy !== 0 && event.countedQuantity !== null) {
      event.resultStatus = 'NG'
    } else {
      event.resultStatus = 'WAITING'
    }
  }

  get isDisabled() {
    return !!_.find(this.items, function (obj: any) {
      if (obj.resultStatus === 'WAITING' || obj.resultStatus === null) {
        return true
      }
    })
  }

  get homeItem() {
    return { to: '/stock-take', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      {
        label: this.titlePage,
        to: `/stock-take/item/${this.$route.params.id}/note-detail`
      }
    ]
  }

  get isCheckAssignee() {
    const { assignee, status } = this.boxStockTakeDetail
    return status === 'NEW' && !assignee
  }

  get isApprove() {
    const { finalResultStatus, status, approver } = this.boxStockTakeDetail
    return finalResultStatus === 'NG' && status === 'COMPLETED' && !approver && this.user.role === 'admin'
  }

  async handleAssignee() {
    const result = await this.actGetAssignBoxStockTake([
      this.$route.params.id
    ])
    if (result?.data) {
      await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
      this.items = _.cloneDeep(this.boxStockTakeDetail.stockTakeItem)
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Assign stock take item successfully!',
        life: 3000
      })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Assign stock take item failed!',
        life: 3000
      })
    }
  }

  async handleApprove() {
    const result = await this.actApproveStockTake({ id: this.$route.params.id })
    if (result?.data) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Save approve stock take successfully!',
        life: 3000
      })
      await this.$router.push(`/stock-take/item/${this.$route.params.id}/approve`)
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Save approve stock take failed!',
        life: 3000
      })
    }
  }

  get saveItems() {
    const a: any = []
    _.forEach(this.items, ({ id, countedQuantity }) => {
      a.push({
        id,
        countedQuantity
      })
    })
    this.stockTakeItems = _.cloneDeep(a)
    return this.stockTakeItems
  }

  handleReport(data) {
    this.isShowModalReport = true
    this.reportData = data
  }

  async handleReportItems() {
    if (this.reportData) {
      const result = await this.actCreateReport({
        boxNote: [
          {
            box: {
              id: this.reportData?.boxCode
            },
            note: this.valueReportNote
          }
        ]

      })
      if (result) {
        this.isShowModalReport = false
        this.valueReportNote = ''
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

  cancelReportBox() {
    this.isShowModalReport = false
    this.valueReportNote = ''
  }

}

export default stockTakeItemsDetail
</script>
<style lang="sass" scoped>
.stock
  ::-webkit-input-placeholder
    font-weight: normal

  ::-webkit-scrollbar
    width: 7px
    height: 7px
    background-color: #F5F5F5

  ::-webkit-scrollbar-track
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3)
    border-radius: 10px
    background-color: #F5F5F5

  ::-webkit-scrollbar-thumb
    border-radius: 10px
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3)
    background-color: #979AA4

  &__footer
    background: $color-white
    display: flex
    justify-content: space-between
    padding: 6px 8px
    align-items: center

.wrap-unit
  width: 300px
  margin-bottom: 16px

::v-deep.inventory
  min-height: calc(100vh - 32px)
  margin-top: 3rem
  @include desktop
    margin-top: 0px
    margin-left: 2rem
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
      flex-wrap: wrap
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

  .text-right
    text-align: right !important

    .p-column-header-content
      justify-content: end !important

</style>
