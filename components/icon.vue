<template lang="pug">
  span.v-icon(:class="alone")
    svg(:style="{width: (width || 20) + 'px', height: (width || 20) + 'px'}")
      use(:xlink:href="'#' + name")
    span
      slot
</template>


<script>
  export default {
    props: ['name', 'width', 'height', 'rotate', 'alone', 'scale'],
    data () {
      return {
      }
    }
  }
</script>

<style lang="scss">
  .v-icon {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    span {
      display: inline-block;
    }

    svg {
      margin-right: 3px;
    }

    &.true {
      svg {
        margin-right: 0;
      }
    }
  }

  
</style>
