<template lang="pug">
  div
    header-bar
    nuxt
    alert(v-show="alertData.show" v-bind:msg="alertData.msg" v-bind:type="alertData.type")
    login
</template>


<script>
  import HeaderBar from '~/components/header'
  import Alert from '~/components/alert.vue'
  import Login from '~/components/login.vue'
  export default {
    components: {
      HeaderBar,
      Alert,
      Login
    },
    computed: {
      alertData: function () {
        return this.$store.state.alert
      }
    }
  }
</script>
