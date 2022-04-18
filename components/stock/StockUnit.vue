<template lang="pug">
.grid.surface-hover.mb-3(:class='isEdit && total ? "opacity-40" : "opacity-100"')
  .col-2.flex.align-items-center.justify-content-end
    .icon--large.bg-blue-700(:class='icon')
  .col-10
    div.text-500 {{ title }}
    span.font-semibold.mr-1.uppercase(v-if='total') {{ total }}
    template(v-if="type ==='weight'")
      InputNumber(:disabled='isEdit == 0' v-model='weight' :input="$emit('updateUnit', weight, 'weight')")
    template(v-if="type ==='size'")
      .grid(v-if='isEdit')
        .col-4.p-0.pl-2.pt-1
          InputNumber.w-full(:disabled='isEdit == 0', v-model='length' :input="$emit('updateUnit', length, 'length')")
        .col-4.p-0.pt-1
          InputNumber.w-full(:disabled='isEdit == 0', v-model='width' :input="$emit('updateUnit', width, 'width')")
        .col-4.p-0.pt-1
          InputNumber.w-full(:disabled='isEdit == 0', v-model='height' :input="$emit('updateUnit', height, 'height')")
      span.font-semibold.mr-1.uppercase(v-else) {{ length }}*{{ width }}*{{ height }}
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class StockUnit extends Vue {
  @Prop() readonly total!: number | undefined
  @Prop() readonly title!: string | undefined
  @Prop() readonly isEdit!: boolean | false
  @Prop() readonly icon!: string | undefined
  @Prop() readonly type!: string | undefined
  @Prop() weight!: number | undefined
  @Prop() height!: number | undefined
  @Prop() length!: number | undefined
  @Prop() width!: number | undefined

}

export default StockUnit
</script>