<template lang="pug">
  .item-value(:class="{ 'active': active }")
    .item__icon(v-if="!!item.icon")
      .icon.icon--large(:class="`icon-${item.icon}`")
    transition(name="fade")
      .item__label(v-if="!collapsed")
        span {{ item.label }}
        span.icon.toggle.icon-chevron-down(:class="{ 'surface-500': !active }")
</template>

<script lang='ts'>

import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
const nsSidebar = namespace('layout/store-sidebar')

@Component
class SidebarItem extends Vue {
  // -- [ Statement Properties ] ----------------------------------------------------------
  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @Prop() readonly item!: any | undefined

  @Prop(Boolean) readonly active!: boolean | undefined
}

export default SidebarItem
</script>

<style lang="sass" scoped>
.item-value
  @include flex-center-vert
  height: 100%
  color: $text-color-base
  font-size: $font-size-medium
  font-weight: $font-weight-bold
  cursor: pointer
  position: relative
  user-select: none
  text-decoration: none

  &:hover, &.active
    border-radius: 4px
    background-color: $text-color-300

  .item__label
    @include flex-center-space-between
    width: 100%
  .item__icon
    padding: $space-size-16

  .item__icon, .item__parent-link
    min-height: 56px

  .toggle
    margin-right: $space-size-20
</style>
