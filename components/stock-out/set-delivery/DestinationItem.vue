<template lang="pug">
  .destination
    .grid
      .col-4
        AutoComplete.form-item
      .col-8
        AutoComplete.form-item
    .grid
      .col
        Dropdown.form-item
      .col
        Calendar.form-item(:showIcon="true")
      .col
        AutoComplete.form-item
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class DestinationItem extends Vue {

}

export default DestinationItem
</script>

<style lang="sass" scoped>
::v-deep.destination
  background-color: $text-color-200
  padding: 16px
  border-radius: 16px

  .form-item
    width: 100%
    input
      width: 100%
</style>