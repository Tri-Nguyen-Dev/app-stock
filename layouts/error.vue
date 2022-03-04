<template lang='pug'>
  .container
    h1(v-if='error.statusCode === 404') {{ pageNotFound }}
    template(v-else) {{ otherError }}
    NuxtLink(to='/') Home page
</template>
<script lang='ts'>
import { Component, Prop, Provide, Vue } from 'nuxt-property-decorator'

interface ErrorObject {
  statusCode: number
}

@Component({
  head(this: ErrorLayout): object {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
})
class ErrorLayout extends Vue {

  @Prop()
  error!: ErrorObject

  @Provide()
  pageNotFound: string = '404 Not Found'

  @Provide()
  otherError: string = 'An error occurred'

}

export default ErrorLayout
</script>
<style lang='sass' scoped>
h1
  font-size: 20px
</style>
