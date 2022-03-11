<template lang='pug'>
Loading
  b-container(fluid)
    h1.text-center WELCOME!
    div.table

</template>

<script lang='ts'>
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'


@Component({
  middleware: ['authenticate'],
  layout: 'dashboard',
})
class Pages extends Vue {

}

export default Pages
</script>
<style lang='sass'>
body
  font-family: 'Source Sans Pro', sans-serif
</style>
