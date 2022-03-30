<template>
  <div class="menu-item">
    <router-link :to="to" class="link">
      <div class="icon icon--large icon--left" :class="icon"></div>
      <transition name="fade">
        <div v-if="!collapsed" class="item-label">
          <slot />
        </div>
      </transition>
    </router-link>
  </div>
</template>

<script lang='ts'>

import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
const nsSidebar = namespace('layout/store-sidebar')

@Component
class SidebarItem extends Vue {
  @Prop(String) readonly to!:   string | undefined

  @Prop(String) readonly icon!: string | undefined

  @nsSidebar.State('collapsed')
  collapsed!: boolean

}

export default SidebarItem
</script>

<style lang="sass" scoped>
.menu-item
  height: 56px
  margin-bottom: 4px
  font-size: 16px
  font-weight: bold
.item-label
  padding-left: 48px
.fade-enter-active,
.fade-leave-active
  transition: opacity 0.1s


.fade-enter,
.fade-leave-to
  opacity: 0


.link
  display: flex
  align-items: center

  cursor: pointer
  position: relative
  font-weight: 400
  user-select: none

  margin: 0.1em 0
  padding: 0.4em
  border-radius: 0.25em
  height: 1.5em

  text-decoration: none


.link:hover
  background-color: $primary


.link.active
  background-color: $primary


.link .icon
  flex-shrink: 0
  width: 25px
  margin-right: 10px

</style>
