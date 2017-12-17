<template lang="pug">
  div.main
    editem(:item="newitem")
</template>

<script>
  import Editem from '~/components/feex/editem'
  export default {
    data () {
      return {
        newitem: {
        }
      }
    },
    components: {
      Editem
    }
  }
</script>

<style lang="scss" scoped>
</style>
