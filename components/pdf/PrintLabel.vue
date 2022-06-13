<template lang="pug">
  Dialog.print-label(:visible.sync="visibleVue" :modal="true")
    div(v-if='labelUrlLabel')
      pdf.pdf-viewer-container(
        v-if="!isAllPage"
        :src='labelUrlLabel',
        :page="page"
        :style="btnStyles"
        ref="pdfOnePage"
      )
      pdf.pdf-viewer-container.mb-2(
        v-else
        v-for="(page, index) in pageCount"
        :key="index"
        :src="labelUrlLabel"
        :page="index + 1"
        :style="btnStyles"
        ref="pdfAllPage"
      )
    template(#header)
      Dropdown.print-label__page(
        placeholder="Select page"
        v-model="pageSelect"
        :options="pages"
        optionLabel="name"
        @change="handelChangePage"
      )
      .grid.print-label__buttons
        .col
          Button(@click='handleZoomOut')
            .icon--large.icon--center.icon-zoom-out
        .col
          Button(@click='handleZoomIn')
            .icon--large.icon--center.icon-zoom-in
        .col
          Button.bg-primary(@click="handlePrinter")
            .icon--large.icon--center.icon-printer.bg-white
        .col
          Button(@click="handleDownload")
            .icon--large.icon--center.icon-download-label
</template>
<script lang="ts">
import { Component, Vue, Prop, namespace, Ref, Watch } from 'nuxt-property-decorator'
import pdf from 'vue-pdf'
import { exportFileTypePdf } from '~/utils'
const nsStoreLabel = namespace('stock-in/request-label')
const nsStoreOrder = namespace('stock-out/order-detail')

@Component({
  components: {
    pdf
  }
})
class PrintLabel extends Vue {
  pageSelect = { name: 'All Page', page: -1 }
  pageCount: number = 0
  page = 1
  zoom = 80
  @Prop({ default: false }) displayLable!: boolean
  @Prop({ default: '' }) requestId!: string
  @Prop({ default: '' }) DOId!: string
  @Prop({ default: '' }) boxIds!: any
  @Prop({ default: '' }) type!: any
  @Ref('pdfOnePage') readonly pdfOnePage!: any
  @Ref('pdfAllPage') readonly pdfAllPage!: any

  @Watch('displayLable')
  getLabelBox() {
    if(this.displayLable) {
      this.callApiLabel({
        id: this.requestId || this.DOId
      })
    }
  }

  get pages() {
    const pages = [{ name: 'All Page', page: -1 }]
    if(this.pageCount > 0) {
      for(let i = 1; i <= this.pageCount; i++){
        pages.push({ name: `Page ${i}`, page: i })
      }
    }
    return pages
  }

  get visibleVue() {
    return this.displayLable
  }

  set visibleVue(value) {
    this.$emit('setShow', value)
  }

  @nsStoreLabel.State
  labelUrl!: any

  @nsStoreOrder.State
  packingLabelUrl!: any

  @nsStoreLabel.Action
  actGetLabel!: (params: any) => Promise<void>

  @nsStoreOrder.Action
  actGetPackingLabel!: (params: any) => Promise<void>

  async callApiLabel({ id }) {
    let result: any = null
    if(this.requestId && !this.type) {
      result = await this.actGetLabel({ id })
    } else {
      result = await this.actGetPackingLabel({
        params: { id, boxIds: this.boxIds },
        type: this.type
      })
    }
    if(result) {
      const src = pdf.createLoadingTask(result)
      if(src){
        src.promise.then(({ _pdfInfo }) => {
          this.pageCount = _pdfInfo.numPages
        })
      }
    }
  }

  handelChangePage({ value }) {
    this.page =  value.page
  }

  get isAllPage() {
    return this.pageSelect.page === -1
  }

  get btnStyles() {
    return {
      width: `${this.zoom}%`
    }
  }

  handleZoomOut() {
    if(this.zoom === 0) return
    this.zoom -= 10
  }

  handleZoomIn() {
    this.zoom += 10
  }

  handlePrinter() {
    if (this.pdfOnePage) {
      this.pdfOnePage.print(150, [this.page])
    } else {
      this.pdfAllPage[0].print()
    }
  }

  handleDownload() {
    if(this.labelUrl) {
      exportFileTypePdf(this.labelUrl, `${this.requestId}`)
    }
  }

  get labelUrlLabel() {
    if(this.requestId) {
      return this.labelUrl
    } else {
      return this.packingLabelUrl
    }
  }
}

export default PrintLabel
</script>

<style lang="sass" scoped>
::v-deep.print-label
  .pdf-viewer-container
    margin: 0 auto
  .p-dialog-header, .p-dialog-content
    background: $text-color-400
    padding: $space-size-24
    width: 600px
  .p-dialog-content
    height: 70vh
  &__buttons
    .p-button
      color: $text-color-900
      background: $color-white
      border: none
      height: 56px
      width: 56px
      border-radius: 2rem
  .p-dialog-header
    &-icons
      width: 56px
      justify-content: center
    &-icon
      color: $text-color-900
  &__page
    border-radius: 2rem
    height: 48px
    width: 117px
    padding-left: $space-size-10
    padding-right: $space-size-10
    .p-dropdown-label
      line-height: 2
      display: flex
      align-items: center
</style>
