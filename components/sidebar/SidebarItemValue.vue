<template lang="pug">
  .item-value(:class="{ 'active': active, 'child-item': !!item.parentId, 'flex-column': item.childrens }"
    :style="{ background: item.isChild ? 'unset' : null }" @mouseenter="mouseover(item)" @mouseleave="mouseleave()")
    ul.item-collapsed.p-2.active-child(v-if='collapsed && parentItems.length > 0'
      :class="{ 'item-setting': item.id === 200 }" 
    )
      li.mb-1(v-for="parent in parentItems" :key="parent.id")
        nuxt-link.item-collapsed__children(
          :class="{ 'link-active': parent.id === selectedId }" 
          v-if="parent.to" :to="parent.to"
        ) {{parent.label}}
        .item__label.item-collapsed__parent(v-else :class="{ 'active': isShowChild(parent) }" @click="select(parent)")
          span {{ parent.label }}
          span.icon.toggle.icon-chevron-down.surface-500(:class="iconSelectCssClasses")
          ul.item-collapsed.p-2.active-child(v-if='collapsed && parent.childrens.length > 0')
            li.mb-1(v-for="child in parent.childrens" :key="child.id")
              nuxt-link.item-collapsed__children(
                :class="{ 'link-active': child.id === selectedId }" 
                v-if="child.to" :to="child.to"
              ) {{child.label}}
    .item__icon(v-if="!!item.icon" :class="{ 'icon_collapsed': collapsed }")
      .icon(:class="`icon-${item.icon} ${iconMenuCssClasses} ${'icon--large'}`")
    transition(name="fade")
      .item__label(v-if="!collapsed && !item.isChild" 
        :class="{ 'pl-16': !!item.parentId, 'last-item': item.isLast && !item.isChild }"
      )
        div.item__children(v-if="item.parentId")
        div.item__rect(v-if="item.parentId")
        span {{ item.label }}
        span.icon.toggle.icon-chevron-down.surface-500(:class="iconSelectCssClasses")
        Badge.mr-2.badge-notify(v-if="item.label === 'Notifications'" :value="3")
      .item__label.justify-content-end(v-if="!collapsed && item.isChild" 
        :class="{ 'pl-16': !!item.parentId }")
        div.item__children(v-if="item.parentId")
        div.item_child(:class="{ 'active': active }")
          div.item__children(v-if="item.parentId"  :class="{ 'last-item': item.isLast }")
          div.item__rect(v-if="item.parentId")
          span {{ item.label }}
          span.icon.toggle.icon-chevron-down.surface-500(:class="iconSelectCssClasses")
</template>

<script lang='ts'>

import { Component, InjectReactive, namespace, Prop, Vue } from 'nuxt-property-decorator'
import { MENU_ACTION, PAGE_MENU, SETTING_MENU } from '~/utils'
const nsSidebar = namespace('layout/store-sidebar')

@Component
class SidebarItemValue extends Vue {
  // -- [ Statement Properties ] ----------------------------------------------------------
  @nsSidebar.State('collapsed')
  collapsed!: boolean

  pageMenu = PAGE_MENU
  settingMenu = SETTING_MENU
  parentItems: any = []

  @Prop() readonly item!: any | undefined
  @InjectReactive() readonly selectedItem!: any
  @InjectReactive() readonly selectParent!: any

  // -- [ Getters ] -----------------------------------------------------------------------

  get active() {
    const subParent = _.find(this.pageMenu, (o) => (o.id === this.selectedItem?.parentId ))
    return subParent?.parentId === this.item.id || subParent?.id === this.item.id || this.item.id === this.selectedItem?.id
  }

  get iconMenuCssClasses() {
    return this.active ? 'bg-primary' : ''
  }

  get iconSelectCssClasses() {
    let clazz = !this.item.to ? '' : '-rotate-90'
    if (this.active && !!this.item.to) {
      clazz += ' bg-primary'
    } else if (this.active) {
      clazz += ' surface-900'
    }
    if (this.item.hideToggled) {
      clazz += ' toggle-none'
    }
    return clazz
  }

  get selectedId() {
    return this.selectedItem?.id
  }

  mouseover(item) {
    const listMenu = item.label === 'Setting' ? this.settingMenu : this.pageMenu
    if(!item.parentId) {
      this.parentItems = []
      listMenu.forEach(value => {
        if(value.parentId === item.id) {
          const childrens = _.filter(listMenu, (o) => {
            return o.parentId === value.id
          })
          this.parentItems.push({
            ...value,
            childrens
          })
        }
      })
    }
  }

  mouseleave() {
    this.parentItems = []
  }

  isShowChild(parent) {
    return parent.id === this.selectedItem.parentId
  }

  select(item) {
    if (item.action === MENU_ACTION.LOGOUT) {
      this.$auth.logout()
    }
  }
}

export default SidebarItemValue
</script>

<style lang="sass" scoped>
.toggle-none
  display: none

.sidebar-foot
  .badge-notify
    border-radius: 3px
    background-color: $bg-orange
.menu-item
  .nuxt-link-active
    .item-value
      border-radius: 4px
      background-color: $text-color-300
.child-item
  margin-left: 32px
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
    // .item-collapsed

    &::before
      content: ""
      position: absolute
      border-radius: 0 5px 5px 0
      left: -16px
      width: 6px
      height: 35px
      background-color: $primary

  .item-collapsed
    position: absolute
    top: 40px
    width: 230px
    background-color: $color-white
    border: 1px solid $bg-body-base
    box-shadow: 0px 10px 30px rgba(0, 10, 24, 0.1)
    border-radius: 8px
    &.active-child
      display: block
      z-index: 1
    li
      list-style: none
    .item-collapsed__parent, .item-collapsed__children
      padding: 1rem 0 1rem 1.5rem
      &:hover
        border-radius: 4px
        background-color: $text-color-300

    .item-collapsed__children
      display: block
      text-decoration: none
      color: $text-color-900
      &.link-active
        background: $primary
        color: $color-white
        border-radius: 4px
    .item-collapsed__parent
      position: relative
      .active-child
        top: 0
        left: 210px
        display: none
        z-index: 2
      &:hover
        .active-child
          display: block
    .active
      background-color: $text-color-300
      border-radius: 4px
  .item-setting
    top: -80px !important

  &:hover, &.active
    border-radius: 4px
    background-color: $text-color-300

  .item__label
    @include flex-center-space-between
    width: 100%
    min-height: 56px
    .item_child
      min-height: 56px
      width: calc(100% - 20px)
      align-items: center
      display: flex
      justify-content: space-between
      padding-left: $space-size-8
      .item__rect, .item__children
        left: 8px
      .last-item
        height: calc(50% - 10px)
    .active
      background-color: $text-color-300
      border-radius: 4px

  .item__icon
    padding: $space-size-16 $space-size-8

  .icon_collapsed
    padding: $space-size-18

  .item__icon, .item__parent-link
    min-height: 56px

  .toggle
    margin-right: $space-size-12

.pl-16
  padding-left: $space-size-8
</style>
