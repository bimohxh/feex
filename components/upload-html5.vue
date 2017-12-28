<template lang="pug">
  div
    form(enctype="multipart/form-data" v-bind:id="fromid" method="post" action="upload.php")
      input(type="file" name="file"  @change="uploadFile")
      input(type="hidden" nae="folder" v-mode="folder")
</template>

<script>
  import axios from '~/plugins/axios'
  export default {
    props: ['flag', 'value', 'folder'],
    computed: {
      fromid: function () {
        return `upload-form-${this.flag}`
      }
    },
    methods: {
      fileSelected: function () {
        var file = document.getElementById('fileToUpload').files[0]
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
      uploadFile: async function () {
        var xhr = new XMLHttpRequest()
        var fd = document.getElementById(this.fromid).getFormData()
        // xhr.upload.addEventListener('progress', this.uploadProgress, false)
        // xhr.addEventListener('load', this.uploadComplete, false)
        // xhr.addEventListener('error', this.uploadFailed, false)
        // xhr.addEventListener('abort', this.uploadCanceled, false)
        // xhr.open('POST', 'upload')
        // xhr.send(fd)
        let res = await axios().post('upload', fd, {
          onUploadProgress: function (progressEvent) {
          }
        })
        this.$emit('input', res.data.filename)
      },
      uploadProgress: function (evt) {
        if (evt.lengthComputable) {
          var percentComplete = Math.round(evt.loaded * 100 / evt.total)
          document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%'
        }
        else {
          document.getElementById('progressNumber').innerHTML = 'unable to compute'
        }
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