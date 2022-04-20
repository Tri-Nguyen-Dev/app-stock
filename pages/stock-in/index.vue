<template lang="pug">
div
  h1.text-center WELCOME!
  Button(@click='isShowLabel = true') Show
  PrintLabel(:isShow='isShowLabel' @setShow="setShowLabel")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PrintLabel from '~/components/pdf/PrintLabel.vue'

@Component({
  components: {
    PrintLabel
  }
})
class StockIn extends Vue {
  isShowLabel: boolean = false;

  setShowLabel(value: any) {
    this.isShowLabel = value
  }
}

export default StockIn
</script>
<style lang="sass">
</style>
