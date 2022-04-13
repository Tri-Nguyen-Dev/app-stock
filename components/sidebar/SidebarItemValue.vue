<template lang="pug">
   .item-value(:class="{ 'active': active, 'child-item': !!item.parentId }")
    ul.item-collapsed.p-2(v-if='collapsed && parentItems.length > 0' :class="{'active-child': isShowChildren}")
      li(v-for="parent in parentItems" :key="parent.id" @click.stop="handleSelect")
        nuxt-link.item-collapsed__children.py-3.pl-4(:to="parent.to") {{parent.label}}
    .item__icon(v-if="!!item.icon")
      .icon.icon--large(:class="`icon-${item.icon} ${iconMenuCssClasses}`")
    transition(name="fade")
      .item__label(v-if="!collapsed" :class="{ 'pl-16': !!item.parentId, 'last-item': item.isLast }")
        div.item__children(v-if="item.parentId")
        div.item__rect(v-if="item.parentId")
        span {{ item.label }}
        span.icon.toggle.icon-chevron-down.surface-500(:class="iconSelectCssClasses")
        Badge.mr-2.badge-notify(v-if="item.label ==='Notifications'" :value="3")
</template>

<script lang='ts'>

import { Component, InjectReactive, namespace, Prop, Vue, Watch } from 'nuxt-property-decorator'
const nsSidebar = namespace('layout/store-sidebar')

@Component
class SidebarItemValue extends Vue {
  isShowChildren: Boolean = false
  // -- [ Statement Properties ] ----------------------------------------------------------
  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @Prop() readonly item!: any | undefined
  @InjectReactive() readonly selectedItem!: any
  @InjectReactive() readonly parentItems!: any
  
  @Watch('active')
  resetActive() {
    this.isShowChildren = this.active
  }

  @Watch('collapsed')
  showChild(){
    if(!this.collapsed) {
      this.isShowChildren = false
    }
  }
  // -- [ Getters ] -----------------------------------------------------------------------
 
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
  
  handleSelect() {
    this.isShowChildren = false
  }
}

export default SidebarItemValue
</script>

<style lang="sass" scoped>
.sidebar-foot
  .toggle 
    display: none
  .badge-notify
    border-radius: 3px
    background-color: $bg-orange
.menu-item 
  .nuxt-link-active 
    .item-value 
      border-radius: 4px
      background-color: $text-color-300
.child-item
  margin-left: 40px
  .item-collapsed
    display: none !important
  &::before
    display: none
  .item__label
    position: relative
    &.last-item
      .item__children
        height: calc(50% - 10px)
    .item__children
      position: absolute
      top: -4px
      left: -20px
      height: calc(100% + 8px)
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
  .item-collapsed 
    display: none
  &.active 
   .item-collapsed
     &.active-child 
       display: block
     position: absolute
     top: 40px
     width: 230px
     background-color: $color-white
     border: 1px solid $bg-body-base
     box-shadow: 0px 10px 30px rgba(0, 10, 24, 0.1)
     border-radius: 8px
     z-index: 111
     li 
      list-style: none
     .item-collapsed__children 
       display: block
       text-decoration: none
       color: $text-color-900
       &:hover 
        border-radius: 4px
        background-color: $text-color-300
       &.nuxt-link-active 
        background: $primary
        color: $color-white
        border-radius: 4px
       
   &::before 
    content:""
    position: absolute
    border-radius: 0 5px 5px 0
    left: -16px
    width: 6px
    height: 35px
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
