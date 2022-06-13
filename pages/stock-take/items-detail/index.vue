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
          span.font-bold Note ID: ST2222
        .col.mt-5
          span.p-2.table__status.table__status--available New
      div.sub--scroll.col-12
        .driver--info
          .col.border-bottom-1.border-gray-300
          div.wrap-unit.px-3
          .col.flex.my-3.mx-1
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase ID Information
          div.wrap-unit.px-4
            StockUnit(title="Create Time "  :value="driverDetail" icon="icon-receipt-note")
          div.wrap-unit.px-4
            StockUnit(title="Creator ID " :value="driverDetail"  icon="icon-tag-user")
          div.wrap-unit.px-4
            StockUnit(title="Warehouse"  :value="driverDetail" icon="icon-warehouse")
          div.wrap-unit.px-4
            StockUnit(title="Items"  :value="driverDetail" icon="icon-frame")
        .driver--contact
          .col.border-bottom-1.border-gray-300
          div.wrap-unit.px-3
          .col.flex.my-3
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase Seller Information
          .wrap-unit.px-4
            StockUnit(title="Name" :value="driverDetail" icon="icon-sender-name")
          .wrap-unit.px-4
            StockUnit(title="Email" :value="driverDetail" icon="icon-sender-email")
          .wrap-unit.px-4
            StockUnit(title="Phone" :value="driverDetail" icon="icon-sender-phone")
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .inventory.flex.flex-column
        .inventory__header
          div
            h1.text-heading Stock Take Items Detail
            span.text-subheading 3 total
          .inventory__header--action.flex
            Button.btn.btn-primary.border-0(@click='handleSaveDraft') Save Draft
            Button.btn.btn-primary.border-0(@click='handleSubmit') Submit
        .inventory__content
          DataTable.m-h-700(
            :value='[]'
            dataKey='id'
            :rows='10'
            responsiveLayout="scroll"
            :resizableColumns="true"
            :class="{ 'table-wrapper-empty': !driverDetail || driverDetail.length <= 0 }"
            @sort="sortData($event)"
          )
            Column(field='no' header='NO' :styles="{'width': '3rem'}" bodyClass='text-bold')
              template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
            Column(field='deliveryOrderId' header='BARCODE' :sortable='true' sortField='_id')
            Column(field='sellerEmail' header='ITEM NAME' :sortable='true' sortField='_seller.email')
            Column(field='receiverAddress' header='BOX CODE' :sortable='true' bodyClass='font-semibold' sortField='_receiverAddress')
            Column(field='completeTime' header='INVENTORY Q.TY' :sortable='true' className="text-right" sortField='_receivedDate')
            Column(field='completeTime' header='COUNTED Q.TY' :sortable='true' className="text-right" sortField='_receivedDate')
            Column(field='completeTime' header='DISCREPANCY ' :sortable='true' className="text-right" sortField='_receivedDate')
            Column(field='completeTime' header='STATUS' :sortable='true' className="text-right" sortField='_receivedDate')
            Column(field='completeTime' header='REPORT BOX ' :sortable='true' className="text-right" sortField='_receivedDate')
            template(#footer)
              Pagination(
                :paging="paging"
                :total="3"
                @onPage="onPage"
              )
            template(#empty)
              div.flex.align-items-center.justify-content-center.flex-column
                img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" )
                p.text-900.font-bold.mt-3 List is empty!, Click
                  span.text-primary.underline.cursor-pointer &nbsp;here
                  span &nbsp;to add item.
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import { PAGINATE_DEFAULT } from '~/utils'

@Component({
  components: {
    Pagination
  }
})
class stockTakeItemsDetail extends Vue {
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  filter: any = {
    desc: null,
    sortBy: null
  }

  data1 : any = {
    'data': {
      'total': 61,
      'items': [
        {
          'id': 'DO000000000391',
          'barcode': 'AD000002',
          'itemName': 'Admin',
          'boxCode': '2022-06-03T07:13:59.215+00:00',
          'location': 'SL000003',
          'iventory': 'Seller Huân',
          'counted': 'sellerhuan@gmail.com',
          'discrepancy': 'vu',
          'status': '2022-06-11T09:28:10.975+00:00'
        }
      ]
    },
    'time': '2022-06-10T09:28:10.975+00:00'
  }

  handleSaveDraft() {

  }

  handleSubmit(){

  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    // await this.getDriverList()
  }

  sortData(e: any) {
    const { sortField, sortOrder } = e
    if(sortOrder){
      this.filter.desc = sortOrder !== 1
      this.filter.sortBy = sortField.replace('_', '')
    }else{
      this.filter.desc = null
      this.filter.sortBy = null
    }
  // await this.getDriverList()
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

}

export default stockTakeItemsDetail
</script>
<style lang="sass" scoped>
.driver
  @include tablet
    margin: 50px
  ::v-deep.sub-tab
    height: calc(100vh - 150px)
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
        height: calc(100vh - 280px)
        overflow: auto
      @include tablet
        height: calc(100vh - 280px)
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
  .filter__dropdown, .filter__multiselect
    @include size(100%, 40px)
    border: none
  .pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  .p-calendar-w-btn
    .p-button
      background: none
      border: none
</style>
