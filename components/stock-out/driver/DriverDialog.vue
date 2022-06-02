<template lang="pug">
  Dialog(:visible.sync='showModal', :modal='true' :contentStyle='{"background-color": "#E8EAEF;", "width": "70vw"}' @hide='hideDialog()')
    template(#header)
      h1.text-heading Driver list
    DriverList(@selectDriver='selectDriver($event)')
    template(#footer)
      Button.p-button-secondary(label="Close" icon="pi pi-times" @click="showModal = false")
      Button.p-primary(label='Assign Delivery' :disabled='!enableAssign' @click='assignDriver')
      //-Button.btn.btn-primary.border-0(@click='handleAssign' :disabled='selectedDriver.length > 0 ? null : "disabled"') Assign Delivery   
</template>

<script lang="ts">
import { Component, namespace, Prop, Vue, Watch } from 'nuxt-property-decorator'
import DriverList from '~/components/stock-out/driver/DriverList.vue'const nsStoreOrder = namespace('stock-out/order-detail')
@Component({
  components: {
    DriverList
  }
})
class DriverDialog extends Vue {
  @Prop() isModalDriverList = false
  showModal = false
  enableAssign = false
  idDriver =''
  @nsStoreOrder.State
  dataAssignDriver!: any

  @nsStoreOrder.Action
  actPostAssignDriver!: any

  @Watch('isModalDriverList')
  setShowModal(){
    this.showModal = this.isModalDriverList
  }

  hideDialog(){
    this.$emit('hideDialog',true)
  }

  selectDriver(event){
    if(event.length>0){
      this.enableAssign = true
      this.idDriver = event[0].id
    } else {
      this.enableAssign = false
    }
  }

  async assignDriver(){
    const data= {
      id: this.idDriver,
      idOrder:  this.$route.params.id
    }
    await this.actPostAssignDriver(data)
    this.$emit('assigned',this.dataAssignDriver)
    this.hideDialog()
  }
}

export default DriverDialog
</script>
<style lang="sass" scoped>

</style>

