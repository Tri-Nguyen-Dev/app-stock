<template lang="pug">
  .bg-white.border-round-left.wrapper-filter
    div.pt-2.pb-1.title
      span.text-600.font-sm {{title}}
    Calendar.w-full.mb-1(@date-select="handleFilter" :value="value" :showIcon="showIcon" :inputClass="inputClass" :placeholder="placeholder || 'Select'" :dateFormat="dateFormat || 'dd-mm-yy'")
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class FilterTable extends Vue {

  @Prop() value!: any | undefined
  @Prop() readonly title!: any | undefined
  @Prop() readonly searchText!: boolean | false
  @Prop() readonly options!:any | undefined
  @Prop() readonly placeholder!:string | 'Select'
  @Prop() readonly name!: any | undefined
  @Prop() readonly dateFormat!: any | undefined
  @Prop() readonly inputClass!: any | undefined
  @Prop() readonly showIcon!: Boolean | false  
  handleFilter(e :any){
    this.$emit('updateFilter', e, this.name)
  }
  
}

export default FilterTable
</script>
<style scoped lang="sass"> 
  ::placeholder 
    color: $text-color-700
  .wrapper-filter
    @include flex-column
    height: 82px
    justify-content: center
    .title 
        margin-left: 12px
    ::v-deep.p-inputtext 
      box-shadow: none !important
      color: $text-color-900
      font-weight: 500
      box-shadow: none !important
      &.p-placeholder
        color: $text-color-700
    .pi-times.clear
      z-index: 1
      right: 2.5rem  !important
      cursor: pointer
    ::v-deep.p-input-icon-right .p-inputtext
      padding-right: 4rem
</style>