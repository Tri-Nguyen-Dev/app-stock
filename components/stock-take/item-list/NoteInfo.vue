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
.stock
  @include tablet
    // margin: 50px
  ::v-deep.sub-tab
    height: calc(100vh - 150px)
    overflow: hidden
    display: flex
    flex-direction: column
    @include desktop
      height: calc(100vh - 32px)
      max-width: 23rem
      overflow: hidden
    .sub--scroll
      display: flex
      align-items: center
      flex-direction: column
      flex: 1
      overflow: auto
      @include desktop
        overflow: auto
      @include tablet
        flex-direction: row
        justify-content: center
        align-items: baseline
        overflow: hidden

::-webkit-input-placeholder
  font-weight: normal

::-webkit-scrollbar
  width: 7px
  height: 7px
  background-color: #F5F5F5

::-webkit-scrollbar-track
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
  border-radius: 10px
  background-color: #F5F5F5

::-webkit-scrollbar-thumb
  border-radius: 10px
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
  background-color: #979AA4

.wrap-unit
  width: 300px
  margin-bottom: 16px

::v-deep.stock-takeItem
  min-height: calc(100vh - 32px)
  margin-top: 3rem
  @include desktop
    margin-top: 0px
    margin-left: 2rem
    height: calc(100vh - 32px)
  &__header
    flex-direction: column
    flex-wrap: wrap
    margin-bottom: 16px
    @include desktop
      flex-direction: row
      @include flex-center-space-between
    &--action
      margin-top: 12px
      display: flex
      @include flex-column
      flex-wrap:  wrap
      gap: 10px 16px
      @include desktop
        @include flex-center
        flex-direction: row
        margin-top: 0
  &__filter
    margin-bottom: $space-size-24
  &__content
    flex: 1
    border-radius: 4px
    position: relative
    overflow: hidden
  &__note
    border-left: 1px solid var(--gray-300)!important
  &__footer
    background: $color-white
    display: flex
    justify-content: space-between
    padding: 6px 8px
    align-items: center
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
    .table__action
      float: right
  .disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
  .pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  .p-calendar-w-btn
    .p-button
      background: none
      border: none
</style>
