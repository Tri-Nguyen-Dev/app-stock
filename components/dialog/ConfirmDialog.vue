<template lang="pug">
    .confirm-dialog
       Dialog(:visible.sync="visible" :modal="true") 
            div.confirm-dialog__content
                img(:srcset="`${image ? require(`~/assets/images/${image}.png`) : ''} 2x`")
                h3.confirm-dialog__title  {{ title }}
                p.confirm-dialog__des {{ message }}
                div.confirm-dialog__footer
                    Button.confirm-dialog__btn.btn--discard(@click="onCancel()") No
                    Button.confirm-dialog__btn.btn--agree(@click="onOk()" :disabled="loadingBtn")
                       .pi.pi-spin.pi-spinner(v-if="loading")
                       span(v-else) Yes
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component
class ConfirmDialogCustom extends Vue {
  @Prop() image!: string
  @Prop({ default: '' }) title!: string
  @Prop({ default: '' }) message!: string

  @Prop({ default: false }) isShow!: boolean
  @Prop() onOk!: () => void

  @Prop() onCancel!: () => void

  @Prop({ default: false }) loading!: boolean

  get visible() {
    return this.isShow;
  }

  get loadingBtn() {
    return this.loading;
  }
}

export default ConfirmDialogCustom;
</script>

<style lang="sass">

.p-dialog
    font-family: $font-family-primary !important
    border-radius: 8px !important
    overflow: hidden
    border: none
    max-width: 300px
  
    .p-dialog-header
        display: none !important

    .p-dialog-content
        padding: 0

.confirm-dialog
    &__content
        text-align: center
        padding: 48px 16px 16px 16px

        img
            object-fit: contain
            max-width: 100%

    &__title
        margin-top: 16px
        margin-bottom: 0
        color: $text-color-900
        font-weight: $font-weight-bold
        font-size: $font-size-medium !important
        line-height: calc(24 / 16)

    &__des
        margin-top: 12px
        margin-bottom: 0
        color: $text-color-700
        font-weight: $font-weight-regular
        font-size: $font-size-small !important 
        line-height: calc(20 / 12)

    &__footer
        margin-top: 32px
        display: flex
        gap: 0 8px
        justify-content: center

    &__btn
        padding: 12px 32px
        color: $text-color-900
        font-size: 14px
        font-weight: 400
        line-height: calc(24 / 14)
        border-radius: 4px
        cursor: pointer
        min-width: 130px
        outline: none
        border: none
        display: flex
        align-items: center
        justify-content: center

    &__btn:hover
        background-color: $primary !important

    &__btn.btn--discard
        background-color: #E8EAEF

    &__btn.btn--agree
        background-color: $primary
        color: #fff

</style>
