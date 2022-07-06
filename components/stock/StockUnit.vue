<template lang="pug">
.grid.wapprer-unit(:class='isEdit && !model ? "opacity-40" : "opacity-100"')
  .col-2.flex.align-items-center.justify-content-center
    .icon--large.bg-blue-700(:class='icon')
  .col-10.flex.flex-column.justify-content-center
    div.font-normal.text-700.text-base {{ title }}
      slot(name='button-size')
    a(v-if="link" :href="link" target="_blank").text-link.text-blue-500
      span.font-bold.text-base {{value}}
      .icon.icon-arrow-up-right.inline-block.bg-blue-500
    span.font-bold.text-lg.mr-1.uppercase(v-else class="text-wrap") {{ value }}
    template(v-if="model")
      InputNumber.text-lg(v-if='isEdit' :value='model' @input="handleUpdateUnit")
      span.font-bold.text-lg.mr-1.uppercase(v-else class="text-wrap") {{ model }}
    slot(name='size')
    slot(name='auto-complete')
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class StockUnit extends Vue {
  @Prop() readonly name!: string | undefined
  @Prop() readonly value!: number | undefined
  @Prop() readonly title!: string | undefined
  @Prop() readonly isEdit!: boolean | false
  @Prop() readonly icon!: string | undefined
  @Prop() readonly link!: string | undefined
  @Prop() model!: number | undefined

  handleUpdateUnit(e: any){
    this.$emit('updateUnit', e, this.name)
  }
}

export default StockUnit
</script>
<style scoped lang="sass">
.wapprer-unit
  min-height: 72px
  border-radius: 4px
  background-color: $text-color-200
  .text-wrap
    word-break: break-all
  ::v-deep.p-inputtext
    border: none
    background: transparent
    padding: 0
    color: #000
    font-weight: 600
    box-shadow: none !important
    max-width: 100%
</style>
