<template lang="pug">
  .report-modal.flex.flex-column.h-full
    .modal-header
      h3.px-3 Quantity Discrepancy Report
    .modal-footer.flex
      Button.btn.btn-outline.btn-report(@click="cancelReportModal") Cancel
      Button.btn.btn-primary.btn-report Submit
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingAddReport extends Vue {
  cancelReportModal() {
    this.$emit('cancelReportModal')
  }
}

export default PackingAddReport
</script>
<style lang="sass" scoped>
  .modal-header
    border-bottom: 1px solid #E8EAEF
  .modal-footer
    gap: 0 12px
    padding: 12px
    margin-top: auto
    .btn-report
      width: 50%
</style>