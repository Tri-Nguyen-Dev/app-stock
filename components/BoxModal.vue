<template lang="pug">
b-container
  b-modal#box-detail(ref='modal', title='Box Detail')
    p.my-4 {{ box }}
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class BoxModal extends Vue {
  @Prop({ default: 'Input Property' })
  box!: any
}
</script>

<style>
</style>