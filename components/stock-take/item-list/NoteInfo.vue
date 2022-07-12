<template lang="pug">
  CommonTabDetail(:homeItem="homeItem" :breadcrumbItem="breadcrumbItem")
    template(v-slot:title)
      .col.px-0.flex
        .icon-box-info.icon.bg-primary.mr-2
        span.font-bold.text-800 NOTE DETAIL
      .col.px-0(v-if="noteInfor.id")
        span.p-2.font-bold NOTE ID: {{ noteInfor.id }}
      .col.px-0.status-note
        span.p-2.table__status.table__status--available {{ noteInfor.status | trimUnderShift }}
        span( v-if='noteInfor.status === "COMPLETED" ')
          tag.p-2.table__status.table__status--error(
            v-if='noteInfor.finalResultStatus === "NG"') {{ noteInfor.finalResultStatus  }}
          tag.p-2.table__status.table__status--available(
            v-else-if='noteInfor.finalResultStatus === "OK"') {{ noteInfor.finalResultStatus  }}
      .col.border-bottom-1.border-gray-300
    template(v-slot:content)
      .grid.m-0.mt-3
        .col-12.px-0.stock--info.p-2.m-0
          .col-12.px-0.flex.align-items-center
            .icon-sender-info.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase ID Information
          .col-12.px-0(v-for="creator of noteInfor.creatorInfo" v-if="creator")
            StockUnit.m-0(:title="creator.title" :value='creator.value || "N/A"' :icon='creator.icon')
          .col.border-bottom-1.border-gray-300
        .col-12.px-0.stock--contact.p-2.m-0(v-if="noteInfor.sellerInfo")
          .col-12.px-0.flex.align-items-center
            .icon-sender-info.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase Seller Information
          .col-12.px-0(v-for="seller of noteInfor.sellerInfo")
            StockUnit.m-0(:title="seller.title" :value='seller.value || "N/A"' :icon="seller.icon")
          .col.border-bottom-1.border-gray-300
        .col-12.px-0.stock--contact.p-2.m-0(v-if="noteInfor.notes && noteInfor.notes.length > 0")
          .col-12.px-0.flex.align-items-center
            .icon.icon-note.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase Note
          .col-12.px-0(v-for="note of noteInfor.notes" v-if="note")
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
</style>
