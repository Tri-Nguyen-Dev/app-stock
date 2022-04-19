<template lang="pug">
.grid.surface-hover.wapprer-unit(:class='isEdit && value ? "opacity-40" : "opacity-100"') 
  .col-2.flex.align-items-center.justify-content-center
    .icon--large.bg-blue-700(:class='icon')
  .col-10.flex.flex-column.justify-content-center
    div.text-500 {{ title }}
    a(v-if="link" :href="link" target="_blank").text-link
      span.font-semibold {{value}}
      .icon.icon-arrow-up-right.inline-block
    span.font-semibold.mr-1.uppercase(v-else) {{ value }}
    template(v-if="type ==='normal'")
      InputNumber(:disabled='!isEdit' :value='model' @input="handleUpdateUnit")
    template(v-if="type ==='size'")
      .grid(v-if='isEdit')
        .col-4.p-0.pl-2.pt-1
          InputNumber.w-full(:disabled='!isEdit', :value='length' @input="(e)=> $emit('updateUnit', e, 'lengthBox')")
        .col-4.p-0.pt-1
          InputNumber.w-full(:disabled='!isEdit', :value='width' @input="(e)=> $emit('updateUnit', e, 'widthBox')")
        .col-4.p-0.pt-1
          InputNumber.w-full(:disabled='!isEdit', :value='height' @input="(e)=> $emit('updateUnit', e, 'heightBox')")
      span.font-semibold.mr-1.uppercase(v-else) {{ length }}*{{ width }}*{{ height }}
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
  @Prop() readonly type!: string | undefined
  @Prop() readonly link!: string | undefined
  @Prop() model!: number | undefined
  @Prop() height!: number | undefined
  @Prop() length!: number | undefined
  @Prop() width!: number | undefined

  handleUpdateUnit(e: any){
    this.$emit('updateUnit', e, this.name)
  }
}

export default StockUnit
</script>
<style scoped lang="sass">
.wapprer-unit 
  height: 72px
  border-radius: 4px
  ::v-deep.p-inputtext
    border: none
    background: transparent
    padding: 0
    color: #000
    font-weight: 600
    box-shadow: none !important
    max-width: 100%
</style>