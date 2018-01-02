<template lang="pug">
  div.structure-box
    code-structure-item(v-for="item in structures" v-bind:item="item" v-bind:mode="mode" v-bind:showCode="showCode" v-bind:path="''" v-bind:connect="connect" v-bind:checkedCatalog="checkedCatalog")
</template>

<script>
import CodeStructureItem from '~/components/code-structure-item.vue'
import axios from '~/plugins/axios'

// 格式化列表
let formatItem = (item, items) => {
  item.children = []
  item.path = ''
  items.forEach(subitem => {
    if (subitem.parent === item.id) {
      item.children.push(subitem)
      formatItem(subitem, items)
    }
  })
}
let formatList = (items) => {
  let result = [{
    id: 0,
    name: 'app',
    type: 'folder',
    isRoot: true,
    children: []
  }]
  items.forEach(item => {
    if (item.parent === 0) {
      result[0].children.push(item)
      formatItem(item, items)
    }
  })
  return result
}

export default {
  props: ['mode', 'showCode', 'connect', 'checkedCatalog'],
  data () {
    return {
      structures: []
    }
  },
  components: {
    CodeStructureItem
  },
  methods: {
    // 获取
    fetchStructures: async function () {
      let res = await axios().get(`feex/1/structure`)
      this.structures = formatList(res.data.items)
    }
  },
  created () {
    this.fetchStructures()
  }
}
</script>


<style lang="scss" scoped>
.structure-box {
  font-size: 15px;
}
</style>