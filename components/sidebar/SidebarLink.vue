<!--<template>-->
<!--  <router-link :to="to" class="link" :class="{ active: isActive }">-->
<!--    <i class="icon" :class="icon" />-->
<!--    <transition name="fade">-->
<!--      <span v-if="!collapsed">-->
<!--        <slot />-->
<!--      </span>-->
<!--    </transition>-->
<!--  </router-link>-->
<!--</template>-->

<!--<script lang='ts'>-->

<!--import { Component, Prop, Vue } from 'nuxt-property-decorator'-->

<!--@Component-->
<!--class SidebarLink extends Vue {-->
<!--  @Prop(String) readonly to!:   string | undefined-->

<!--  @Prop(String) readonly icon!: string | undefined-->
<!--}-->

<!--export default SidebarLink-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--@use "assets/styles/variables" as *;-->
<!--.fade-enter-active,-->
<!--.fade-leave-active {-->
<!--  transition: opacity 0.1s;-->
<!--}-->

<!--.fade-enter,-->
<!--.fade-leave-to {-->
<!--  opacity: 0;-->
<!--}-->

<!--.link {-->
<!--  display: flex;-->
<!--  align-items: center;-->

<!--  cursor: pointer;-->
<!--  position: relative;-->
<!--  font-weight: 400;-->
<!--  user-select: none;-->

<!--  margin: 0.1em 0;-->
<!--  padding: 0.4em;-->
<!--  border-radius: 0.25em;-->
<!--  height: 1.5em;-->

<!--  color: white;-->
<!--  text-decoration: none;-->
<!--}-->

<!--.link:hover {-->
<!--  background-color: $primary;-->
<!--}-->

<!--.link.active {-->
<!--  background-color: $primary;-->
<!--}-->

<!--.link .icon {-->
<!--  flex-shrink: 0;-->
<!--  width: 25px;-->
<!--  margin-right: 10px;-->
<!--}-->
<!--</style>-->
