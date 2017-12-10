<template lang="pug">
  div.structure-box
    code-structure-item(v-for="item in structures" v-bind:item="item")
</template>

<script>
import CodeStructureItem from '~/components/code-structure-item.vue'
var structures = [
  {
    id: 1,
    name: 'index.html',
    type: 'file',
    origion: 'url',
    url: '',
    file_id: 13,
    parent: 0
  },
  {
    id: 2,
    name: 'config.json',
    type: 'file'
  },
  {
    id: 3,
    name: '图片',
    type: 'folder'
  },
  {
    id: 4,
    name: 'css',
    type: 'folder',
    children: [
      {
        id: 5,
        name: 'index.css',
        type: 'file',
        origion: 'url',
        url: '',
        file_id: 13,
        parent: 0
      },
      {
        id: 6,
        name: 'layout.css',
        type: 'file',
        origion: 'url',
        url: '',
        file_id: 13,
        parent: 0
      }
    ]
  },
  {
    id: 7,
    name: 'js',
    type: 'folder'
  }
]
export default {
  data () {
    return {
      structures: []
    }
  },
  components: {
    CodeStructureItem
  },
  created () {
    this.structures = [{
      id: 0,
      name: 'app',
      type: 'folder',
      isRoot: true,
      children: structures
    }]
  }
}
</script>


<style lang="scss" scoped>
.structure-box {
  position: fixed;
  background-color: #FFF;
  top: 50px;
  bottom: 0px;
  width: 300px;
  left: 0;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  overflow-y: auto;
  font-size: 15px;
}
</style>