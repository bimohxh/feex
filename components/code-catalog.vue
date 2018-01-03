<template lang="pug">
div.catalog-box
  div.cate-group(v-for="(cat, index) in catalogs")
    div.cate-con(v-if="!cat.isDeleted")
      div.cate-1
        div.name-box
          span.title-flag(v-show="!cat.isEditing") {{cat.title}}
          input.txt(type="text" spellcheck="false" v-bind:id="'catalogtitle-' + cat.id" v-on:blur="blurEdit(cat)" v-show="cat.isEditing" v-model="cat.edititle" v-on:keyup.enter="updateTitle(cat)")
        div.oper-box(v-if="isMyFeex")
          a(href="javascript:void(0)"  title="删除"  @click="destroy(cat)")
            icon(name="cha" width="11px")
          a.oper-btn(href="javascript:void(0)" title="下移" @click="move(cat, index, 'down')" v-show="index < catalogs.length - 1")
            icon(name="down" width="12px")
          a.oper-btn(href="javascript:void(0)" title="上移" @click="move(cat, index, 'up')" v-show="index > 0")
            icon(name="up" width="12px")
          a.oper-btn(href="javascript:void(0)" title="新增子章节" @click="addnew(cat)")
            icon(name="file" width="12px")
          
          a(href="javascript:void(0)"  title="编辑" @click="showEdit(cat)")
            icon(name="pen" width="12px")
        
      div.cate-2(v-for="(sub, subindex) in cat.subs" v-if="!sub.isDeleted")
        div.name-box
          a.title-flag(href="javascript:void(0)" v-show="!sub.isEditing" @click="showCode(sub, 'catalog')") {{sub.title}}
          input.txt(type="text" spellcheck="false" v-bind:id="'catalogtitle-' + sub.id" v-on:blur="blurEdit(sub)" v-show="sub.isEditing" v-model="sub.edititle" v-on:keyup.enter="updateTitle(sub)")
        div.oper-box(v-if="isMyFeex")
          a(href="javascript:void(0)" title="删除"  @click="destroy(sub)")
            icon(name="cha" width="11px")
          // a(href="javascript:void(0)"  title="关联文件" @click="link(sub)")
          //   icon(name="link" width="13px")
          a.oper-btn(href="javascript:void(0)" title="下移"  @click="move(sub, subindex, 'down', cat)" v-show="subindex < cat.subs.length - 1")
            icon(name="down" width="12px")
          a.oper-btn(href="javascript:void(0)" title="上移" @click="move(sub, subindex, 'up', cat)" v-show="subindex > 0")
            icon(name="up" width="12px")
          a(href="javascript:void(0)"  title="编辑" @click="showEdit(sub)")
            icon(name="pen" width="12px")
        div.state-active(v-if="active && active.id === sub.id")
  a.addfirstbtn(href="javascript:void(0)" @click="addnew()" v-if="isMyFeex") 新增一级目录
</template>

<script>
import axios from '~/plugins/axios'
const _ = require('underscore')
let formatItem = (item) => {
  item.isEditing = false
  item.edititle = item.title
  item.isDeleted = false
  if (item.parent === 0) {
    item.subs = []
  }
}
export default {
  props: ['link', 'showCode', 'active', 'feex'],
  data () {
    return {
      catalogs: []
    }
  },
  computed: {
    session () {
      return this.$store.state.session
    },
    isMyFeex () {
      return this.feex.mem_id === (this.$store.state.session || {}).id
    }
  },
  methods: {
    // 获取目录
    fetchCatalogs: async function () {
      let res = await axios().get(`feex/1/catalog`)
      let cats = res.data.items.reduce((result, item) => {
        formatItem(item)
        if (item.parent === 0) {
          result.push(item)
        } else {
          let _parent = result.filter(sitem => {
            return sitem.id === item.parent
          })[0]
          if (_parent) {
            _parent.subs.push(item)
          }
        }
        return result
      }, [])
      // 排序
      cats = _.sortBy(cats, 'ordernum')
      cats.forEach(item => {
        item.subs = _.sortBy(item.subs, 'ordernum')
      })
      this.catalogs = cats
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
      let res = await axios().put(`feex_catalog/${item.id}`, {
        title: item.edititle
      })
      if (res.data.status) {
        item.isEditing = false
        item.title = item.edititle
      } else {
      }
    },

    // 新增文件
    addnew: async function (item) {
      let data = {
        title: '未命名',
        isEditing: true,
        isNew: true,
        parent: item ? item.id : 0
      }
      let res = await axios().post(`feex/1/catalog`, data)
      let reitem = res.data.item
      formatItem(reitem);
      (item ? item.subs : this.catalogs).push(reitem)
    },
    // 删除
    destroy: async function (item) {
      if (!confirm('确定删除该文件？')) {
        return false
      }
      await axios().delete(`feex_catalog/${item.id}`)
      item.isDeleted = true
    },

    // 移动
    move: async function (item, index, direction, parent) {
      let list = (parent ? parent.subs : this.catalogs)
      let switchIndex
      if (direction === 'up') {
        if (index === 0) { return }
        switchIndex = index - 1
      } else {
        if (index === list.length - 1) { return }
        switchIndex = index + 1
      }
      let switchObj = list[switchIndex]
      await axios().put(`feex_catalog/sort`, {
        dist: [item.id, switchObj.id]
      })
      let tmp = item.ordernum
      item.ordernum = switchObj.ordernum
      switchObj.ordernum = tmp
      if (parent) {
        parent.subs = _.sortBy(list, 'ordernum')
      } else {
        this.catalogs = _.sortBy(list, 'ordernum')
      }
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
    align-items: center;

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

    .state-active {
      width: 10px;
      height: 10px;
      background-color: #DDD;
      border-radius: 100%;
      margin-left: 5px;
      background-color: #13cc1b;
    }

  }

  .addfirstbtn {
    padding: 5px 10px;
    text-align: center;
    display: block;
    background-color: #f9fbfb;
    border: #DDD 1px solid;
    margin: 20px 0;
  }
}
</style>