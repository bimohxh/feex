<template lang="pug">
  div.struct-item(v-if="!isDeleted")
    div.current
      div.struct-left
        input.check(type="radio" name="confile" v-bind:checked="item.id === checkedCatalog.feex_structure_id"  @click="connect(item)" v-if="item.type === 'file' && mode === 'connect'")
        icon(:name="item.type" width="15px")
        template(v-if="!isEditing")
          a.s-name(href="javascript:void(0)" @click="showCode(item, 'structure')" v-if="item.type == 'file'") {{item.name}}
          span(v-else) {{item.name}}
        template(v-if="isEditing")
          input.txt(type="text" spellcheck="false" v-bind:id="'structname-' + item.id" v-on:blur="blurEdit" v-model="editname" v-on:keyup.enter="updateName")
      div.struct-right(v-if="isMyFeex")
        a.oper-btn(href="javascript:void(0)"  title="删除" @click="destroy" v-if="!item.isRoot")
          icon(name="cha" width="11px")
        
        a.oper-btn(href="javascript:void(0)" v-if="item.type === 'folder'" title="新增文件夹" @click="addFile('folder')")
          icon(name="folder" width="12px")
        a.oper-btn(href="javascript:void(0)" v-if="item.type === 'folder'" title="新增文件" @click="addFile('file')")
          icon(name="file" width="12px")
        
        span.oper-btn(v-if="item.type === 'folder'")
          a(href="javascript:void(0)" title="上传文件")
            icon(name="upload" width="12px")
          upload-html5(v-bind:flag="item.id" v-bind:success="uploadSuccess" folder="feex" v-bind:progress="progress")
        
        a.oper-btn(href="javascript:void(0)"  title="编辑" @click="showEdit" v-show="!isEditing" v-if="!item.isRoot")
          icon(name="pen" width="12px")

    code-structure-item(v-for="sub in item.children" v-bind:item="sub" v-bind:mode="mode" v-bind:showCode="showCode" v-bind:path="item.path" v-bind:connect="connect" v-bind:checkedCatalog="checkedCatalog" v-bind:feex="feex")   
</template>

<script>
import axios from '~/plugins/axios'
import UploadHtml5 from '~/components/upload-html5'
export default {
  name: 'code-structure-item',
  props: ['item', 'mode', 'showCode', 'path', 'connect', 'checkedCatalog', 'feex'],
  data () {
    return {
      editname: '',
      // isEditing: this.item.isEditing,
      isEditing: false,
      isDeleted: false
    }
  },
  components: {
    UploadHtml5
  },
  computed: {
    session () {
      return this.$store.state.session
    },
    isMyFeex () {
      return (this.feex || {}).mem_id === (this.$store.state.session || {}).id
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
    uploadSuccess: function (original, filename) {
      this.addFile('file', {
        name: original,
        file_from: 'upload',
        file_upload: filename
      })
    },
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
      let res = await axios().put(`feex_structure/${this.item.id}`, {
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
    addFile: async function (type, option) {
      option = option || {
        name: '未命名',
        file_from: 'file'
      }
      option.parent = this.item.id
      option.isNew = true
      option.isEditing = true
      option.type = type || 'file'
      let res = await axios().post(`feex/1/structure`, option)
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
      await axios().delete(`feex_structure/${this.item.id}`)
      this.isDeleted = true
    },
    getPath: function () {
      this.item.path = `/${this.path}/${this.item.name}`.replace(/^\/+app\//, '').replace(/^\/+/, '')
    },
    progress: function (per) {
      console.log('===', per)
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
    font-family: 'Roboto Mono';
    font-size: 14px;
  }
  .current {
    padding: 0 10px;
    padding-left: 0;
    display: flex;
    align-items: center;
    height: 30px;

    .s-name {
      // font-size: .9em;
      font-weight: 400;
      line-height: 1em;
      // letter-spacing: .5px;
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
      flex-grow: 1;

      .txt {
        width: 100px;
      }
      .check {
        margin-right: 5px;
      }
    }

    .struct-right {
      flex-shrink: 0;
      text-align: right;
      display: flex;
    }

    .oper-btn {
      margin-left: 6px;
      display: none;
      width: 15px;
      height: 20px;
      position: relative;
      overflow: hidden;
    }

    &:hover {
      .oper-btn {
        display: inline-block;
      }
    }

  }
</style>