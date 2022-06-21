<template lang="pug">
  .bg-white.border-round-top.sub-tab(class='col-12 md:col-12 lg:col-4 xl:col-3')
    .grid.flex.align-items-center.p-2.m-0
      .col-12.flex
        Button(@click='$router.go(-1)').p-button-link.pl-0
          .icon-arrow-left.icon.bg-primary.align-items-center
        Breadcrumb(:home='homeItem', :model='breadcrumbItem')
    .border-bottom-1.border-gray-300
    .grid.flex.flex-column.p-2.m-0
      .col.flex
        .icon-box-info.icon.bg-primary.mr-2
        span.font-bold.text-700 {{ noteLabel }}
      .col(v-if="noteInfor.id")
        span.p-2.font-bold NOTE ID: {{ noteInfor.id }}
      .col
        span.p-2.table__status.table__status--available {{ noteInfor.status }}
      .col.border-bottom-1.border-gray-300
    div.sub--scroll
      .grid.stock--info.p-2.m-0
        .col-12.flex
          .col.flex.align-items-center
            .icon-sender-info.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase ID Information
        .col-12
          StockUnit.m-0(title="Create Time" :value='createTime' icon="icon-receipt-note")
        .col-12
          StockUnit.m-0(title="Creator ID" :value='noteInfor.creator.creatorID || "N/A"' icon="icon-tag-user")
        .col-12
          StockUnit.m-0(title="Warehouse"  :value='noteInfor.creator.warehouse || "N/A"' icon="icon-warehouse")
        .col-12
          StockUnit.m-0(title="Items" :value='noteInfor.totalItem || "N/A"' icon="icon-frame")
        .col.border-bottom-1.border-gray-300
      .grid.stock--contact.p-2.m-0(v-if="noteInfor.seller")
        .col-12.flex
          .col.flex.align-items-center
            .icon-sender-info.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase Seller Information
        .col-12
          StockUnit.m-0(title="Name" :value='noteInfor.seller.sellerName || "N/A"' icon="icon-sender-name")
        .col-12
          StockUnit.m-0(title="Email" :value='noteInfor.seller.sellerEmail || "N/A"' icon="icon-sender-email")
        .col-12
          StockUnit.m-0(title="Phone" :value='noteInfor.seller.sellerPhone || "N/A"' icon="icon-sender-phone")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
const dayjs = require('dayjs')

@Component
class NoteInfo extends Vue {
  @Prop({ default: null }) noteInfor: any
  @Prop({ default: null }) homeItem: any
  @Prop({ default: null }) breadcrumbItem: any

  get noteLabel() {
    return _.last(this.breadcrumbItem).label
  }

  get createTime() {
    const date = this.noteInfor.creator.createdAt
    return date ? dayjs(new Date(date)).format('YYYY-MM-DD') : 'N/A'
  }
}

export default NoteInfo
</script>
<style lang="sass" scoped>
</style>
