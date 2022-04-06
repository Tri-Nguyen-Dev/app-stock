<template lang="pug">
  .menu-item.font-bold.flex-row(:class="{ 'active': active }")
    .item-parent-link(v-if="!!item.parentId")
    router-link(v-if="!!item.to" :to="item.to")
      SidebarItemValue(:item="item", :active="active")
    div(v-else)
      SidebarItemValue(:item="item", :active="active")
</template>

<script lang='ts'>

import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
const nsSidebar = namespace('layout/store-sidebar')

@Component
class SidebarItem extends Vue {
  // -- [ Statement Properties ] ------------------------------------------------
  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @Prop() readonly item!: any | undefined
  @Prop(Boolean) readonly active!: boolean | undefined
  @Prop(Boolean) readonly hasChild: boolean = false
}

export default SidebarItem
</script>

<style lang="sass" scoped>
.item-parent-link
  width: 40px
  height: 40px

.ml-40
  margin-left: 40px
</style>
