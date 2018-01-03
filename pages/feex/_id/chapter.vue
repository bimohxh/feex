<template lang="pug">
  div.main
    div.editor-box
      div.left(v-show="isLeftShow")
        div.left-top-bar
          nuxt-link(to="")
            img.logo(src="~/assets/img/logo-50.png")
          h5 前端小例
          // h5
          //   strong Bootstrap从入门
        div.left-menu
          a(href="javascript:void(0)" @click="switchLeft('catalog')" v-bind:class="'active-' + (leftView === 'catalog')") 目录
          a(href="javascript:void(0)" @click="switchLeft('structure')"  v-bind:class="'active-' + (leftView === 'structure')") 文件

        //文件结构
        div.left-content
          code-structure(v-show="leftView === 'structure'" mode="view" v-bind:showCode="showCode" v-bind:feex="feex")
          // 目录
          code-catalog(v-show="leftView === 'catalog'" v-bind:link="linkFile" v-bind:showCode="showCode" v-bind:active="checkedCatalog" v-bind:feex="feex")

      div.middle
        template
          div.code-box#code-box(v-show="!showResetConnect && (checkedStructure || (checkedCatalog && checkedCatalog.feex_structure_id > 0))")
            div.code-info#code-info
              div.left-info
                a.fold(href="javascript:void(0)" @click="isLeftShow = !isLeftShow" )
                  icon(name="arrow-left" width="18px" v-bind:class="'to-right-' +!isLeftShow")
                span.filename(v-if="checkedStructure") {{checkedStructure.path}}
                a(href="javascript:void(0)"  title="重新关联文件" @click="showResetConnect = true" v-show="checkedCatalog" style="margin-left: 10px;")
                  icon(name="link" width="18px")
              div.middle-info
              div.right-info
                template(v-if="checkedStructure && checkedStructure.file_from === 'file'")
                  a(href="javascript:void(0)" title="保存" @click="save" v-if="isMyFeex")
                    icon(name="save" width="18px")
                  a(href="javascript:void(0)" @click="run")
                    icon(name="run-o")
                  a.fold(href="javascript:void(0)" @click="isRightShow = !isRightShow" )
                    icon(name="arrow-left" width="18px" v-bind:class="'to-right-' + isRightShow")
            div.code-inner
              textarea(id="code" name="code")
        div.st-no-link(v-if="checkedCatalog && (!checkedCatalog.feex_structure_id || showResetConnect)")
          h4 绑定文件
          code-structure(mode="connect" v-bind:showCode="showCode" v-bind:connect="connectFile" v-bind:checkedCatalog="checkedCatalog")
          
      div.right(v-show="isRightShow")
        div.preview-box
          iframe#preview

</template>

<script>
import CodeStructure from '~/components/code-structure'
import CodeCatalog from '~/components/code-catalog'
import axios from '~/plugins/axios'
import $ from 'jquery'
const Config = require('../../../config')
const APIURL = Config ? Config.API : 'https://api.awesomes.cn/'
const initHtml = `<!doctype html>
<html>
  <head>
      <!-- CSS 和 JS 外链 -->

      <!--内联 CSS  -->
      <style type="text/css">

        /* CSS 样式 */

      </style>
  </head>

  <body>

    <!-- JS 调用 -->

  </body>
</html>`
var editor
var CodeMirror

export default {
  layout: 'blank',
  async asyncData ({params}) {
    let res = await axios().get(`feex/${params.id}`)
    return {
      feex: res.data
    }
  },
  data () {
    return {
      isRealTimePreview: false,
      isLeftShow: true,
      isRightShow: false,
      leftView: 'catalog',
      comcon: initHtml,
      checkedStructure: null,
      checkedCatalog: null,
      showResetConnect: false
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
  components: {
    CodeStructure,
    CodeCatalog
  },
  watch: {
    comcon: function () {
      if (this.isRealTimePreview) {
        this.run()
      }
    },
    isLeftShow: function () {
      this.resizeBar()
    },
    isRightShow: function () {
      this.resizeBar()
    }
  },
  methods: {
    // 运行
    run: function () {
      window.document.domain = window.location.hostname.replace(/^[a-zA-Z]+\./, '')
      let _html = this.comcon
      let previewFrame = document.getElementById('preview')
      previewFrame.src = `${APIURL}sandbox/1/feex`
      setTimeout(function () {
        previewFrame.contentWindow.postMessage(_html, APIURL)
      }, 100)
      this.isRightShow = true
    },
    resizeBar: function () {
      setTimeout(function () {
        console.log($('#code-box').width())
        $('#code-info').css('width', $('#code-box').width())
      })
    },
    switchLeft: function (view) {
      this.leftView = view
    },
    linkFile: function () {
      this.leftView = 'structure'
    },
    linkSub: function () {
    },
    // 选中文件 显示代码
    showStuctureCode: async function (stid) {
      let res = await axios().get(`feex_structure/${stid}`)
      let item = res.data
      this.checkedStructure = item
      let exta = {
        css: 'text/css',
        js: 'text/javascript',
        md: 'markdown'
      }[item.name.split('.').pop().toLocaleLowerCase()]
      editor.setOption('mode', exta || 'text/html')
      editor.setValue(item.file_con || '')
    },
    showCode: async function (item, from) {
      this.showResetConnect = false
      if (from === 'structure') {
        if (item.file_from === 'upload') {
          window.open(this.cdn(item.file_upload, 'feex'))
          return
        }
        this.checkedStructure = item
        this.checkedCatalog = null
        this.showStuctureCode(item.id)
      }
      if (from === 'catalog') {
        this.checkedStructure = null
        this.checkedCatalog = item
        if (item.feex_structure_id > 0) {
          this.showStuctureCode(item.feex_structure_id)
        } else {
          this.isRightShow = false
        }
      }
    },
    // 保存
    save: async function () {
      await axios().put(`feex_structure/${this.checkedStructure.id}`, {
        file_con: this.comcon
      })
    },
    connectFile: async function (item) {
      let res = await axios().put(`feex_catalog/${this.checkedCatalog.id}`, {
        feex_structure_id: item.id
      })
      if (res.data.status) {
        let newitem = res.data.item
        for (let key in newitem) {
          this.checkedCatalog[key] = newitem[key]
        }
      }
    },
    initEditor: function (mode) {
      CodeMirror = require('codemirror')
      require('codemirror/addon/edit/closetag.js')
      require('codemirror/addon/fold/xml-fold.js')
      require('codemirror/mode/xml/xml.js')
      require('codemirror/mode/javascript/javascript.js')
      require('codemirror/mode/css/css.js')
      require('codemirror/mode/markdown/markdown.js')
      require('codemirror/mode/htmlmixed/htmlmixed.js')
      require('codemirror/addon/comment/comment.js')
      require('codemirror/keymap/sublime.js')
      editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'text/html',
        autoCloseTags: true,
        inputStyle: 'contenteditable',
        lineWrapping: true,
        viewportMargin: Infinity,
        keyMap: 'sublime'
        // theme: 'vscode'
      })
      let _self = this
      editor.on('change', editor => {
        _self.comcon = editor.getValue()
        _self.resizeBar()
      })
    },
    // 设置标记背景色
    setColor: function () {
      let _cursor = editor.getDoc().getCursor()
      $(`.CodeMirror-line:eq(${_cursor.line})`).addClass('markline')
      console.log(_cursor)
    }
  },
  mounted () {
    this.resizeBar()
    this.initEditor()
  }
}
</script>

