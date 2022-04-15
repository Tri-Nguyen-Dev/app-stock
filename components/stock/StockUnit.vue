<template lang="pug">
.grid.surface-hover.mb-3(:class='isEdit && total ? "opacity-40" : "opacity-100"')
  .col-2.flex.align-items-center.justify-content-end
    .icon--large.bg-blue-700(:class='icon')
  .col-10
    div.text-500 {{ title }}
    span.font-semibold.mr-1.uppercase(v-if='total') {{ total }}
    template(v-if="weight")
      InputNumber(:disabled='isEdit == 0' v-model='weight' :input="$emit('test',weight )")
    template(v-if="syncedWidth")
      .grid(v-if='isEdit')
        .col-4.p-0.pl-2.pt-1
          InputNumber.w-full(:disabled='isEdit == 0', v-model='syncedLength')
        .col-4.p-0.pt-1
          InputNumber.w-full(:disabled='isEdit == 0', v-model='syncedWidth')
        .col-4.p-0.pt-1
          InputNumber.w-full(:disabled='isEdit == 0', v-model='syncedHeight')
      span.font-semibold.mr-1.uppercase(v-else) {{ syncedLength }}*{{ syncedWidth }}*{{ syncedHeight }}
</template>
<script lang='ts'>
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'

@Component
class StockUnit extends Vue {
  @Prop() readonly total!: number | undefined
  @Prop() readonly title!: string | undefined
  @Prop() readonly isEdit!: boolean | false
  @Prop() readonly icon!: string | undefined
  @Prop() weight!: number | undefined
  // @PropSync('weight', { type: Number }) syncedWeight!: number
  @PropSync('height', { type: Number  }) syncedHeight!: number
  @PropSync('length', { type: Number  }) syncedLength!: number
  @PropSync('width', { type: Number  }) syncedWidth!: number 
  
}

export default StockUnit
</script>