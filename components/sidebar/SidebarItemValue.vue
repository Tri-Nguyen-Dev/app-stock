<template lang="pug">
  <div>
    <div class="item-icon">
      <div v-if="!!icon" class="icon icon--large" :class="icon"></div>
    </div>
    <transition name="fade">
      <div v-if="!collapsed" class="item-label">
        <slot />
        <span class="icon toggle icon-chevron-down" :class="{ 'surface-500': !hasChild }"></span>
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>

import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
const nsSidebar = namespace('layout/store-sidebar')

@Component
class SidebarItem extends Vue {

  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @Prop(String) readonly to!:   string | undefined

  @Prop(String) readonly icon: string | undefined

  @Prop(Boolean) readonly active!: boolean | undefined

}

export default SidebarItem
</script>

<style lang="sass" scoped>
.menu-item
  &:hover, &.active
    border-radius: 4px
    background-color: $text-color-300

  .link
    @include flex-center-vert
    height: 100%
    color: $text-color-base
    font-size: $font-size-medium
    font-weight: $font-weight-bold
    cursor: pointer
    position: relative
    user-select: none
    text-decoration: none
  .item-label
    @include flex-center-space-between
    width: 100%
  .item-icon
    padding: $space-size-16

  .toggle
    margin-right: $space-size-20

.rotate
</style>
