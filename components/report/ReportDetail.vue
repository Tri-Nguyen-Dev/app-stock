<template lang="pug">
div
  div.report-heading
      span.report-status.table__status.table__status--available {{ boxReportDetail.status }}
      div.report-title
        h3 Report Detail
        h3 ID {{ boxReportDetail.id }}
      span.report-close(@click="hideModalDetail")
        i.pi.pi-times
  div.report-content
    .main-info
      .info-creator
        .info-item
          span.info-title Creator ID: {{ boxReportDetail.createId }}
          span.info-content 
        .info-item
          span.info-title Creator Time:
          span.info-content {{ boxReportDetail.createdAt }}
        .info-item
          span.info-title Stock-take Note ID: 
          span.info-content 
            NuxtLink(to="/") {{ boxReportDetail.boxNote.id }}
        .info-item
          span.info-title PIC ID: 
          span.info-content {{ picId }}
      .info-seller
        h3.mt-0 Seller Information:
        .info-item
          span.info-title Email:
          span.info-content {{ sellerEmail }}
        .info-item
          span.info-title Phone:
          span.info-content {{ phoneNumber }}
        .info-item
          span.info-title Name: 
          span.info-content {{ displayName }}
    .info-box
      .box-code
        h3 BOX CODE:
          NuxtLink(:to="`/box/${boxReportDetail.boxNote.box.id}`" class="ml-2") {{ boxReportDetail.boxNote.box.id }}
      .box-note
        h3 NOTE:
        p {{ boxReportDetail.boxNote.note }}
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class ReportDetail extends Vue {
  @Prop() readonly boxReportDetail!: any

  get sellerEmail() {
    return this.boxReportDetail?.boxNote?.box?.request?.seller?.email
  }

  get phoneNumber() {
    return this.boxReportDetail?.boxNote?.box?.request?.seller?.phoneNumber
  }

  get displayName() {
    return this.boxReportDetail?.boxNote?.box?.request?.seller?.displayName
  }

  get picId() {
    return this.boxReportDetail?.boxNote?.box?.createdBy?.staffId
  }

  hideModalDetail() {
    this.$emit('closeModal')
  }
}

export default ReportDetail
</script>
