<template lang="pug">
  .bg-white.border-round-top.sub-tab(class='col-12 md:col-12 lg:col-4 xl:col-3')
    .border-bottom-1.border-gray-300.flex
      Breadcrumb(:home='homeItem', :model='breadcrumbItem')
    .border-bottom-1.border-gray-300
    .grid.flex.flex-column.p-2.m-0
      .col.flex
        .icon-box-info.icon.bg-primary.mr-2
        span.font-bold.text-800 NOTE DETAIL
      .col(v-if="noteInfor.id")
        span.p-2.font-bold NOTE ID: {{ noteInfor.id }}
      .col
        span.p-2.table__status.table__status--available {{ noteInfor.status | trimUnderShift }}
      .col.border-bottom-1.border-gray-300
    .sub--scroll
      .grid.w-full
        .col-12.stock--info.p-2.m-0
          .col-12.flex.align-items-center
            .icon-sender-info.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase ID Information
          .col-12(v-for="creator of noteInfor.creatorInfo" v-if="creator")
            StockUnit.m-0(:title="creator.title" :value='creator.value || "N/A"' :icon='creator.icon')
          .col.border-bottom-1.border-gray-300
        .col-12.stock--contact.p-2.m-0(v-if="noteInfor.sellerInfo")
          .col-12.flex.align-items-center
            .icon-sender-info.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase Seller Information
          .col-12(v-for="seller of noteInfor.sellerInfo")
            StockUnit.m-0(:title="seller.title" :value='seller.value || "N/A"' :icon="seller.icon")
          .col.border-bottom-1.border-gray-300
        .col-12.stock--contact.p-2.m-0(v-if="noteInfor.notes && noteInfor.notes.length > 0")
          .col-12.flex.align-items-center
            .icon.icon-note.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase Note
          .col-12(v-for="note of noteInfor.notes" v-if="note")
            .grid.grid-nogutter.wapprer-note.m-0
              .col-12.font-semibold {{ `${note.position}: ${note.author}` }}
              .col-12 Note: {{ note.value }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class NoteInfo extends Vue {
  @Prop({ default: null }) noteInfor: any
  @Prop({ default: null }) homeItem: any
  @Prop({ default: null }) breadcrumbItem: any
}

export default NoteInfo
</script>
<style lang="sass" scoped>
::v-deep.sub-tab
  .p-menuitem-link
    display: flex !important
  .wapprer-note
    width: 100%
    min-height: 72px
    border-radius: 4px
    background-color: $text-color-200
    padding: 12px
</style>
