<template lang="pug">
  .stock__take
    .stock__take__header
      div
        h1.text-heading Stock-take note list
        span.text-subheading product found
      .header__action
        .header__search
          .icon.icon--left.icon-search
          InputText(type='text' placeholder='Search')
        .btn__filter(:class="{'active': isShowFilter}")
          .btn-toggle(@click="isShowFilter = !isShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh()
            .icon.icon-rotate-left.bg-white
        Button.btn.btn-primary(class="drop-option" @click="isShowOptionAddNote = !isShowOptionAddNote")
          .icon.icon-add-items
          span ADD NOTE
          ul.option-note-list(:class="{'active': isShowOptionAddNote}")
            li.option-item Add Box
            li.option-item Add Item
        Button.btn.btn-primary()
          span EXPORT FILE
    .grid.header__filter.mt-1(:class='{ "active": isShowFilter }')
      div(class="col-12 lg:col-12 xl:col-4")
        .grid
          div(class="col-12 md:col-3")
            FilterTable(title="NOTE ID" :value="filter.id" placeholder="Enter ID" name="id" :searchText="true" @updateFilter="handleFilter")
          div(class="col-12 md:col-9")
            .grid.grid-nogutter
              .col
                  FilterCalendar(
                    title="From"
                    border="left"
                    :value="filter.dateFrom"
                    name="dateFrom"
                    inputClass="border-0"
                    dateFormat="dd-mm-yy"
                    :showIcon="true"
                    @updateFilter="handleFilter")
              .col.ml-1
                  FilterCalendar(
                  title="To"
                  border="right"
                  :value="filter.dateTo"
                  name="dateTo"
                  inputClass="border-0"
                  dateFormat="dd-mm-yy"
                  :showIcon="true"
                  @updateFilter="handleFilter")
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Warehouse"
          :value="filter.warehouse"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter")
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Check Type"
          :value="filter.status"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter") 
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Result"
          :value="filter.status"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter") 
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Status"
          :value="filter.status"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter") 
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
const nsWarehouseStock = namespace('warehouse/warehouse-list')
const nsStoreStockTake = namespace('stock-take/note-list')
const dayjs = require('dayjs')

@Component
class StockTake extends Vue {
  isShowFilter: boolean = false
  isShowOptionAddNote: boolean = false
  filter: any = {
    id: null,
    dateFrom: null,
    dateTo: null,
    warehouse: null,
    sellerEmail: null,
    creatorId: null,
    status: null
  }

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreStockTake.State
  stockTakeList!: any

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreStockTake.Action
  actGetStockTakeList!: () => Promise<void>

  handleFilter(e: any, name: string) {
    this.filter[name] = e
  }

  getParamApi() {
    return {
      params: {
        'id': this.filter.id || null,
        'sellerEmail': this.filter.sellerEmail || null,
        'creatorId': this.filter.creatorId || null ,
        'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
        'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
        'status': this.filter.status?.value,
        'warehouseId': this.filter.warehouse?.id
      }
    }
  }

  mounted() {
    this.actWarehouseList()
  }
}

export default StockTake
</script>
<style scoped lang="sass">
  .stock__take
    @include flex-column
    @include mobile
      min-height: calc(100vh - 32px)
    @include tablet
      min-height: calc(100vh - 32px)
    @include desktop
      height: calc(100vh - 32px)
    ::v-deep.p-component
      font-family: $font-family-primary
    ::v-deep.pi-calendar:before
      content: url('~/assets/icons/calendar.svg')
    ::v-deep.p-calendar-w-btn
      .p-button
        background: none
        border: none
    &__header
      flex-direction: column
      flex-wrap: wrap
      margin-bottom: 24px
      @include desktop
        flex-direction: row
        @include flex-center-space-between
    .header__action
      display: flex
      margin-top: 12px
      @include flex-column
      flex-wrap:  wrap
      gap: 10px 16px
      @include desktop
        @include flex-center
        flex-direction: row
        margin-top: 0
    .drop-option
      position: relative
      overflow: unset
      .option-note-list
        display: none
        color: $text-color-base
        padding-left: 0
        margin: 0
        position: absolute
        background-color: $color-white
        top: 110%
        border-radius: 4px
        width: 100%
        left: 0
        z-index: 10
        list-style-type: none
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px

        &.active
          display: block

        .option-item
          padding: 12px 0
          border-bottom: 1px solid #dee2e6
          transition: all 0.25 ease
          &:hover
            background-color: $primary
            color: $color-white
</style>