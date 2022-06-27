<template lang="pug">
  .bg-white.border-round.wrapper-filter.px-2
    div.pt-2.pb-1.title
      span.text-600.font-sm {{title}}
    span.p-input-icon-right.w-full
      i(v-if="value && isClear" class="pi pi-times clear" @click.stop="clearValue")
      .icon--small.icon--right.icon-search.surface-900.icon--absolute(v-if="isClear")
      InputText.border-0.w-full.mb-1(
        v-if="searchText" type="text"
        :value="value"
        @input="validateText"
        ref="inputFilter"
      )
      Dropdown.w-full.border-0(
        v-else-if="options"
        :options="options"
        optionLabel="name"
        :value="value"
        @input="handleFilter"
        :disabled="!isClear"
      )
      slot(name="multi-select")
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
@Component
class FilterTable extends Vue {
  @Prop() value!: any | undefined
  @Prop() readonly title!: any | undefined
  @Prop() readonly searchText!: boolean
  @Prop() readonly options!:any | undefined
  @Prop() readonly placeholder!:string
  @Prop() readonly name!: any | undefined
  @Prop() readonly isShowFilter!: boolean | false
  @Prop({ default: true }) isClear: boolean

  validateText =  _.debounce(this.handleFilter, 500);

  handleFilter(e :any){
    this.$emit('updateFilter', e, this.name)
  }

  clearValue() {
    this.$emit('updateFilter', '', this.name)
  }

  @Watch('isShowFilter')
  autofocusInput() {
    if(this.$refs.inputFilter && this.isShowFilter) {
      const inputRef = this.$refs.inputFilter as any
      this.$nextTick(() =>  inputRef?.$el.focus())
    }
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
      color: $text-color-900
      font-weight: 500
      box-shadow: none !important
      &:hover
        box-shadow: 0 0 0 0.1rem #486AE2 !important
      &.p-placeholder
        color: $text-color-700
    .pi-times.clear
      z-index: 1
      right: 2.5rem  !important
      cursor: pointer
    ::v-deep.p-input-icon-right .p-inputtext
      padding-right: 4rem

</style>
