<template lang="pug">
  .grid.mx-0
    div.w-5rem
    div.bg-white.p-4.mt-5.border-round-top.min-h-screen(class=' col-3  md:col-3 lg:col-3 xl:col-2')
      .flex.align-items-center
        Button(@click='backToBox').p-button-link
          .icon-arrow-left.icon--base.bg-primary.mr-3.align-items-center
        span.font-normal Box list  /  
        span.font-normal.text-primary &nbsp;  Box Detail
      .grid.flex.my-5
        .col.flex.align-items-center
          .icon-box-info.icon--base.bg-primary.mr-2
          span.font-bold.text-800(style='font-size: 18px' ) Box Detail
        .col-fixed
          Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200.shadow-none( @click="btnEdit" :class='isEditBox? "hidden " : "" ' )
            .icon-btn-edit.icon--base
          Button.border-1.p-0.h-2rem.w-5rem.justify-content-center.bg-primary.shadow-none(@click="btnEdit" :class='isEditBox? "" : "hidden"' )
            .icon-check-lg.icon--base.bg-white.mr-1
            span Save
      .col
        .my-5(:class='isEditBox? "opacity-40" : "opacity-100"')
          span.font-bold.text-white.bg-green-500.p-2.border-round AVAILABLE
        .font-bold.my-5
          .col(:class='isEditBox? "opacity-40" : "opacity-100"')
            span Box Code: 
              span.text-primary 2301321321
        .grid.align-items-center.m-0.p-2.border-round.surface-100.mb-2.py-3
          .col-fixed.mr-2
            .icon-receipt.bg-primary.icon--large
          div(class=' col-8  lg:col-12 xl:col-8')
            span.font-bold.text-600 Receipt note ID 
            .mt-1.flex.align-items-center
              InputText.p-0.w-7rem.font-bold.border-none.shadow-none.surface-100.text-900.uppercase(placeholder="NTH001"  :disabled='isEditBox == 0' )
        .grid.align-items-center.m-0.p-2.border-round.surface-100.mb-2.py-3(:class='isEditBox? "opacity-40" : "opacity-100"')
          .col-fixed.mr-2
            .icon-tag-user.bg-primary.icon--large
          div(class=' col-8  lg:col-12 xl:col-8')
            span.font-bold.text-600 Create ID
            .mt-1.flex.align-items-center
              span.font-bold NTH001
        .grid.align-items-center.m-0.p-2.border-round.surface-100.mb-2.py-3(:class='isEditBox? "opacity-40" : "opacity-100"')
          .col-fixed.mr-2
            .icon-warehouse.bg-primary.icon--large
          div(class=' col-8  lg:col-12 xl:col-8')
            span.font-bold.text-600 Warehouse
            .mt-1.flex.align-items-center
              span.font-bold NTH001
              .icon-arrow-up-right.icon--base
        .grid.align-items-center.m-0.p-2.border-round.surface-100.mb-2.py-3
          .col-fixed.mr-2
            .icon-location.icon--large.bg-primary
          div(class=' col-8  lg:col-12 xl:col-8')
            span.font-bold.text-600 Location
            .mt-1.flex.align-items-center
              InputText.p-0.w-10rem.font-bold.border-none.shadow-none.surface-100.text-900.uppercase(placeholder="R03-AA-02"  :disabled='isEditBox == 0' )
        .grid.align-items-center.m-0.p-2.border-round.surface-100.mb-2.py-3
          .col-fixed.mr-2
            .icon-calendar.icon--large.bg-primary
          div(class=' col-8  lg:col-12 xl:col-8')
            span.font-bold.text-600 Create Time
            .mt-1
              span.font-bold 19-09-2020 9:20AM
          div
        .grid.align-items-center.m-0.p-2.border-round.surface-100.mb-2.py-3
          .col-fixed.mr-2
            .icon-frame.icon--large.bg-primary
          div(class=' col-8  lg:col-12 xl:col-8')
            span.font-bold.text-600 Box Items
            .mt-1
              span.font-bold 1280
        .grid.align-items-center.m-0.p-2.border-round.surface-100.mb-2.py-3
          .col-fixed.mr-2
            .icon-dollar-square.icon--large.bg-primary
          div(class=' col-8  lg:col-12 xl:col-8')
            span.font-bold.text-600 Estimated inventory Fee
            .mt-1
              span.font-bold 20 $ PER DAY
    div(class=' col-7  md:col-7  lg:col-7 xl:col-9').m-3
      .grid.justify-content-between
        .col-fixed
          h1.m-0.mb-1 Box List
          span.text-600.text-sm(v-if="boxTest") {{boxTest.length}} products found
        .col-fixed
          .grid
            .col-fixed
              span.p-input-icon-left
                .icon.icon--left.icon-search-input.surface-900
                InputText.w-23rem.font-bold(type="text" placeholder="Search")
            .col-fixed
              Button.border-0.bg-white.w-7rem.shadow-none.border-primary(@click="isFilter = !isFilter")
                .icon-filter-btn.bg-primary.icon--base
                span.text-900.ml-3.text-primary Filter
      .grid.mt-2(v-if="isFilter")
          .col
            .bg-white.border-round
              div.pt-2.pl-1.pb-1
                span.text-600.text-sm.pl-2 SKU
              span.p-input-icon-right.w-full
                .icon.icon--right.icon-search-input.surface-900
                InputText.border-0.w-full.mb-1.text-900.font-bold(type="text" placeholder="SKU")
          .col
            .bg-white.border-round
              div.pt-2.pl-1.pb-1
                span.text-600.text-sm.pl-2 Bar code
              span.p-input-icon-right.w-full
                .icon.icon--right.icon-search-input.surface-900
                InputText.border-0.w-full.mb-1.text-900.font-bold(type="text" placeholder="Bar code")
          .col
            .bg-white.border-round
              div.pt-2.pl-1.pb-1
                span.text-600.text-sm.pl-2 Category
                Dropdown.w-full.border-0.mb-1.text-900.font-bold( optionLabel="name" placeholder="Select")
      .grid
        .col-12
          DataTable.p-datatable-customers.airtag-datatable(
            :resizableColumns='true',
            :rows='15',
            :value='boxTest'
            dataKey='id',
            :paginator='false',
            :row-hover='true',
            filterDisplay='menu',
            responsiveLayout="scroll"
            columnResizeMode="fit"
          )
            column(field='id', header='no', sortable='')
              template(#body="slotProps") 
                span.font-bold {{ slotProps.data.id }}
            column(
              field='',
              header='IMAGE',
              sortable='',
              filter-match-mode='contains'
            )
              template(#body="slotProps")
                img(:src="slotProps.data.image" :alt="slotProps.data.image" style="width:3rem; height: 3rem")
 
            column.text-overflow-ellipsis(
              field='barcode'
              header='BARCODE',
              sortable='',
              filter-field='representative',
              sort-field='representative.name',
              :show-filter-match-modes='false'
            )
              template(#body='slotProps')
                span.text-primary {{slotProps.data.barcode}}
            column(
              field='sku',
              header='SKU',
              sortable='',
              data-type='numeric'
            )
            column(
              field='name',
              header='NAME',
              sortable='', 
              )
                template(#body='slotProps')
                  span.font-bold {{slotProps.data.name}}
            column.text-right(
              field='quantity',
              header='QUANTITY',
              sortable='',
              :show-filter-match-modes='false'
            )
              template(#body='slotProps').text-right 
                span.font-bold.text-right {{slotProps.data.quantity}}
            column(
              field='unit',
              header='UNIT',
              sortable='',
              :show-filter-match-modes='false'
            )
              template(#body='slotProps')
                span.font-bold {{slotProps.data.unit}}
            column(
              field='size',
              header='SIZE',
              sortable='',
              :show-filter-match-modes='false'
            )
              template(#body='slotProps')
                span.font-bold {{slotProps.data.size}}
            column(
              field='weight',
              header='WEIGHT(KG)',
              sortable='',
              :show-filter-match-modes='false'
            )
              template(#body='slotProps')
                span.font-bold {{slotProps.data.weight}}
            column(
              field='category',
              header='CATEGORY',
              sortable='',
              :show-filter-match-modes='false'
            )
              template(#body='slotProps')
                span.font-bold {{slotProps.data.category}}
            template(#footer)
              div
                .flex.align-items-center
                  span.ml-3.text-400.font-size-small Showing 01 - 100 of 1280
              Paginator(:rows="20" :totalRecords="totalItemsCount").p-0

</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreSubmission = namespace('box/box-detail')

@Component
class boxDetail extends Vue {
  isFilter: boolean = false
  isEditBox: boolean = false
  totalItemsCount = 32
  @nsStoreSubmission.State
  boxTest!: any

  @nsStoreSubmission.Action
  actGetMasterData!: () => Promise<void>

  async mounted() {
    await this.actGetMasterData()
  }

  backToBox() {
    this.$router.push('/boxlist')
  }

  btnEdit() {
    this.isEditBox = !this.isEditBox
  }
}

export default boxDetail
</script>

<style lang="sass">
body
  background-color: #E8EAEF
  .pi-sort-alt:before
      content: url('~/assets/images/icon-sort.svg')
  .pi-sort-amount-up-alt:before
      content: url('~/assets/images/icon-sortDesc.svg')
  .pi-sort-amount-down:before
      content: url('~/assets/images/icon-sortAsc.svg')
  .p-column-header-content
    .p-column-title
      color: #464D64
      font-weight: 700
      text-transform: uppercase
      letter-spacing: 1px
  .p-datatable
    .p-datatable-thead
      tr
        th
          background: var(--surface-300)
  .p-paginator
    justify-content: end
    .p-paginator-first , .p-paginator-last
      display: none
    .p-paginator-element
      border: none
      color: var(--surface-900)
    .p-paginator-pages
      .p-paginator-page.p-highlight
        background-color: var(--surface-0)
        box-shadow: none
        color: var(--primary-color) !important
      .p-paginator-page.p-paginator-element
        font-weight:  bold
        border: none
        color: var(--surface-500)
  ::-webkit-input-placeholder
    color: var(--surface-900)
  .p-disabled, .p-component:disabled
    opacity: 1
</style>
