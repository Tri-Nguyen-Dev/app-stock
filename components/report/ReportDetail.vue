<template lang="pug">
div
  span.report-close(@click="hideModalDetail")
    i.pi.pi-times
  div.report-heading
      div.report-title
        h3 Report Detail
        h3 ID {{ reportDetail.id }}
  div.report-content
    .main-info
      .info-creator.text-center
        .info-item.font-semibold
          span.info-title Creator ID:
          span.info-content(v-if="reportDetail.createdBy") {{ reportDetail.createdBy.id }}
        .info-item.font-semibold
          span.info-title Creator Time:
          span.info-content {{ reportDetail.createdAt }}
        .info-item.font-semibold
          span.info-title PIC ID: 
          span.info-content(v-if="reportDetail.createdBy") {{ reportDetail.createdBy.staffId }}
    .info-box.p-3
      .info-box-item.py-3.border-top-1.border-gray-300(v-for="item in reportDetail.boxNote")
        .box-code
          h3.mt-0.mb-0 BOX CODE:
          span.table__status.table__status--available {{ item.status }}
          p.mt-2
            NuxtLink(:to="`/box/${item.box.id}`") {{ item.box.id }}
          .info-seller
            h3.mt-2.mb-0.text-base Seller Information:
            .info-item
              span.info-title Email:
              span.info-content(v-if="item.box.request") {{  item.box.request.seller.email }}
            .info-item
              span.info-title Phone:
              span.info-content(v-if="item.box.request") {{  item.box.request.seller.phoneNumber }}
            .info-item
              span.info-title Name: 
              span.info-content(v-if="item.box.request") {{  item.box.request.seller.displayName }}
        .box-note-id
          h3.mt-0.mb-2.uppercase ST Note ID:
          NuxtLink(:to="`/box/${item.box.id}`") {{ item.box.id }}
        .box-note
          h3.mt-0.mb-2 NOTE:
          p.text-primary.m-0 {{ item.note }}
      
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class ReportDetail extends Vue {
  @Prop() readonly boxReportDetail!: any
  @Prop() readonly reportDetail!: any

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
