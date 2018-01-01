<template lang="pug">
  div.form
    input(type="file" name="file"  @change="uploadFile")
</template>

<script>
  import axios from '~/plugins/axios'
  import $ from 'jquery'
  export default {
    props: ['flag', 'value', 'folder', 'progress', 'success'],
    computed: {
      fromid: function () {
        return `upload-form-${this.flag}`
      }
    },
    methods: {
      fileSelected: function () {
        // var file = document.getElementById('fileToUpload').files[0]
        // if (file) {
        //   var fileSize = 0
        //   if (file.size > 1024 * 1024)
        //     fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB'
        //   else
        //     fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB'

        //   document.getElementById('fileName').innerHTML = 'Name: ' + file.name
        //   document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize
        //   document.getElementById('fileType').innerHTML = 'Type: ' + file.typ
        // }
      },
      uploadFile: async function (event) {
        // var xhr = new XMLHttpRequest()
        let _file = $(event.target)[0].files[0]
        let fd = new FormData()
        fd.append('folder', this.folder)
        fd.append('filepath', $(event.target).val())
        fd.append('file', _file)
        console.log('===', _file.name)
        // xhr.upload.addEventListener('progress', this.uploadProgress, false)
        // xhr.addEventListener('load', this.uploadComplete, false)
        // xhr.addEventListener('error', this.uploadFailed, false)
        // xhr.addEventListener('abort', this.uploadCanceled, false)
        // xhr.open('POST', 'upload')
        // xhr.send(fd)
        let _self = this
        let res = await axios().post('upload', fd, {
          onUploadProgress: function (evt) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total)
            _self.progress(percentComplete)
          }
        })
        this.$emit('input', res.data.filename)
        this.success(_file.name, res.data.filename)
      },
      uploadProgress: function (evt) {
        // if (evt.lengthComputable) {
        //   var percentComplete = Math.round(evt.loaded * 100 / evt.total)
        //   document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%'
        // }
        // else {
        //   document.getElementById('progressNumber').innerHTML = 'unable to compute'
        // }
      },
      uploadComplete: function (evt) {
        // alert(evt.target.responseText);
      },
      uploadFailed: function (evt) {
      },
      uploadCanceled: function (evt) {
      }
    }
  }
</script>

<style lang="scss" scoped>
.form {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  opacity: 0;
}
</style>