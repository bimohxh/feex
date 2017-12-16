<template lang="pug">
  header
    a(href="/")
      h1 
        span 前端<小例/>
    div.slogan Talk is cheep, show and run your code !

</template>

<script>
export default {
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
      color: #ffbcbc;
    }

    h1 {
      letter-spacing: 10px;
    }

    .slogan {
      margin-top: 30px;
      color: #6bc0b8;
      font-size: 16px;
    }
  }
</style>
