<template lang="pug">
  div.add-seller
    Sidebar(:visible.sync="isShowForm" position="right")
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class FormAddSeller extends Vue {
  @Prop() isShowForm: boolean = false
}

export default FormAddSeller
</script>
