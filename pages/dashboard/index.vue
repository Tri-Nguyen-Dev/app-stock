<template lang="pug"> 
  div
    h1.text-center AIRTAG MANAGEMENT SYSTEM
    Chart(type="bar" :data="basicData" ) 
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class Dashboard extends Vue {
  basicData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: '#42A5F5',
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: 'My Second dataset',
        backgroundColor: '#FFA726',
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  }
}

export default Dashboard
</script>
<style lang="sass">
</style>
