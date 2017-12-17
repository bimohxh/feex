<template lang="pug">
  div.main
    editem(:item="item")
</template>

<script>
  import axios from '~/plugins/axios'
  import Editem from '~/components/feex/editem'
  export default {
    async asyncData ({params}) {
      let res = await axios().get(`feex/${params.id}`)
      return {
        item: res.data
      }
    },
    components: {
      Editem
    }
  }
</script>

<style lang="scss" scoped>
</style>
