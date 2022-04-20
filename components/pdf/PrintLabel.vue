<template lang="pug">
  Dialog.print-label(:visible.sync="visibleVue" :modal="true")
    div(v-if='labelUrl')
      pdf(
        v-if="!isAllPage"
        :src='labelUrl',
        :page="page"
        class="pdf-viewer-container"
        :style="btnStyles"
        ref="pdfOnePage"
      )
      pdf(
        v-else
        v-for="(page, index) in pageCount"
        :key="index"
        :src="labelUrl"
        :page="index + 1"
        class="pdf-viewer-container"
        :style="btnStyles"
        ref="pdfAllPage"
      )
    template(#header)
      Dropdown.print-label__page(placeholder="Select page" v-model="pageSelect" :options="pages" optionLabel="name" @change="handelChangePage")
      .grid.print-label__buttons
        .col
          Button.header-button(@click='handleZoomOut')
            .icon--large.icon--center.icon-zoom-out
        .col
          Button.header-button(@click='handleZoomIn')
            .icon--large.icon--center.icon-zoom-in
        .col
          Button.header-button.bg-primary(@click="handlePrinter")
            .icon--large.icon--center.icon-printer.bg-white
        .col
          Button.header-button(@click="handleDownload")
            .icon--large.icon--center.icon-download-label
</template>
<script lang="ts">
import { Component, Vue, Prop, namespace, Ref } from 'nuxt-property-decorator'
import pdf from 'vue-pdf'
const nsStoreLabel = namespace('stock-in/request-label')

@Component({
  components: {
    pdf
  }
})
class PrintLabel extends Vue {
  @Prop({ default: false }) isShow!: boolean

  @Ref('pdfOnePage') readonly pdfOnePage!: any
  @Ref('pdfAllPage') readonly pdfAllPage!: any
  pageSelect = { name: 'All Page', page: -1 }
  pageCount: number = 0
  page = 1
  zoom = 80

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
    return this.isShow
  }

  set visibleVue(value) {
    this.$emit('setShow', value)
  }

  @nsStoreLabel.State
  labelUrl!: any

  @nsStoreLabel.Action
  actGetLabel!: (params: any) => Promise<void>

  async mounted() {
    const result: any = await this.actGetLabel({ id: 'RN000000000001', boxId: 'psuh1w1r60hcozh3uof77fv0' })
    if(result) {
      const src = pdf.createLoadingTask(result)
      if(src){
        src.promise.then(({ _pdfInfo }) => {
          this.pageCount = _pdfInfo.numPages
        })
      }
    }
  }

  handelChangePage({ value }){
    this.page =  value.page
  }

  get isAllPage(){
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
    const link = this.labelUrl
    const a = document.createElement('a')
    a.setAttribute('download', 'fileName')
    a.setAttribute('href', link)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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
    min-height: 60vh
  &__buttons
    .header-button
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
    min-width: 115px
    padding-left: $space-size-10
    padding-right: $space-size-10
    .p-dropdown-label
      line-height: 2
      display: flex
      align-items: center
</style>
