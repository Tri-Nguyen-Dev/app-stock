<template lang="pug">
div
  div.report-heading
      span.report-status.table__status.table__status--available SOLVING
      div.report-title
        h3 Report Detail
        h3(v-if="reportDetail") ID {{ reportDetail.id }}
      span.report-close(@click="hideModalDetail")
        i.pi.pi-times
  div.report-content
    .main-info
      .info-creator
        .info-item
          span.info-title Creator ID:
          span.info-content 
        .info-item
          span.info-title Creator Time:
          span.info-content 19-09-2022 9:24AM
        .info-item
          span.info-title Stock-take Note ID: 
          span.info-content ST12222222
        .info-item
          span.info-title PIC ID: 
          span.info-content NV66666
      .info-seller
        h3.mt-0 Seller Information:
        .info-item
          span.info-title Email:
          span.info-content ndk@gmail.com
        .info-item
          span.info-title Phone:
          span.info-content 0396675767
        .info-item
          span.info-title Name: 
          span.info-content Nguyễn Đình Khoa
    .info-box(v-if="boxReportDetail")
      .box-code
        h3(v-if="boxReportDetail.box") BOX CODE: {{ boxReportDetail.box.id }}
        h3
      .box-note
        h3 NOTE:
        p {{ boxReportDetail.note }}
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class ReportDetail extends Vue {
  @Prop() readonly reportDetail!: any
  @Prop() readonly boxReportDetail!: any

  hideModalDetail() {
    this.$emit('closeModal')
  }
}

export default ReportDetail
</script>