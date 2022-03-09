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
    b-table(
      hover,
      :items='items',
      :fields='fields',
      @row-clicked='onRowSelected'
    )
      template(v-slot:cell(select)='row')
        b-form-checkbox(
          @change='selectBox(row.item.id)',
          v-model='row.item.select'
        )
      template(v-slot:cell(action)='row')
        b-dropdown
          b-dropdown-item(@click='editBox(row.item)') Edit
          b-dropdown-item(@click='deleteBox([row.item.id])') Delete
  BoxModal(
    :box='boxSelected ? boxSelected : null',
    v-on:handleSubmitModal='submitModal($event)'
  )
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
class ProductsList extends Vue {
  itemChecked: any = []
  items: any = []
  boxSelected: any = null
  fields = [
    { key: 'select', label: '' },
    { key: 'id', label: 'No' },
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'category', label: 'Category' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' },
  ]
  async mounted() {
    this.items = [
      {
        id: 1,
        name: 'Box 1',
        code: '1PDXl@3',
        category: 'sample',
        supplier: 'Babyshark',
        status: 'Done',
      },
      {
        id: 2,
        name: 'Box 2',
        code: '1PDXl@3',
        category: 'sample',
        supplier: 'Babyshark',
        status: 'Pending',
      },
      {
        id: 3,
        name: 'Box 3',
        code: '1PDXl@3',
        category: 'sample',
        supplier: 'Babyshark',
        status: 'Pending',
      },
    ]
  }
  async searchBox({ target }: { target: any }) {
    console.log(target.value)
  }

  selectBox(itemId: any) {
    if (this.itemChecked.indexOf(itemId) !== -1) {
      this.itemChecked.splice(this.itemChecked.indexOf(itemId), 1)
    } else {
      this.itemChecked.push(itemId)
    }
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
}
export default ProductsList
</script>
<style lang="sass">
.table
  tr
    td
      cursor: pointer
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
</style>