<template lang="pug">
.grid.surface-hover.wapprer-unit(:class='!isEdit ? "opacity-40" : "opacity-100"') 
  .col-2.flex.align-items-center.justify-content-end.col-offset-1
    .icon--large.bg-blue-700(:class='icon')
  .col-9.flex.flex-column.justify-content-center
    div.text-500 {{ title }}
    a(v-if="link" :href="link" target="_blank").text-link
      span.font-semibold {{value}}
      .icon.icon-arrow-up-right.inline-block
    span.font-semibold.mr-1.uppercase(v-else) {{ value }}
    template(v-if="type ==='weight'")
      InputNumber(:disabled='!isEdit' v-model='weight' :input="$emit('updateUnit', weight, 'weight')")
    template(v-if="type ==='size'")
      .grid(v-if='isEdit')
        .col-4.p-0.pl-2.pt-1
          InputNumber.w-full(:disabled='!isEdit', v-model='length' :input="$emit('updateUnit', length, 'length')")
        .col-4.p-0.pt-1
          InputNumber.w-full(:disabled='!isEdit', v-model='width' :input="$emit('updateUnit', width, 'width')")
        .col-4.p-0.pt-1
          InputNumber.w-full(:disabled='!isEdit', v-model='height' :input="$emit('updateUnit', height, 'height')")
      span.font-semibold.mr-1.uppercase(v-else) {{ length }}*{{ width }}*{{ height }}
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class StockUnit extends Vue {
  @Prop() readonly value!: number | undefined
  @Prop() readonly title!: string | undefined
  @Prop() readonly isEdit!: boolean | false
  @Prop() readonly icon!: string | undefined
  @Prop() readonly type!: string | undefined
  @Prop() readonly link!: string | undefined
  @Prop() weight!: number | undefined
  @Prop() height!: number | undefined
  @Prop() length!: number | undefined
  @Prop() width!: number | undefined

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