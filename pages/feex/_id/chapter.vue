<template lang="pug">
  div.main
    div.editor-box
      div.left(v-show="isLeftShow")
        div.left-top-bar
          h3 Bootstrap从入门
        div.left-menu
          a(href="javascript:void(0)" @click="leftView = 'catalog'" v-bind:class="'active-' + (leftView === 'catalog')") 目录
          a(href="javascript:void(0)" @click="leftView = 'structure'"  v-bind:class="'active-' + (leftView === 'structure')") 文件
        //文件结构
        div.left-content
          code-structure(v-show="leftView === 'structure'")
          // 目录
          code-catalog(v-show="leftView === 'catalog'")

      div.middle
        div.code-box#code-box
          div.code-info#code-info
            div.left-info
              a(href="javascript:void(0)" @click="isLeftShow = !isLeftShow")
                icon(name="list" width="18px")
            div.middle-info
              h3.title demo/index.html
            div.right-info
              a(href="javascript:void(0)" @click="run")
                icon(name="run-o")
              a(href="javascript:void(0)" @click="isRightShow = !isRightShow")
                icon(name="list" width="18px")
          div.code-inner
            textarea(id="code" name="code")
        
      div.right(v-show="isRightShow")
        div.preview-box
          iframe#preview

</template>

<script>
import CodeStructure from '~/components/code-structure'
import CodeCatalog from '~/components/code-catalog'
import $ from 'jquery'
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
export default {
  layout: 'blank',
  data () {
    return {
      isRealTimePreview: false,
      isLeftShow: true,
      isRightShow: false,
      leftView: 'catalog',
      comcon: initHtml
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
    run: function () {
      let _html = this.comcon
      let previewFrame = document.getElementById('preview')
      var preview = previewFrame.contentDocument || previewFrame.contentWindow.document
      preview.open()
      preview.write(_html)
      preview.close()
      this.isRightShow = true
    },
    resizeBar: function () {
      setTimeout(function () {
        console.log($('#code-box').width())
        $('#code-info').css('width', $('#code-box').width())
      })
    }
  },
  mounted () {
    this.resizeBar()
    var CodeMirror = require('codemirror')
    require('codemirror/addon/edit/closetag.js')
    require('codemirror/addon/fold/xml-fold.js')
    require('codemirror/mode/xml/xml.js')
    require('codemirror/mode/javascript/javascript.js')
    require('codemirror/mode/css/css.js')
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
    editor.setValue(initHtml)
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
          }

          .code-inner {
            background-color: #fff;
            padding: 10px;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
            margin-top: 10px;
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
          bottom: 10px;
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
  }
</style>
