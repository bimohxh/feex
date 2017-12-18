<template lang="pug">
  div.main
    div.mem-box
      div.mem-info
        div.left
          img.tx(:src="cdn(mem.avatar, 'mem')")
        div.right
          h5 {{mem.nc}}
          div.loacom
            icon(name="location" v-if="mem.mem_info.location" width="18px") {{mem.mem_info.location || '坐标'}}
            icon(name="company" v-if="mem.mem_info.company"  width="18px") {{mem.mem_info.company || '公司'}}
          
          div.link
            a(:href="mem.mem_info.blog" target="_blank" v-if="isExsit(mem.mem_info.blog)" )
              icon(name="home" style="color: #009688" ) 主页

            a(:href="'http://weibo.com/' + mem.mem_info.weibo_url" target="_blank" v-if="isExsit(mem.mem_info.weibo_url)")
              icon(name="weibo" style="color: #FF0000") {{mem.mem_info.weibo_url}}

            a(:href="'https://twitter.com/' + mem.mem_info.twitter" target="_blank"  v-if="isExsit(mem.mem_info.twitter)")
              icon(name="twitter" style="color: #06A2F3") {{mem.mem_info.twitter}}

            a(:href="'https://github.com/' + mem.mem_info.github" target="_blank"  v-if="isExsit(mem.mem_info.github)")
              icon(name="github" style="color: #252E2F") {{mem.mem_info.github}}
          a.edit-btn(v-bind:href="'https://www.awesomes.cn/mem/' + mem.id + '/profile'" target="_blank" title="编辑个人资料" v-if="session.id === mem.id")
            icon(name="pen" width="15px")
      div.nav
        nuxt-link(to="/") 我购买的
        nuxt-link(to="/") 我发布的
      div.con-box
        nuxt
</template>

<script>
  import axios from '~/plugins/axios'
  export default {
    async asyncData ({ req, params, query }) {
      let res = await axios().get(`mem/${params.id}`)
      return {
        mem: res.data
      }
    },
    computed: {
      session () {
        return this.$store.state.session || {}
      },
      who () {
        return this.session.id === parseInt(this.$route.params.id) ? '我' : 'TA'
      },
      routeKey () {
        return this.$route.name.split('-')[2] || ''
      }
    },
    methods: {
      isExsit: (str) => {
        return str && str.trim() !== ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mem-box {
    width: 100%;
    max-width: 700px;
    margin: 50px auto;
    box-shadow: 0 1px 5px 0 rgba(0,0,0,.05);
    border: 1px solid #ededed;
    line-height: 25px;
    background-color: #FFF;

    .mem-info {
      padding: 20px;
      display: flex;

      .right {
        flex-grow: 1;
        padding-left: 20px;
        position: relative;
        & > * {
          margin-bottom: 10px;
        }

        &:hover {
          .edit-btn {
            display: block;
          }
        }
      }

      .tx {
        width: 100px;
        border-radius: 100%
      }

      .loacom {
        font-size: 12px;
        color: #79888f;
        & > span {
          margin-right: 10px
        }
      }

      .link {
        a {
          color: #9e9e9e;
          margin-right: 10px;
        }
        svg {
        }
      }

      .edit-btn {
        position: absolute;
        top: 0px;
        right: 0px;
        display: none;
      }
    }

    .nav {
      padding: 15px 20px;
      border-left: 0;
      border-right: 0;
      background-color: #d0ede9;

      a {
        margin-right: 20px;
      }
    }

    .con-box {
      padding: 20px;
    }
  }
</style>
