<template lang="pug">
  .menu-item.flex-row.pt-1(v-show="isShow" @click="select(item)")
    nuxt-link(v-if="!!item.to" :to="item.to" @click.native="toggleMenu")
      SidebarItemValue(:item="item")
    div(v-if="!item.to")
      SidebarItemValue(:item="item")
</template>

<script lang='ts'>

import { Component, Emit, InjectReactive, namespace, Prop, Vue } from 'nuxt-property-decorator'
const nsSidebar = namespace('layout/store-sidebar')

@Component
class SidebarItem extends Vue {
  // -- [ Statement Properties ] ------------------------------------------------
  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @Prop() readonly item!: any | undefined
  @InjectReactive() readonly selectedItem!: any
  @InjectReactive() readonly selectParent!: any

  @Emit()
  select(item) {
    return item
  }
  
  toggleMenu() {
    this.$emit('toggleMenu')
  }

  // -- [ Getters ] -------------------------------------------------------------
  get isShow() {
    return _.includes(this.selectParent, this.item.parentId) || !this.item.parentId
  }
}

export default SidebarItem
</script>

<style lang="sass" scoped>
.menu-item
  cursor: pointer

.item-parent-link
  width: 40px
  height: 40px

a
  cursor: pointer
  position: relative
  user-select: none
  text-decoration: none

.ml-40
  margin-left: 40px
</style>
