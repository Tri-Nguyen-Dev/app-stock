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
        .col-12(v-for="creator of noteInfor.creatorInfo" v-if="creator")
          StockUnit.m-0(:title="creator.title" :value='creator.value || "N/A"' :icon='creator.icon')
        .col.border-bottom-1.border-gray-300
      .grid.stock--contact.p-2.m-0(v-if="noteInfor.sellerInfo")
        .col-12.flex
          .col.flex.align-items-center
            .icon-sender-info.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase Seller Information
        .col-12(v-for="seller of noteInfor.sellerInfo")
          StockUnit.m-0(:title="seller.title" :value='seller.value || "N/A"' :icon="seller.icon")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class NoteInfo extends Vue {
  @Prop({ default: null }) noteInfor: any
  @Prop({ default: null }) homeItem: any
  @Prop({ default: null }) breadcrumbItem: any

  get noteLabel() {
    return _.last(this.breadcrumbItem).label
  }
}

export default NoteInfo
</script>
<style lang="sass" scoped>
</style>
