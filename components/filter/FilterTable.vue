<template lang="pug">
  .bg-white.border-round
    div.pt-2.pl-3.pb-1
      span.text-600.font-sm {{title}}
    span.p-input-icon-right.w-full
      .icon.icon--right.icon-search.surface-900.icon--absolute
      InputText.border-0.w-full.mb-1(v-if="searchText" type="text" :placeholder="placeholder" :value="value" @input="handleFilter") 
      Dropdown.w-full.border-0.mb-1(v-else-if="options"  :options="options" optionLabel="name" placeholder="Select" v-model="value" @input="handleFilter")
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class FilterTable extends Vue {
  value: any = ''

  @Prop() readonly title!: any | undefined
  @Prop() readonly searchText!: boolean | false
  @Prop() readonly options!:any | undefined
  @Prop() readonly placeholder!:string | undefined
  @Prop() readonly name!: any | undefined

  handleFilter(e :any){
    this.$emit('updateFilter', e, this.name)
  }
  
}

export default FilterTable
</script>
<style scoped lang="sass"> 
  ::v-deep.p-inputtext 
    box-shadow: none !important
</style>