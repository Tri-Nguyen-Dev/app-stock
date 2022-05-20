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
        InputNumber.w-7rem(:value="valueStock(data.quantity)" mode="decimal" :min="0"
          :max="maxQuantity(data)" inputClass="w-full"
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
  @InjectReactive() readonly listOriginalBox!: any
  @InjectReactive() readonly listOutGoingBox!: any
  @InjectReactive() readonly listTranfferingBox!: any
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

  sumQuantity(data) {
    const list = this.type === 'tranferringBox' ? this.listTranfferingBox : this.listOutGoingBox
    const boxNotActive = _.partition(list, { 'boxCode': this.boxCode })[1]
    const sumNotActive = _.partition(_.flatten(_.map(boxNotActive, 'items')), {
      barCode: data.barCode, originalBox: data.originalBox
    })[0]
    const sum =_.sumBy(sumNotActive, o => {
      return o.quantity
    })
    return sum
  }

  maxQuantity(data) {
    const box = _.find(this.listOriginalBox, { boxCode: data.originalBox })
    const stock = _.find(box.items, { barCode: data.barCode })
    const { initialQuantity, outGoingQuantity } = stock
    if(this.type === 'tranferringBox') {
      return initialQuantity - outGoingQuantity - this.sumQuantity(data)
    } else {
      return outGoingQuantity - this.sumQuantity(data)
    }
  }

  changeQuantity(data, event) {
    const sum = this.sumQuantity(data)
    const box = _.find(this.listOriginalBox, { boxCode: data.originalBox })
    const stock = _.find(box.items, { barCode: data.barCode })
    if(stock.initialQuantity - stock.outGoingQuantity - sum - event >= 0 && this.type === 'tranferringBox') {
      _.set(data, 'quantity', event)
      _.set(stock, 'actualTranffering', event + sum)
      _.set(stock, 'quantity', stock.initialQuantity - sum - event - stock.actualOutGoing)
    } else if(this.type === 'outGoingBox' && stock.outGoingQuantity - sum - event >= 0) {
      _.set(data, 'quantity', event)
      _.set(stock, 'actualOutGoing', event + sum)
      _.set(stock, 'quantity', stock.initialQuantity - sum - event - stock.actualTranffering)
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
    const list = this.type === 'tranferringBox' ? this.listTranfferingBox : this.listOutGoingBox
    const box = _.find(list, { boxCode: this.boxCode })
    _.remove(box.items, function({ barCode, originalBox }) {
      return stockDelete.barCode === barCode && originalBox === stockDelete.originalBox
    })
    this.changeQuantity(stockDelete, 0)
    this.isModalDelete = false
  }

  handleCancel() {
    this.isModalDelete = false
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'box')
  }

  valueStock(quantity) {
    return this.isModalDelete ? 0 : quantity
  }
}

export default PackingTableList
</script>
<style lang="sass">
.packing__detail--table
  height: 166px !important
  .row-outgoing
    background-color: $text-color-100 !important
</style>
