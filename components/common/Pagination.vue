<template lang="pug">
  .pagination(v-if="!!paging")
    div.pagination__info(v-if="!showDeleteBtn")
      img(:src="require('~/assets/icons/filter-left.svg')")
      span.pagination__total {{ showingText }}
    .pagination__delete(v-else @click="$emit('onDelete')")
      .icon.icon-btn-delete
      span {{title}} {{ deletedList.length }} {{type}}
    Paginator(
      :rows="paging.pageSize"
      :totalRecords="total"
      @page="$emit('onPage', $event)"
      :first.sync="paging.first"
      :rowsPerPageOptions="pageOption"
    ).p-0
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Paging } from 'models/common/Paging'
import { LIMIT_PAGE_OPTIONS } from '~/utils'

@Component
class Pagination extends Vue {
  pageOption = LIMIT_PAGE_OPTIONS
  // -- [ Props ] -------------------------------------------------------------
  @Prop({ default: 'Delete' }) readonly title!: string
  @Prop() paging!: Paging.Model
  @Prop() total!: number
  @Prop() deletedList!: any[] | undefined
  @Prop() type!: any

  // -- [ Getters ] -----------------------------------------------------------
  get showingText() {
    if (this.total <= 0) return ''
    const from = String(this.paging.pageNumber * this.paging.pageSize + 1).padStart(2, '0')
    const to = Math.min(this.total, (this.paging.pageNumber + 1) * this.paging.pageSize)
    return `Showing ${from} - ${to} of ${this.total}`
  }

  get showDeleteBtn() {
    return _.size(this.deletedList) > 0
  }
}

export default Pagination
</script>
