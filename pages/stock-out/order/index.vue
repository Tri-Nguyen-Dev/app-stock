<template lang="pug">
  .grid.grid-nogutter.h-full
    .col-3.bg-white.sub-tab
      Breadcrumb(:home="homeItem" :model="breadcrumbItem")
      StockOutLabelCreate
    .col-9.ml-5
      .grid.grid-nogutter.h-full.flex.flex-column
        .col-12.justify-content-between.flex
          div
            h1.text-heading Item list
            span.text-subheading product found
          div
            .btn.btn-primary(@click='createStockIn')
              .icon.icon-add-items.surface-900.bg-white
              span.text-900.text-white.mr-3 Add Items For Delivery
        .col-12.flex-1
          DataTable.w-full.flex.flex-column.table__sort-icon.bg-white(
            :resizableColumns='true',
            :value='[]',
            dataKey='id',
            :row-hover='true',
            responsiveLayout='scroll',
            :scrollable="false"
          )
            template(#empty)
              .flex.align-items-center.justify-content-center.flex-column
                img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
                p.text-900.font-bold.mt-3 List is empty!
            column(field='no', header='NO')
              template(#body='slotProps')
                span.font-bold {{ slotProps.index + 1 }}
            column(
              field='stock.imageUrl',
              header='IMAGE',
              :sortable='true',
              filter-match-mode='contains'
            )
              template(#body='slotProps')
                img(
                  :src='slotProps.data.stock.imageUrl',
                  :alt='slotProps.data.stock.image',
                  style='width: 3rem; height: 3rem'
                )
            column.text-overflow-ellipsis(
              field='stock.barCode',
              header='BARCODE',
              :sortable='true',
              :show-filter-match-modes='false'
            )
              template(#body='{ data }')
                span.text-primary.font-bold {{ data.stock.barCode }}
            column(field='sku', header='SKU', sortable='', data-type='numeric')
              template(#body='{ data }')
                span.uppercase {{ data.sku }}
            column(field='stock.name', header='NAME', :sortable='true')
              template(#body='{ data }')
                span.font-bold.text-right {{ data.stock.name }}
              template(#body='{ data }')
                span.font-bold.text-primary.text-right {{ data.location.name }}
            column(field='box.barCode', header='BOXCODE', :sortable='true')
              template(#body='{ data }')
                span.font-bold.text-right {{ data.box.barCode }}
            column(
              field='amount',
              header='QUANTITY',
              :sortable='true',
              headerClass='grid-header-right'
            )
              template(#body='{ data }')
                .font-bold.grid-cell-right {{ data.amount }}
            column(field='tag', header='TAG', headerClass='grid-header-center')
              template(#body='{ data }')
                .grid-cell-center
                  Checkbox(v-model='data.tag', :binary='true', :disabled='isDetail')
            Column(
              :exportable='false',
              header='ACTION',
              className='p-text-right',
            )
              template(#body='{ data }')
                Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200(
                  :disabled='data.itemStatus == "ITEM_STATUS_DISABLE"',
                  @click='editItemDetail(data.id)'
                )
                  .icon--small.icon-btn-edit
                Button.border-0.p-0.ml-1.h-2rem.w-2rem.justify-content-center.surface-200(
                  @click='showModalDelete(data.id)',
                  :disabled='data.itemStatus === "ITEM_STATUS_DISABLE"'
                )
                  .icon--small.icon-btn-delete
            template(#footer)

</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { INFORMATION } from '~/utils'
const nsStoreCreateOrder = namespace('stock-out/create-order')

@Component({
})
class createOrder extends Vue {

  @nsStoreCreateOrder.State
  listInfor1:any

  @nsStoreCreateOrder.Action
  actGetCreateOrder!: (obj: any) => Promise<void>

  infomation = INFORMATION

  get homeItem() {
    return { to: '/stock-out', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      {
        label: 'Add new order',
        to: '/stock-out/create-order',
        icon: 'pi pi-info-circle'
      }
    ]
  }

  async createStockIn() {
    await this.actGetCreateOrder(
      _.cloneDeep(this.infomation)
    )
    _.forEach(this.infomation, function(obj){
      _.forEach(obj, function(o){
        if(_.has(o, 'disabled')) {
          _.set(o, 'disabled' , !o.disabled)
        }
      })
    })
  }  
  
}

export default createOrder
</script>

<style lang="sass">
.grid 
  .sub-tab
    height: calc(100vh - 32px)
    background-color: #ffffff
    border-radius: var(--border-radius)
    height: 100%
    overflow: auto
    max-width: 24rem
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
</style>
