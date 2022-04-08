<template lang="pug">
  .item-value(:class="{ 'active': active, 'child-item': !!item.parentId }")
    .item__icon(v-if="!!item.icon")
      .icon.icon--large(:class="`icon-${item.icon} ${iconMenuCssClasses}`")
    transition(name="fade")
      .item__label(v-if="!collapsed" :class="{ 'pl-16': !!item.parentId, 'last-item': item.isLast }")
        div.item__children(v-if="item.parentId")
        div.item__rect(v-if="item.parentId")
        span {{ item.label }}
        span.icon.toggle.icon-chevron-down.surface-500(:class="iconSelectCssClasses")
</template>

<script lang='ts'>

import { Component, InjectReactive, namespace, Prop, Vue } from 'nuxt-property-decorator'
const nsSidebar = namespace('layout/store-sidebar')

@Component
class SidebarItem extends Vue {
  // -- [ Statement Properties ] ----------------------------------------------------------
  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @Prop() readonly item!: any | undefined
  @InjectReactive() readonly selectedItem!: any

  get active() {
    return this.item.id === this.selectedItem?.id || this.item.id === this.selectedItem?.parentId
  }

  get iconMenuCssClasses() {
    return this.active ? 'bg-primary' : ''
  }
  
  get iconSelectCssClasses() {
    let clazz = !this.item.parentId ? '' : '-rotate-90'
    if (this.active && !!this.item.parentId) {
      clazz += ' bg-primary'
    } else if (this.active) {
      clazz += ' surface-900'
    }
    return clazz
  }
}

export default SidebarItem
</script>

<style lang="sass" scoped>

.child-item
  margin-left: 40px
  &::before 
    display: none
  .item__label 
    position: relative
    &.last-item 
      .item__children 
        height: calc(50% - 10px)
    .item__children 
      position: absolute
      top: 0
      left: -20px
      height: 100%
      width: 2px
      background-color: $bg-body-base
    .item__rect 
      position: absolute
      left: -20px
      top: 4px
      width: 20px
      height: 50%
      border-bottom: 2px solid $bg-body-base
      border-left: 2px solid $bg-body-base
      border-bottom-left-radius: 16px
.item-value
  @include flex-center-vert
  height: 100%
  position: relative
  color: $text-color-base
  font-size: $font-size-medium
  font-weight: $font-weight-bold
  &.active 
   &::before 
    content:""
    position: absolute
    border-radius: 0px 5px 5px 0px
    left:-16px
    width: 6px
    height:35px
    background-color: $primary
  &:hover, &.active
    border-radius: 4px
    background-color: $text-color-300

  .item__label
    @include flex-center-space-between
    width: 100%
    min-height: 56px
  .item__icon
    padding: $space-size-16

  .item__icon, .item__parent-link
    min-height: 56px

  .toggle
    margin-right: $space-size-20

.pl-16
  padding-left: $space-size-16
</style>
