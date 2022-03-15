<template lang="pug">
.card
  .grid
    .col
      h1.m-0.mb-1 Box List
      span.text-black-alpha-60 1280 product found
    .col
      .grid.justify-content-end
        .col-fixed
          span.p-input-icon-left
            i.pi.pi-search
            InputText(type="text" v-model="value3" placeholder="Search")
        .col-fixed
          Button(label="Filter" icon="pi pi-angle-up")
        .col-fixed
          Button(label="Add items" icon="pi pi-plus")
  .grid
    .col
      .bg-white
        div.p-2
          span.text-black-alpha-60 font-bold
        Dropdown.w-full.border-0(v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City")
    .col
      .bg-white
        div.p-2
          span.text-black-alpha-60 Warehouse
        Dropdown.w-full.border-0(v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City")
    .col
      .bg-white
        div.p-2
          span.text-black-alpha-60 Warehouse
        Dropdown.w-full.border-0(v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City")
    .col
      .bg-white
        div.p-2
          span.text-black-alpha-60 Warehouse
        Dropdown.w-full.border-0(v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
class BoxList extends Vue {
  selectedCity = null
  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]
}
export default BoxList
</script>

<style lang="sass">
body
  background: #E8EAEF
</style>