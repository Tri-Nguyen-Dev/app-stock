<template lang="pug">
  .bg-white.wrapper-filter(:class="`border-round-${border}`")
    div.pt-2.pb-1.title
      span.text-600.font-sm {{title}}
    span.p-input-icon-right.w-full
      i(v-if="value" class="pi pi-times clear" @click.stop="clearValue")
    Calendar.w-full.pl-2.mb-1(
      @date-select="handleFilter"
      :value="value"
      :showIcon="showIcon"
      :inputClass="inputClass"
      :dateFormat="dateFormat || 'dd-mm-yy'"
    )
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
  @Prop() readonly border!: string | undefined
  
  handleFilter(e :any){
    this.$emit('updateFilter', e, this.name)
  }
  
  clearValue() {
    this.$emit('updateFilter', null, this.name)
  }

}

export default FilterTable
</script>
<style scoped lang="sass">
  ::placeholder
    color: $text-color-700
  .wrapper-filter
    position: relative
    @include flex-column
    height: 82px
    justify-content: center
    .title
        margin-left: 12px
    ::v-deep.p-inputtext
      color: $text-color-900
      border-radius: 4px !important
      font-weight: 500
      box-shadow: none !important
      &:hover
        box-shadow: 0 0 0 0.1rem #486AE2 !important
      &.p-placeholder
        color: $text-color-700
    .pi-times.clear
      z-index: 1
      top: 18px !important
      right: 2.5rem  !important
      cursor: pointer
    ::v-deep.p-input-icon-right .p-inputtext
      padding-right: 4rem
</style>
