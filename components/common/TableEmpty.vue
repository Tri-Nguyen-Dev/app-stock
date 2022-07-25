<template lang="pug">
  .table-empty
    img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!isNotFound")
    img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
    p.text-900.font-bold.mt-3(v-if="!isNotFound") List is empty!
      span(v-if="isAddNew") , Click
        span.text-primary.underline.cursor-pointer(@click='routeLinkAddBox') &nbsp;here
        span &nbsp;to add item.
    p.text-900.font-bold.mt-3(v-else) Item not found!
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator' 

@Component
class TableEmpty extends Vue {
  @Prop({ default: false }) isNotFound: boolean
  @Prop({ default: true }) isAddNew: boolean

  routeLinkAddBox() {
    this.$emit('addNew')
  }
}

export default TableEmpty
</script>

<style lang="sass" scoped>
.table-empty
  @include flex-center
  flex-direction: column
</style>
