<template lang="pug">
b-container
  b-row.mb-3
    b-col
      b-input(type='text', placeholder='Search', @keyup='searchBox')
    b-col.justify-content-end.d-flex
      b-button.mr-2(
        variant='danger',
        @click='deleteBox(itemChecked)',
        :disabled='itemChecked.length === 0'
      ) Delete
      b-button(variant='primary', @click='createBox') Add
  b-row
    b-table.font-weight-bold(
      hover,
      :items='items',
      :fields='fields',
      @row-clicked='onRowSelected',
      :tbody-tr-class='rowClass',
      :sort-desc.sync='sortDesc',
      :sort-by.sync='sortBy'
    )
      template(
        #head()='{ label, field: { key, sortable } }',
        style='color: red'
      )
        span.text-muted.font-weight-bold.text-uppercase {{ label }}
        template(v-if='sortable')
          template
            b-img.ml-2(
              v-if='sortBy !== key',
              :src='sortIconNeutral',
              style='width: 0.55rem; height: 0.75rem'
            )
            b-img.ml-2(
              v-else-if='sortDesc',
              :src='sortIconAsc',
              style='width: 0.55rem; height: 0.75rem'
            )
            b-img.ml-2(
              v-else='',
              :src='sortIconDesc',
              style='width: 0.55rem; height: 0.75rem'
            )
      template(v-slot:head(select)='data')
        b-form-checkbox(v-model='checked', :indeterminate.sync='indeterminate')
      template(v-slot:cell(select)='row')
        b-form-checkbox(@change='selectBox(row.item.no)')
      template(#cell(weight)='data')
        span.px-2.py-1.ml-1.text-dark.rounded.table-cell-bg {{ data.value }}
      template(#cell(size)='data')
        span.px-2.py-1.ml-1.text-dark.rounded.table-cell-bg(
          v-for='item in data.value'
        ) {{ item }}
      template(v-slot:cell(action)='row')
        button.btn.btn-default.p-0(@click='editBox(row.item)')
          b-img(:src='require("~/assets/images/btn-icon-edit.svg")')
        button.btn.btn-default.p-0.ml-1(@click='deleteBox([row.item.id])')
          b-img(:src='require("~/assets/images/btn-icon-delete.svg")')
  BoxModal(
    :box='boxSelected ? boxSelected : null',
    v-on:handleSubmitModal='submitModal($event)'
  )
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
class BoxList extends Vue {
  itemChecked: any = []
  items: any = []
  boxSelected: any = null
  useCustomIcons = true
  indeterminate = false
  checked = false
  sortIconNeutral =
    "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='gray' opacity='.3' d='M51 1l25 23 24 22H1l25-22zM51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e"
  sortIconDesc =
    "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='gray' d='M51 1l25 23 24 22H1l25-22z'/%3e%3cpath fill='gray' opacity='.3' d='M51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e"
  sortIconAsc =
    "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='gray' opacity='.3' d='M51 1l25 23 24 22H1l25-22z'/%3e%3cpath fill='gray' d='M51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e"
  sortBy = null
  sortDesc = false
  fields = [
    { key: 'select' },
    { key: 'no', sortable: true },
    { key: 'code', sortable: true },
    { key: 'sender', sortable: true },
    {
      key: 'weight',
      label: 'weight(kg)',
      sortable: true,
      thClass: 'text-right',
      tdClass: 'text-right',
    },
    {
      key: 'size',
      label: 'size(cm)',
      sortable: true,
      thClass: 'text-right',
      tdClass: 'text-right',
    },
    {
      key: 'warehouse',
      sortable: true,
      thClass: 'text-right',
      tdClass: 'text-right',
    },
    {
      key: 'location',
      sortable: true,
      thClass: 'text-right',
      tdClass: 'text-right',
    },
    { key: 'action', thClass: 'text-right', tdClass: 'text-right' },
  ]
  async mounted() {
    this.items = [
      {
        no: 1,
        code: '1PDXl@3',
        sender: 'abc1@rikkeisoft.com',
        weight: '2.8',
        size: [40, 50, 90],
        warehouse: 'NTH001',
        location: 'NTH001',
      },
      {
        no: 2,
        code: '1PDXl@3',
        sender: 'abc2@rikkeisoft.com',
        weight: '2.8',
        size: [40, 50, 90],
        warehouse: 'NTH001',
        location: 'NTH001',
      },
      {
        no: 3,
        code: '1PDXl@3',
        sender: 'abc3@rikkeisoft.com',
        weight: '2.8',
        size: [40, 50, 90],
        warehouse: 'NTH001',
        location: 'NTH001',
      },
    ]
  }
  async searchBox({ target }: { target: any }) {
    console.log(target.value)
  }

  selectBox(itemId: any) {
    console.log(itemId)

    if (this.itemChecked.indexOf(itemId) !== -1) {
      this.itemChecked.splice(this.itemChecked.indexOf(itemId), 1)
    } else {
      this.itemChecked.push(itemId)
    }
    console.log(this.itemChecked)

    if (this.itemChecked.length === 0) {
      this.indeterminate = false
      this.checked = false
    } else {
      this.indeterminate = true
    }
    // this.indeterminate = this.itemChecked.length === 0 ? false : true
  }
  createBox() {
    this.boxSelected = null
    this.$bvModal.show('box-modal')
  }
  editBox(box: any) {
    this.boxSelected = box
    this.$bvModal.show('box-modal')
  }
  deleteBox(ids: any) {
    this.items = this.items.filter((item: any) => !ids.includes(item.id))
  }
  onRowSelected(record: any) {}
  submitModal(box: any) {
    if (this.boxSelected) {
      const newListBox = [...this.items]
      if (newListBox) {
        const index = newListBox.findIndex((x) => x.id === box?.id)
        if (index === -1) return
        newListBox.splice(index, 1, box)
        this.items = newListBox
        this.$nextTick(() => {
          this.$bvModal.hide('box-modal')
        })
      }
    } else {
      this.items.push({
        ...box,
        id:
          this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 1,
      })
      this.$nextTick(() => {
        this.$bvModal.hide('box-modal')
      })
    }
  }
  rowClass(item: any, type: any) {
    if (!item || type !== 'row') return
    if (this.itemChecked.includes(item.id)) return 'table-success'
  }

  myModelSelect(event: any) {
    console.log(event)

    // if (this.itemChecked.includes(item.id)) return true
  }
}
export default BoxList
</script>
<style lang="sass">
.table
  font-size: 12px
  &-cell-bg
    background-color: #F1F3F6
  tr
    td
      cursor: pointer
    th
      padding-right: 0.75em !important
  .b-dropdown
    .dropdown-toggle
      background-color: unset
      border: unset
      color: black
      padding: 0
      &:after
        content: '\2807'
        font-size: 20px
        border: none
.table.b-table > thead > tr > th, .table.b-table > tfoot > tr > td
  background-image: none !important
</style>