<template lang="pug">
  ItemList
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ItemList from '~/components/stock-out/item/ItemList.vue'

@Component({
  components:{
    ItemList
  }
})
class Pages extends Vue {}

export default Pages
</script>
<style lang="sass">
</style>
