<template lang="pug">
  div.main
    textarea(id="code" name="code" height="600px" )
</template>

<script>
export default {
  components: {
  },
  mounted () {
    var CodeMirror = require('codemirror')
    require('codemirror/lib/codemirror.css')
    require('codemirror/addon/edit/closetag.js')
    require('codemirror/addon/fold/xml-fold.js')
    require('codemirror/mode/xml/xml.js')
    require('codemirror/mode/javascript/javascript.js')
    require('codemirror/mode/css/css.js')
    require('codemirror/mode/htmlmixed/htmlmixed.js')
    require('codemirror/addon/display/fullscreen.css')
    require('codemirror/addon/display/fullscreen.js')

    if (process.browser) {
      CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'text/html',
        autoCloseTags: true,
        lineWrapping: true,
        inputStyle: 'contenteditable',
        viewportMargin: Infinity,
        extraKeys: {
          'F11': function (cm) {
            cm.setOption('fullScreen', !cm.getOption('fullScreen'))
          },
          'Esc': function (cm) {
            if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .main {
    .inner {
      color: red;
    }
  }
</style>
