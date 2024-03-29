<template lang="pug">
div
  div.report-content
    .main-info
      .info-creator
        .info-item
          span.info-title Creator ID:
          span.info-content(v-if="reportDetail.createdBy") {{ reportDetail.createdBy | sellerName }}
        .info-item
          span.info-title Created time:
          span.info-content {{ reportDetail.createdAt | dateTime }}
    .info-box
      .info-box-item.py-3
        DataTable.w-full(
          :rowClass="rowClass" :value='reportDetail.boxNote' responsiveLayout="scroll"
          dataKey='box.id'
          :rows='10'
          :rowHover='true'
          :selection='selectedBox'
          @row-select-all="rowSelectAll"
          @row-unselect-all="rowUnSelectAll"
          @row-select="rowSelect"
          @row-unselect="rowUnselect"
        )
          Column(
            selectionMode='multiple'
            :styles="{'width': '1%'}"
          )
          Column(header='Box code' field='box.id' headerClass="grid-header-center" sortable)
            template(#body='{ data }')
              div
                NuxtLink.m-0(:to="`/box/${data.box.id}`") {{ data.box.id }}
                .info-seller
                  h3.mt-2.mb-0.text-base Seller Info:
                  .info-item
                    span.info-title Email:
                    span.info-content(v-if="data.box.request") {{  data.box.request.seller.email }}
                  .info-item
                    span.info-title Phone:
                    span.info-content(v-if="data.box.request") {{  data.box.request.seller.phoneNumber }}
                  .info-item
                    span.info-title Name: 
                    span.info-content(v-if="data.box.request") {{  data.box.request.seller.displayName }}
          Column(header='ST Note ID' field='stockTakeId' headerClass="grid-header-center" sortable)
            template(#body='{ data }')
              div.grid-cell-center 
                NuxtLink(:to="`/stock-take/box/${data.stockTakeId}/note-detail`") {{ data.stockTakeId }}
          Column(header='NOTE' :styles="{'width': '40%'}" field='note' headerClass="grid-header-center" sortable)
            template(#body='{ data }')
              div.grid-cell-center {{ data.note }}
    div.flex.justify-content-center
      Button.btn.btn-primary.my-2.py-1(@click="createStockTake" :disabled="disabledButton") Create stock-take note
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class ReportDetail extends Vue {
  @Prop() readonly reportDetail!: any

  selectedBox: any = []

  get selectedBoxFilter() {
    return  _.filter(this.selectedBox, (item: any) => {
      return !item.stockTakeId
    })
  }

  hideModalDetail() {
    this.$emit('closeModal')
  }

  rowClass(data: any) {
    return data.stockTakeId ? 'row-disable' : ''
  }

  rowSelectAll({ data }) {
    this.selectedBox = _.union(this.selectedBox, data)
  }

  rowUnSelectAll() {
    this.selectedBox = _.differenceWith(
      this.selectedBox,
      this.reportDetail.boxNote,
      _.isEqual
    )
  }

  rowSelect({ data }) {
    this.selectedBox.push(data)
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedBox = _.filter(
      this.selectedBox,
      (stock: any) => stock.id !== data.id
    )
  }

  get disabledButton() {
    if(!(this.selectedBoxFilter.length > 0)) {
      return 'disabled'
    }
    else return null
  }

  createStockTake() {
    this.$emit('createStockTakeFromDatail', this.selectedBoxFilter)
  }
}

export default ReportDetail
</script>
