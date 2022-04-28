<template lang="pug">
  .grid.flex.grid-nogutter.h-full
    .col-fixed
      .btn.btn-primary(@click='createStockIn')
      .icon.icon-add-items.surface-900.bg-white
      span.text-900.text-white.mr-3 Add Items For Delivery
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
})
class createOrder extends Vue {

  get homeItem() {
    return { to: '/stock-out', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      {
        label: 'Add new order',
        to: '/stock-out/create-order',
        icon: 'pi pi-info-circle'
      }
    ]
  }

  createStockIn() {
    this.$router.push('/stock-out/order')
  }

}

export default createOrder
</script>

<style lang="sass">
.grid 
  .sub-tab
    height: calc(100vh - 32px)
    background-color: #ffffff
    border-radius: var(--border-radius)
    height: 100%
    overflow: auto
    // padding: 1.5rem
    max-width: 24rem
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
</style>
