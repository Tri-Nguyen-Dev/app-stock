<template lang="pug">
  .grid.flex.grid-nogutter.stock
    NoteInfo(:noteInfor="noteInfor" :homeItem="homeItem" :breadcrumbItem="breadcrumbItem")
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .stock-takeItem.flex.flex-column
        .stock-takeItem__header
          div
            h1.text-heading {{ isApproving ? 'Approving' : 'Approved' }} Stock-take Note Detail
            span.text-subheading All ({{ total }})
          .stock-takeItem__header--action.flex
            Button.btn.btn-primary.border-0(@click='handleSubmit' v-if='isApproving' :disabled='isDisabled') Save
            Button.btn.btn-primary.border-0(@click='exportpdf' v-else) Export
        .stock-takeItem__content
          DataTable.m-h-700(
            :value='dataTable'
            dataKey='id'
            :rows='20'
            responsiveLayout="scroll"
            :resizableColumns="true"
            :rowClass='rowClass'
            :class="{ 'table-wrapper-empty': !dataTable || dataTable.length <= 0 }"
          )
            Column(field='no' header='NO' :styles="{'width': '3rem'}" bodyClass='text-bold')
              template(#body='slotProps') {{ slotProps.index + 1 }}
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
            Column(field='inventoryQuantity' header='INVENTORY Q.TY' :sortable='true'
              className="text-center text-highlight" :styles="{'width': '25px'}")
            Column.white-space-normal(field='countedQuantity' header='COUNTED Q.TY' :sortable='true' className="text-center text-highlight")
            Column(field='approvedQuantity' header='APPROVED Q.TY' :sortable='true' className="text-center text-highlight")
              template.text-center(#body='{data}' class="text-center")
                .text-center
                  span( v-if="!isApproving" ) {{data.approvedQuantity }}
                  InputNumber.w-7rem( v-else v-model="data.approvedQuantity" :min="0" mode="decimal" inputClass="w-full" )
            Column(field='countedQuantity' header='APPROVED VARIANT' :sortable='true' className="text-center")
              template.text-center(#body='{data}' class="text-center")
                .text-center(v-if='data.approvedQuantity !== null') {{ data.approvedQuantity - data.inventoryQuantity }}
            template(#footer)
              .grid.grid-nogutter.stock-takeItem__footer(v-if="isApproving")
                .col-12.stock-takeItem__note
                  div(style="padding-left: 10.5px") Note:
                  InputText.inputSearchCode.w-full(v-model="approveNote" rows="1" cols="40" placeholder='Write something...')
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import NoteInfo from '~/components/stock-take/item-list/NoteInfo.vue'
import { exportFileTypePdf } from '~/utils'
const nsStoreItems = namespace('stock-take/box-detail')
const nsStoreUser = namespace('user-auth/store-user')
const dayjs = require('dayjs')

@Component({
  components: {
    NoteInfo
  }
})
class stockTakeItemsDetail extends Vue {
  stockTakeItems: any = []
  items: [] = []
  approveNote: string =''

  // -- [ State ] ------------------------------------------------------------
  @nsStoreItems.State
  boxStockTakeDetail!: any

  @nsStoreUser.State
  user: any | undefined

  @nsStoreItems.Action
  actGetBoxStockTakeDetail!: (params?: any) => Promise<void>

  @nsStoreItems.Action
  actGetStockTakeLable!: (params: any) => Promise<string>

  @nsStoreItems.Action
  actApproveSubmit!: (params?: any) => Promise<any>

  async mounted() {
    if(this.user.role === 'admin') {
      await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'You do not have permission to access this page.',
        life: 3000
      })
      this.$router.push('/stock-take')
    }
  }

  get total() {
    return this.boxStockTakeDetail?.totalStockTakeItem
  }

  get noteInfor() {
    const { createdAt, createdBy, approver, assignee, seller, note, submitNote, approveNote } = this.boxStockTakeDetail
    const notes: any = []
    if(note) {
      notes.push({ position: 'Creator', author: createdBy?.staffId, value: note })
    }
    if(submitNote) {
      notes.push({ position: 'PIC', author: assignee?.staffId, value: submitNote })
    }
    if(approveNote) {
      notes.push({ position: 'Approver', author: approver?.staffId, value: approveNote })
    }
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
        { title:'Name', value: function(seller) {
          if(!seller) return null
          if(!seller.displayName && !seller.firstName && !seller.lastName) {
            return 'N/A'
          }
          return seller.displayName || seller.firstName + ' ' + seller.lastName
        }(seller), icon: 'icon-sender-name' },
        { title:'Email', value: seller?.email, icon: 'icon-sender-email' },
        { title:'Phone', value: seller?.phoneNumber, icon: 'icon-sender-phone' }
      ],
      notes
    }
  }

  get homeItem() {
    return { to: '/stock-take', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      { label: `${this.isApproving ? 'Approving' : 'Approved'}  Stock-take Note Detail`,
        to: `/stock-take/item/${this.$route.params.id}/approve`
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

  get isApproving() {
    return this.boxStockTakeDetail.status === 'APPROVING'
  }

  get isDisabled() {
    const object = _.find(this.dataTable, ({ approvedQuantity })=>{
      if(_.isNull(approvedQuantity)){
        return true
      }
    })
    return !!object
  }

  get dataTable() {
    if(!this.boxStockTakeDetail?.stockTakeItem) return
    this.items = _.cloneDeep(this.boxStockTakeDetail.stockTakeItem.map((x: any) => {
      const approvedQuantity = this.isApproving ? x.countedQuantity : x.approvedQuantity
      return {
        ..._.cloneDeep(x),
        approvedQuantity
      }
    }))
    return this.items
  }

  get noteText() {
    return this.boxStockTakeDetail.approveNote
  }

  rowClass({ inventoryQuantity, countedQuantity, approvedQuantity }) {
    return (inventoryQuantity !== countedQuantity || countedQuantity !== approvedQuantity)  && 'row__statusNG'
  }

  async handleSubmit(){
    const data = {
      stockTakeItem: _.map(this.items, ({ id, approvedQuantity, inventoryQuantity }) => ({ id, approvedQuantity, inventoryQuantity })),
      approveNote: this.approveNote
    }
    const result = await this.actApproveSubmit({ id: this.$route.params.id, data })
    if(result?.data) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Save approve stock take successfully!',
        life: 3000
      })
      await this.actGetBoxStockTakeDetail({ id: this.$route.params.id })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Save approve stock take failed!',
        life: 3000
      })
    }
  }

  async exportpdf(){
    const result = await this.actGetStockTakeLable({ id : this.$route.params.id })
    if(result) {
      exportFileTypePdf(result, `Stock-Take-${ this.$route.params.id }`)
    }
  }
}

export default stockTakeItemsDetail
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
  &__content
    flex: 1
    border-radius: 4px
    position: relative
    overflow: hidden
    .p-datatable-resizable .p-datatable-thead > tr > th
      white-space: normal
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
    .table__action
      float: right
  .row__statusNG
    // background-color: $text-color-500
    .text-highlight
      color: red
      input
        color: red
  &__footer
    background: $color-white
    padding: 6px 8px
</style>
