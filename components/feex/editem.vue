<template lang="pug">
  div.main
    div.topbar
      h4 {{isNew ? '新建' : '编辑'}}小例
    div.form-area(v-if="!isCreatedOK")
      div.left
        div.form-group
          label 标题
          input.form-control(type="text" v-model="item.title")
        
        div.form-group
          label 摘要
          textarea.form-control(type="text" v-model="item.summary" rows="5")
        
        div.form-group
          label 价格
          input.form-control(type="number" v-model="item.price")
        div.form-group
          button.btn.btn-danger(@click="submit") {{isNew ? '创建' : '更新'}}  
      div.right
        div.form-group
          div.preview
            h4(v-if="!item.cover") 封面
            img.cover(:src="cdn(item.cover, 'feex', 'feex')" v-else)
        div.form-group
          upload(v-model="item.cover" folder="feex")
    div.msg-box(v-if="isCreatedOK")
      h4 创建小例成功！
      div
        span 你接下来可以 
        a(href="") 开始编辑章节

</template>

<script>
import axios from '~/plugins/axios'
import Upload from '~/components/upload'
export default {
  props: ['item'],
  data () {
    return {
      isCreatedOK: false
    }
  },
  components: {
    Upload
  },
  computed: {
    isNew: function () {
      return !this.item.id > 0
    }
  },
  methods: {
    submit: async function () {
      if (this.showLogin()) {
        return
      }
      if (!this.checkValid()) {
        this.$alert('danger', '请正确填写内容')
        return false
      }
      if (this.item.id > 0) {
        this.update()
      } else {
        this.create()
      }
    },
    update: async function () {
      await axios().put(`feex`, this.item)
      this.$alert('success', '更新小例成功！')
    },
    create: async function () {
      await axios().post(`feex`, this.item)
      this.$alert('success', '新增小例成功！')
      this.isCreatedOK = true
    },
    checkValid: function () {
      let result = true
      let _self = this
      ;['title', 'summary', 'price'].forEach(key => {
        if (!_self.item[key] || _self.item[key].trim() === '') {
          result = false
        }
      })
      return result
    }
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
  }

  .topbar {
    text-align: center;
    padding: 30px 0;
    border-bottom: 1px solid #96ccc7;
    background-color: #faffff;
  }

  .form-area {
    display: flex;
    padding: 40px;

    .left {
      flex-grow: 1
    }

    .right {
      width: 160px;
      padding-left: 20px;
    }

    .preview {
      width: 140px;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f4fffe;
      border: #d3ebe9 1px solid;
      color: #cfe1df;;
    }
  }

  .msg-box {
    padding: 100px 0;
    text-align: center;
    line-height: 50px;

    h4 {
      color: #1fc025
    }

    a {
      text-decoration: underline;
      color: #26a69a;
    }
  }
</style>
