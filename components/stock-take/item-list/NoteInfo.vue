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
        span.font-bold.text-700 Note Items Detail
      .col
        span.p-2.table__status.table__status--available New
      .col.border-bottom-1.border-gray-300
    div.sub--scroll
      .grid.stock--info.p-2.m-0
        .col-12.flex
          .col.flex.align-items-center
            .icon-sender-info.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase ID Information
        .col-12
          StockUnit.m-0(title="Creator ID " :value="user.staffId"  icon="icon-tag-user")
        .col-12
          StockUnit.m-0(title="Warehouse"  :value="user.warehouse.name" icon="icon-warehouse")
        .col-12
          StockUnit.m-0(title="Items" :value="totalItem" icon="icon-frame")
        .col.border-bottom-1.border-gray-300
      .grid.stock--contact.p-2.m-0
        .col-12.flex
          .col.flex.align-items-center
            .icon-sender-info.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase Seller Information
        .col-12
          StockUnit.m-0(title="Name" :value="sellerInfo.sellerName" icon="icon-sender-name")
        .col-12
          StockUnit.m-0(title="Email" :value="sellerInfo.sellerEmail" icon="icon-sender-email")
        .col-12
          StockUnit.m-0(title="Phone" :value="sellerInfo.sellerPhone" icon="icon-sender-phone")
</template>

<script lang="ts">
import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
import { User } from '~/models/User'
const nsStoreUser = namespace('user-auth/store-user')

@Component
class NoteInfo extends Vue {
  @Prop({ default: 0 }) totalItem: number
  @Prop({ default: null }) sellerInfo: any
  
  @nsStoreUser.State
  user: User.Model | undefined

  get homeItem() {
    return { label: 'Note list', to: '/stock-take' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Add new note', to: '/stock-take/item' }
    ]
  }
}

export default NoteInfo
</script>
<style lang="sass" scoped>
</style>
