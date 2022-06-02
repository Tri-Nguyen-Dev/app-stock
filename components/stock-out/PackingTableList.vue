<template lang="pug">
div
  DataTable.packing__detail--table(
    :class="{ 'table-wrapper-empty': !value || value.length <= 0 }"
    responsiveLayout="scroll"
    dataKey='id'
    :rowHover='true'
    :value='value'
    :rowClass="rowClass"
  )
    Column(field='no' header='NO' :styles="{'width': '1%'}" )
      template(#body='{ index }')
        span.font-semibold {{ getIndexPaginate(index) }}
    Column(field='imageUrl' header='IMAGE' :styles="{'width': '1%'}" headerClass="grid-header-center")
      template(#body='{ data }')
        .overflow-hidden.grid-cell-center
          img.h-2rem.w-2rem.border-round(
            :src="data.imagePath | getThumbnailUrl" alt='' width='100%' style="object-fit: cover;")
    Column(
      header='BARCODE'
      field='barCode'
      :sortable="true"
      headerClass="grid-header-right"
      :styles="{'width': '10%'}"
      )
      template(#body='{ data }')
        .grid-cell-right {{ data.barCode }}
    Column(
      header='SKU'
      field='sku'
      :sortable="true"
      headerClass="grid-header-right"
      :styles="{'width': '5%'}"
    )
      template(#body='{ data }')
        .grid-cell-right {{ data.sku }}
    Column(header='STOCK NAME' field='name' :sortable="true")
      template(#body='{ data }')
        .text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
    Column(
      header='TAG'
      field='hasAirtag'
      :sortable="true"
      :styles="{'width': '1%'}"
      v-if='type === "originalBox"'
    )
      template(#body='{ data }')
        .text-right {{ data.hasAirtag | checkHasTag }}
    Column(
      header='ORIGINAL BOX CODE'
      field='originalBox'
      :sortable="true"
      :styles="{'width': '5%'}"
      v-if='type !== "originalBox"'
    )
    Column(
      header='QUANTITY'
      field='quantity'
      :sortable="true"
      :styles="{'width': '1%'}"
    )
      template(#body='{ data }')
        InputNumber.w-7rem(:value="data.quantity" mode="decimal" :min="0"
          :max="maxQuantity(data)" inputClass="w-full" :disabled='data.originalBox !== originalBoxActive.boxCode'
          v-if='type !== "originalBox" && !isPackingDetail' @input='handleQuantity(data, $event)'
        )
        .text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden.text-right(v-else) {{ data.quantity }}
    Column(
      header='OUTGOING QUANTITY'
      field='outGoingQuantity'
      :sortable="true"
      :styles="{'width': '1%'}"
      v-if='type === "originalBox"'
    )
      template(#body='{ data }')
        .text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden.text-right {{ data.outGoingQuantity }}
    ConfirmDialogCustom(
      title="Confirm delete"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteStock"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
      :key="componentKey"
    )
      template(v-slot:message)
        p {{ deleteMessage }}

</template>
<script lang="ts">
import { Component, Vue, Prop, InjectReactive } from 'nuxt-property-decorator'
import { PAGINATE_DEFAULT,calculateIndex, getDeleteMessage } from '~/utils'
import { Paging } from '~/models/common/Paging'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'

@Component({
  components: {
    ConfirmDialogCustom
  }
})
class PackingTableList extends Vue {
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  isModalDelete: boolean = false
  loadingSubmit: boolean = false
  onEventDeleteList: any = []
  componentKey: number = 0
  @Prop() value!: Array<any>
  @Prop() readonly type!: string | undefined
  @Prop() readonly boxCode!: string | undefined
  @Prop() readonly isPackingDetail!: boolean | false
  @InjectReactive() readonly originalBoxActive!: any
  originalList: {} = {}

  getIndexPaginate(index: number) {
    return calculateIndex(
      index,
      this.paging.pageNumber,
      this.paging.pageSize
    )
  }

  rowClass(data: any) {
    return data.outGoingQuantity <= 0 ? 'row-outgoing' : ''
  }

  getStockInOriginal({ barCode }) {
    return _.find(this.originalBoxActive.items, { barCode })
  }

  getSumQuantityOtherBox(actualOutGoing: number, quantity: number) {
    return actualOutGoing - quantity
  }

  maxQuantity({ barCode, quantity }) {
    const stockInOriginal = this.getStockInOriginal({ barCode })
    if(stockInOriginal) {
      const { outGoingQuantity, actualOutGoing } = stockInOriginal
      const sum = this.getSumQuantityOtherBox(actualOutGoing, quantity)
      return outGoingQuantity - sum
    }
  }

  changeQuantity(stock, textValue) {
    const stockInOriginal = this.getStockInOriginal(stock)
    if(stockInOriginal) {
      const { initialQuantity, outGoingQuantity, actualOutGoing } = stockInOriginal
      const sum = this.getSumQuantityOtherBox(actualOutGoing, stock.quantity)
      if(outGoingQuantity - sum - textValue >= 0) {
        _.set(stock, 'quantity', textValue)
        _.set(stockInOriginal, 'actualOutGoing', textValue + sum)
        _.set(stockInOriginal, 'quantity', initialQuantity - sum - textValue)
      }
    }
  }

  handleQuantity(data, event) {
    if(!_.isNil(event)) {
      if(!event) {
        this.onEventDeleteList = [data]
        this.isModalDelete = true
      } else {
        this.changeQuantity(data, event)
      }
    }
  }

  handleDeleteStock() {
    const stockDelete = this.onEventDeleteList[0]
    this.$emit('handleDeleteStock', stockDelete, this.boxCode)
    this.changeQuantity(stockDelete, 0)
    this.isModalDelete = false
  }

  handleCancel() {
    this.isModalDelete = false
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'box')
  }
}

export default PackingTableList
</script>
<style lang="sass">
.packing__detail--table
  height: 100% !important
  .row-outgoing
    background-color: $text-color-100 !important
</style>
