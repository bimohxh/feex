<template lang="pug">
  div.main
    div.form-area
      div.left
        div.form-group
          label 标题
          input.form-control(type="text" v-model="item.title")
        
        div.form-group
          label 摘要
          textarea.form-control(type="text" v-model="item.summary")
        
        div.form-group
          label 价格
          input.form-control(type="text" v-model="item.price")
      div.right
        div.form-group
          div.preview
            h4 封面
        div.form-group
          upload(v-model="item.cover" folder="feex")
    div.form-group
      button.btn.btn-danger 创建
</template>

<script>
// import axios from '~/plugins/axios'
import Upload from '~/components/upload'
export default {
  props: ['item'],
  components: {
    Upload
  }
}
</script>

<style lang="scss" scoped>
  .main {
    width: 100%;
    max-width: 600px;
    margin: 50px auto;
    box-shadow: 0 1px 5px 0 rgba(0,0,0,.05);
    border: 1px solid #ededed;
    line-height: 25px;
    background-color: #FFF; 
    padding: 40px;
  }

  .form-area {
    display: flex;

    .left {
      flex-grow: 1
    }

    .right {
      width: 200px;
      padding-left: 20px;
    }

    .preview {
      width: 150px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f4fffe;
      border: #d3ebe9 1px solid;
      color: #cfe1df;;
    }
  }
</style>
