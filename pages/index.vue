<template lang="pug">
  div.main
    div.feex-list
      nuxt-link(class="feex-item" v-for="item in feexs" v-bind:to="'/feex/' + item.id")
        div.left
          img.cover(src="~/assets/img/cover.png")
        div.right
          h4 {{item.title}}
          div.desc {{item.summary}}
          div.mem-box
            img.mem-tx(:src="cdn(item.mem.avatar, 'mem')")
            span {{item.mem.nc}}
          div.extra
            span.part-price ￥{{item.price}}
            span 共 {{item.chapter}} 节
            span {{item.sales}} 人购买
</template>

<script>
import axios from '~/plugins/axios'
export default {
  async asyncData () {
    let res = await axios().get('feex')
    return {
      feexs: res.data.items
    }
  }
}
</script>

<style lang="scss" scoped>
  .feex-list {
    width: 100%;
    max-width: 700px;
    margin: 50px auto;
    box-shadow: 0 1px 5px 0 rgba(0,0,0,.05);
    border: 1px solid #ededed;
    line-height: 25px;
    
    .feex-item {
      display: flex;
      padding: 20px;
      background-color: #FFF;
      border-bottom: 1px solid #ededed;
      color: #333;

      &:hover {
        background-color: #fafafa
      }

      .left {
        width: 100px;
        flex-shrink: 0;
      }

      .right {
        flex-grow: 1;
        padding-left: 20px;

        .desc {
          padding: 10px 0;
        }

        .part-price {
          color: #fa5828;
          font-size: 1.3rem;
        }

        .extra {
          color: #c0bcbc;
          & > * {
            margin-right: 15px;
          }
        }
      }

      .cover {
        width: 100px;
      }

      .mem-box {
        display: flex;
        align-items: center;
        color: #000;
        padding: 10px 0;
        .mem-tx {
          width: 22px;
          height: 22px;
          border-radius: 100%;
          margin-right: 10px;
        }
      }
    }
  }
</style>
