<template lang="pug">
  header
    div.nav-bar
      div.left
      div.right
        a(href="javascript:void(0)" @click="showLogin()" v-if="!session") 登录
        nuxt-link(:to="'/mem/' + (session || {}).id"  v-else)
          img.tx(:src="cdn((session || {}).avatar, 'mem')")
    a(href="/")
      h1 
        span 前端<小例/>
    div.slogan Talk is cheep, show and run your code !

</template>

<script>
export default {
  computed: {
    session () {
      return this.$store.state.session
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    height: 250px;
    background-color: #26A69A;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-shadow: 0px 0px 5px #16978b;
    
    a:link, a:visited {
      color: #FFF;
    }

    a:hover, a:active {
      color: #EEE;
    }

    h1 {
      letter-spacing: 10px;
    }

    .slogan {
      margin-top: 30px;
      color: #6bc0b8;
      font-size: 16px;
    }

    .nav-bar {
      display: flex;
      position: absolute;
      top: 0;
      width: 100%;
      padding: 20px 30px;

      .left {
        flex-grow: 1;
      }

      .tx {
        width: 25px;
        height: 25px;
        border-radius: 100%;
        border: 1px solid rgb(215, 212, 212);
        box-shadow: 0px 0px 5px #616363;
      }
    }
  }
</style>
