<template lang="pug">
div.catalog-box
  div.cate-group(v-for="cat in catalogs")
    div.cate-1
      div.name-box
        span.title-flag(v-show="!cat.isEditing") {{cat.title}}
        input.txt(type="text" spellcheck="false" v-bind:id="'catalogtitle-' + cat.id" v-on:blur="blurEdit(cat)" v-show="cat.isEditing" v-model="cat.edititle" v-on:keyup.enter="updateTitle(cat)")
      div.oper-box
        a(href="javascript:void(0)"  title="删除")
          icon(name="cha" width="11px")
        a.oper-btn(href="javascript:void(0)" title="上移")
          icon(name="up" width="12px")
        a.oper-btn(href="javascript:void(0)" title="下移")
          icon(name="down" width="12px")
        a.oper-btn(href="javascript:void(0)" title="新增子章节" @click="addSecond(item)")
          icon(name="file" width="12px")
        
        a(href="javascript:void(0)"  title="编辑" @click="showEdit(cat)")
          icon(name="pen" width="12px")
        
        
    div.cate-2(v-for="sub in cat.subs")
      div.name-box
        a.title-flag(href="javascript:void(0)" v-show="!sub.isEditing") {{sub.title}}
        input.txt(type="text" spellcheck="false" v-bind:id="'catalogtitle-' + sub.id" v-on:blur="blurEdit(sub)" v-show="sub.isEditing" v-model="sub.edititle" v-on:keyup.enter="updateTitle(sub)")
      div.oper-box
        a(href="javascript:void(0)" title="删除")
          icon(name="cha" width="11px")
        a(href="javascript:void(0)"  title="关联文件")
          icon(name="link" width="13px")
        a.oper-btn(href="javascript:void(0)" title="上移")
          icon(name="up" width="12px")
        a.oper-btn(href="javascript:void(0)" title="下移")
          icon(name="down" width="12px")
        a(href="javascript:void(0)"  title="编辑" @click="showEdit(sub)")
          icon(name="pen" width="12px")
</template>

<script>
import axios from '~/plugins/axios'
export default {
  data () {
    return {
      catalogs: []
    }
  },
  methods: {
    // 获取目录
    fetchCatalogs: async function () {
      let res = await axios().get(`feex/1/catalog`)
      this.catalogs = res.data.items.reduce((result, item) => {
        item.isEditing = false
        item.edititle = item.title
        if (item.parent === 0) {
          result.push(item)
        } else {
          let _parent = result.filter(sitem => {
            return sitem.id === item.parent
          })[0]
          if (_parent) {
            _parent.subs = _parent.subs || []
            _parent.subs.push(item)
          }
        }
        return result
      }, [])
    },
    // 显示编辑
    showEdit: function (item) {
      item.isEditing = true
      item.edititle = item.title
      setTimeout(function () {
        document.getElementById(`catalogtitle-${item.id}`).focus()
      }, 0)
    },
    // 失去焦点
    blurEdit: function (item) {
      item.isEditing = false
      // if (this.item.isNew) {
      //   delete this.item
      // }
    },
    // 更新名字
    updateTitle: async function (item) {
      item.isEditing = false
      item.title = item.edititle
      // let res = await axios().put(`feex/structure`, {
      //   id: this.item.id,
      //   name: this.editname
      // })
      // if (res.data.status) {
      //   this.isEditing = false
      //   this.item.name = this.editname
      // } else {
      // }
    },
    // 新增文件
    addSecond: async function (type) {
      // let data = {
      //   type: type || 'file',
      //   name: '未命名',
      //   isEditing: true,
      //   isNew: true,
      //   parent: this.item.id
      // }
      // let res = await axios().post(`feex/1/structure`, data)
      // let reitem = res.data.item
      // if (type === 'folder') {
      //   reitem.children = []
      // }
      // this.item.children.push(reitem)
    }
  },
  created () {
    this.fetchCatalogs()
  }
}
</script>


<style lang="scss">
.catalog-box {
  padding: 20px;
  .cate-group {
    margin-bottom: 20px;
  }
  .cate-1 {
    color: #DDD;
  }
    
  .cate-2 {
    border-bottom: #EEE 1px solid;
    border-bottom: 1px solid #eeeeee52;
    padding: 8px 0;
    a {
      color: #333;
      text-decoration: none;
    }
  }

  .cate-1, .cate-2 {
    display: flex;

    &:hover {
      .oper-box {
        display: block;
      }

      .title-flag {
        color: #647d7f
      }
    }

    .name-box {
      flex-grow: 1
    }

    .oper-box {
      width: 100px;
      text-align: right;
      display: none;

      a {
        margin-left: 5px;
        &:link, &:visited {
          color: #a5b1b6
        }
        &:active, &:hover {
          color: #333
        }
      }
    }

  }
}
</style>