<template lang="pug">
  div.struct-item(v-if="!isDeleted")
    div.current
      div.struct-left
        input.check(type="radio" name="check-default" v-if="item.type === 'file' && mode === 'link'")
        icon(:name="item.type" width="15px")
        template(v-show="!isEditing")
          a.s-name(href="javascript:void(0)" @click="showCode(item, 'structure')" v-if="item.type == 'file'") {{item.name}}
          span(v-else) {{item.name}}
        input.txt(type="text" spellcheck="false" v-bind:id="'structname-' + item.id" v-on:blur="blurEdit" v-show="isEditing" v-model="editname" v-on:keyup.enter="updateName")
      div.struct-right
        a.oper-btn(href="javascript:void(0)"  title="删除" @click="destroy" v-if="!item.isRoot")
          icon(name="cha" width="11px")
        
        a.oper-btn(href="javascript:void(0)" v-if="item.type === 'folder'" title="新增文件夹" @click="addFile('folder')")
          icon(name="folder" width="12px")
        a.oper-btn(href="javascript:void(0)" v-if="item.type === 'folder'" title="新增文件" @click="addFile('file')")
          icon(name="file" width="12px")
        
        a.oper-btn(href="javascript:void(0)"  title="编辑" @click="showEdit" v-show="!isEditing" v-if="!item.isRoot")
          icon(name="pen" width="12px")

    code-structure-item(v-for="sub in item.children" v-bind:item="sub" v-bind:mode="mode" v-bind:showCode="showCode" v-bind:path="item.path")   
</template>

<script>
import axios from '~/plugins/axios'
export default {
  name: 'code-structure-item',
  props: ['item', 'mode', 'showCode', 'path'],
  data () {
    return {
      editname: '',
      isEditing: this.item.isEditing,
      isDeleted: false
    }
  },
  watch: {
    'item.name': function () {
      this.getPath()
    },
    'path': function () {
      this.getPath()
    }
  },
  methods: {
    // 显示编辑
    showEdit: function () {
      this.isEditing = true
      this.editname = this.item.name
      let _self = this
      setTimeout(function () {
        document.getElementById(`structname-${_self.item.id}`).focus()
      }, 0)
    },
    // 失去焦点
    blurEdit: function () {
      this.isEditing = false
      if (this.item.isNew) {
        delete this.item
      }
    },
    // 更新名字
    updateName: async function () {
      let res = await axios().put(`feex/structure`, {
        id: this.item.id,
        name: this.editname
      })
      if (res.data.status) {
        this.isEditing = false
        this.item.name = this.editname
      } else {
      }
    },
    // 新增文件夹
    // 新增文件
    addFile: async function (type) {
      let data = {
        type: type || 'file',
        name: '未命名',
        isEditing: true,
        isNew: true,
        parent: this.item.id,
        file_from: 'file'
      }
      let res = await axios().post(`feex/1/structure`, data)
      let reitem = res.data.item
      if (type === 'folder') {
        reitem.children = []
      }
      this.item.children.push(reitem)
    },
    // 删除
    destroy: async function () {
      if (!confirm('确定删除该文件？')) {
        return false
      }
      await axios().delete(`feex/structure?id=${this.item.id}`)
      this.isDeleted = true
    },
    getPath: function () {
      this.item.path = `/${this.path}/${this.item.name}`.replace(/^\/+app\//, '').replace(/^\/+/, '')
    }
  },
  created () {
    this.getPath()
  }
}
</script>


<style lang="scss" scoped>
  .struct-item {
    padding-left: 15px;
    
  }
  .current {
    padding: 0 10px;
    padding-left: 0;
    display: flex;
    align-items: center;
    height: 30px;

    .s-name {
      font-size: .9em;
      font-weight: 400;
      line-height: 1em;
      letter-spacing: .5px;
      border-radius: 5px;
    }
    
    .struct-left {
      flex-grow: 1;
      display: flex;
      align-items: center;
      word-break: keep-all;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .txt {
        width: 100px;
      }
      .check {
        margin-right: 5px;
      }
    }

    .struct-right {
      width: 100px;
      flex-shrink: 0;
      text-align: right;
    }

    .oper-btn {
      margin-left: 6px;
      display: none;
    }

    &:hover {
      .oper-btn {
        display: inline-block;
      }
    }

  }
</style>