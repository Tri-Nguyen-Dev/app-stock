<template>
  <div class="menu-item font-bold" :class="{ 'active': active }">
    <router-link :to="to" class="link">
      <div class="item-icon">
        <div v-if="!!icon" class="icon icon--large" :class="icon"></div>
      </div>
      <transition name="fade">
        <div v-if="!collapsed" class="item-label">
          <slot />
          <span class="icon icon-chevron-down" :class="{ 'surface-500': !hasChild }"></span>
        </div>
      </transition>
    </router-link>
  </div>
</template>

<script lang='ts'>

import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator';
const nsSidebar = namespace('layout/store-sidebar');

@Component
class SidebarItem extends Vue {

  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @Prop(String) readonly to!:   string | undefined

  @Prop(String) readonly icon: string | undefined

  @Prop(Boolean) readonly active!: boolean | undefined

  @Prop(Number) readonly level!: number | undefined

  @Prop(Boolean) readonly hasChild: boolean = false
}

export default SidebarItem;
</script>

<style lang="sass" scoped>
.menu-item
  height: 60px

  &:hover, &.active
    border-radius: 4px
    background-color: $text-color-300

  .link
    @include flex-center-vert
    height: 100%
    color: $text-color-base
    font-size: $font-size-medium
    font-weight: $font-weight-bold
    padding: $space-size-16 $space-size-18
    cursor: pointer
    position: relative
    user-select: none
    text-decoration: none
  .item-label
    @include flex-center-space-between
    width: 100%
    margin-left: $space-size-16
  .item-icon
    margin-right: 2px
</style>
