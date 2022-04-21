<template lang="pug">
div
  h1.text-center WELCOME!
  InputText(type="text" placeholder="Search" v-model="id")
  InputText(type="text" placeholder="Search" v-model="boxId")
  Button(@click='isShowLabel = true') Show
  PrintLabel(:displayLable='isShowLabel' @setShow="setShowLabel" :requestId="id" :boxId="boxId")
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
  id = 'RN000000000001'
  boxId = 'psuh1w1r60hcozh3uof77fv0'

  setShowLabel(value: any) {
    this.isShowLabel = value
  }
}

export default StockIn
</script>
<style lang="sass">
</style>
