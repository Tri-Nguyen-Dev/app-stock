<template lang="pug">
  .grid.flex.grid-nogutter.driver
    div.bg-white.border-round-top.sub-tab(class='col-12 md:col-12 lg:col-4 xl:col-3')
      .grid.flex.align-items-center.p-2.m-0
        .col-12.flex
          Button(@click='$router.go(-1)').p-button-link.pl-0
            .icon-arrow-left.icon.bg-primary.align-items-center
          Breadcrumb.font-bold(:home="homeItem" :model="breadcrumbItem")
      .border-bottom-1.border-gray-300
      .grid.flex.flex-column.p-2.m-0
        .col.flex
          .icon-box-info.icon.bg-primary.mr-2
          span.font-bold.text-700 Note Items Detail
        .col
          span.p-2.table__status.table__status--available New
        .col
          span.font-bold Note ID: ST2222
        .col.border-bottom-1.border-gray-300
      div.sub--scroll
        .grid.driver--info.p-2.m-0
          .col-12.flex
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase ID Information
          .col-12
            StockUnit.m-0(title="Create Time "  :value="driverDetail" icon="icon-receipt-note")
          .col-12
            StockUnit.m-0(title="Creator ID " :value="driverDetail"  icon="icon-tag-user")
          .col-12
            StockUnit.m-0(title="Warehouse"  :value="driverDetail" icon="icon-warehouse")
          .col-12
            StockUnit.m-0(title="Items"  :value="driverDetail" icon="icon-frame")
          .col.border-bottom-1.border-gray-300
        .grid.driver--contact.p-2.m-0
          .col-12.flex
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase Seller Information
          .col-12
            StockUnit.m-0(title="Name" :value="driverDetail" icon="icon-sender-name")
          .col-12
            StockUnit.m-0(title="Email" :value="driverDetail" icon="icon-sender-email")
          .col-12
            StockUnit.m-0(title="Phone" :value="driverDetail" icon="icon-sender-phone")
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .stock-take.flex.flex-column
        .stock-take__header
          div
            h1.text-heading Stock-take Note
            span.text-subheading {{ totalItem }} total
          .stock-take__header--action.flex
            Button.btn.btn-primary.border-0(@click='handleAddItems') Add Item
            Button.btn.btn-primary.border-0(@click='handleSubmit') Save
        .stock-take__content
          DataTable.m-h-700(
            :value='listItemByPage'
            dataKey='id'
            :rows='10'
            responsiveLayout="scroll"
            :resizableColumns="true"
            :class="{ 'table-wrapper-empty': !driverDetail || driverDetail.length <= 0 }"
          )
            Column(field='no' header='NO' :styles="{'width': '3rem'}")
              template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
            Column(field='barCode' header='BARCODE' :sortable='true')
            Column(field='name' header='ITEM NAME' :sortable='true')
            Column(field='boxCode' header='BOX CODE' :sortable='true')
            Column(field="rackLocation.name" header="LOCATION" :sortable="true" className="text-right")
              template(#body="{data}")
                div(v-if="data.location")
                  .flex.align-items-center.cursor-pointer.justify-content-end
                    span.text-primary.font-bold.font-sm.text-white-active {{ data.location }}
                    .icon.icon-arrow-up-right.bg-primary.bg-white-active
            template(#footer)
              Pagination(
                :paging="paging"
                :total="totalItem"
                @onPage="onPage"
              )
            template(#empty)
              div.flex.align-items-center.justify-content-center.flex-column
                img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" )
                p.text-900.font-bold.mt-3 List is empty!, Click
                  span.text-primary.underline.cursor-pointer &nbsp;here
                  span &nbsp;to add item.
    ItemListModel(
      :isShow="isModalAddItem"
      @hideDialog='hideDialog($event)',
      @onApply='handleApplyAddItem($event)',
    )
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import { PAGINATE_DEFAULT } from '~/utils'
import ItemListModel from '~/components/stock-take/ItemListModel.vue'

@Component({
  components: {
    Pagination,
    ItemListModel
  }
})
class StockTakeItems extends Vue {
  listStockSelected = []
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  isModalAddItem: boolean = false
  disabledApply = true
  driverDetail = 'namlcp'
  filter: any = {
    desc: null,
    sortBy: null
  }

  handleAddItems() {
    this.isModalAddItem = true
  }

  handleSubmit(){

  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
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

  get totalItem() {
    return _.size(this.listStockSelected)
  }

  get listItemByPage() {
    return this.listStockSelected
  }

  handleApplyAddItem(selectedStock){
    this.listStockSelected = _.cloneDeep(selectedStock)
    this.isModalAddItem = false
  }

  hideDialog(isShowModal: boolean){
    this.isModalAddItem = isShowModal
  }
}

export default StockTakeItems
</script>
<style lang="sass" scoped>
.driver
  @include tablet
    margin: 50px
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

.wrap-unit
  width: 300px
  margin-bottom: 16px

::v-deep.stock-take
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