<style lang="scss">
  .main {
    padding-top: 60px;
    .headbar {
      height: 50px;
      position: fixed;
      width: 100%;
      top: 0;
      background-color: #03A9F4;
      z-index: 10;
      display: flex;

      * {
        color: #FFF;
        fill: #FFF;
      }

      .right, .left, .middle {
        display: flex;
        align-items: center;
      }

      .left {
        flex-grow: 1;
        padding: 0 20px;
      }

      .right {
        padding: 0 20px;
        & > * {
          margin-left: 20px;
        }
      }

      .middle {
        flex-grow: 1
      }

      .oper-btn {
        padding: 5px 5px;
        text-decoration: none;
        // border: #FFF 1px solid;
        font-size: 12px;

        &.on-true {
          background-color: #e79215
        }
      }
    }
    .editor-box {
      display: flex;
      .left {
        width: 300px;
        flex-shrink: 0;

        .left-top-bar {
          position: fixed;
          height: 50px;
          width: 300px;
          background-color: #FFF;
          top: 0;
          left: 0;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
          display: flex;
          align-items: center;
          padding: 0 10px;
          word-break: keep-all;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: flex;
          align-items: center;

          h5 {
            margin: 0;
            padding: 0;
            color: #db562e;
          }

          .logo {
            width: 30px;
            margin-right: 10px;
          }
        }

        .left-menu {
          position: fixed;
          background-color: #FFF;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
          top: 51px;
          height: 30px;
          width: 300px;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          a {
            padding: 0 10px;
            color: #444;

            &.active-true {
              color: #E64A19
            }
          }
        }

        .left-content {
          position: fixed;
          background-color: #FFF;
          top: 82px;
          bottom: 0px;
          width: 300px;
          left: 0;
          flex-shrink: 0;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
          overflow-y: auto;
        }
      }

      .middle {
        flex-grow: 1;
        word-wrap: break-word;
        width: 0;
        padding: 10px;
        padding-top: 0;

        .st-no-link {
          text-align: center;
          color: #bab7b7;
          max-width: 500px;
          margin: 0 auto;
          background-color: #FFF;
          box-shadow: 0 1px 12px 0 rgba(0,0,0,.05);
          padding: 20px;
        }

        .code-box {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          border-radius: 2px;
          flex-grow: 1;

          .code-info {
            background-color: #fff;
            padding: 20px 10px;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
            position: fixed;
            z-index: 10;
            display: flex;
            top: 0px;
            .title {
              color: #7d818a
            }

            .filename {
              font-size: 15px;
              margin-left: 10px;
              color: #DDD;
              letter-spacing: 0.5px;
            }

            a:link, a:visited {
              color: #bcbcbc
            }

            a:hover, a:active {
              color: #333
            }
           
            .middle-info {
              flex-grow: 1;
              padding: 0 10px;
              text-align: center;
            }

            .right-info {
              a {
                margin-left: 10px;
              }
            }

            .fold {
              .to-right-true {
                transform: rotate(180deg)
              }

              * {
                transition: transform 0.3s;
              }
            }
          }

          .code-inner {
            background-color: #fff;
            padding: 10px;
            box-shadow: 0 1px 12px 0 rgba(0,0,0,.05);
            // margin-top: 10px;
          }
        }
      }

      .right {
        position: relative;
        word-wrap: break-word;
        width: 500px;
        flex-shrink: 0;

        .preview-box {
          position: fixed;
          background-color: #FFF;
          top: 0px;
          bottom: 0px;
          width: 500px;
          right: 0;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);

          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        }
      }
    }

    .markline {
      background-color: #f6f7d3;
    }
  }
</style>
