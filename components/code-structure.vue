<template lang="pug">
  div.structure-box
    div.struct-item(v-for="item in structures")
      div.struct-left
        span.s-name {{item.name}}
      div.struct-right

</template>

<script>
export default {
  data () {
    return {
      structures: [
        {
          id: 1,
          name: 'index.html',
          type: 'file',
          origion: 'url',
          url: '',
          file_id: 13,
          parent: 0,
          children: []
        },
        {
          name: 'config.json'
        },
        {
          name: '图片'
        },
        {
          name: 'css'
        },
        {
          name: 'js'
        }
      ]
    }
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

  .struct-item {
    padding: 10px;
    display: flex;

    .s-name {
      color: #35495e;
      font-size: .9em;
      font-weight: 400;
      line-height: 1em;
      letter-spacing: .5px;
      border-radius: 5px;
      padding: 10px 5px;
    }
    
    .struct-left {
      flex-grow: 1
    }

    .struct-right {
      width: 100px;
      flex-shrink: 0;
    }

  }
}
</style>