<template lang="pug">
  div.feex-box
    div.feex-item
      div.left
        img.cover(src="~/assets/img/cover.png")
      div.right
        h3 {{item.title}}
        div.desc {{item.summary}}
        div.mem-box
          img.mem-tx(:src="cdn(item.mem.avatar, 'mem')")
          span {{item.mem.nc}}
        div.extra
          button.btn.btn-danger 购买 ￥{{item.price}}
          button.btn.btn-outline-secondary 免费试学
    div.buyer-box
      div
        icon(name="buy") {{item.sales}} 人已购买
    div.cata-box
      template(v-for="cata in catalogs")
        div.cata-1 {{cata.title}}
        template(v-for="sub in cata.children")
          a.cata-2(href="" v-if="sub.isfree === 'Y'")
            icon(name="file" width="15px") {{sub.title}}
            span.try 试学
            span.studyed 432 次学习
          div.cata-2(v-if="sub.isfree === 'N'")
            icon(name="file" width="15px") {{sub.title}}
            span.studyed 432 次学习


</template>


<script>
  import axios from '~/plugins/axios'
  export default {
    async asyncData ({params}) {
      let res = await axios().get(`feex/${params.id}?relation=true`)
      let _catalogs = []
      res.data.catalogs.forEach(item => {
        if (item.parent === 0) {
          _catalogs.push(item)
        } else {
          let _item = _catalogs.filter(sbitem => {
            return sbitem.id === item.parent
          })[0]
          if (_item) {
            _item.children = _item.children || []
            _item.children.push(item)
          }
        }
      })
      return {
        item: res.data,
        catalogs: _catalogs
      }
    }
  }
</script>

<style lang="scss" scoped>
  .feex-box {
    width: 100%;
    max-width: 700px;
    margin: 50px auto;
    box-shadow: 0 1px 5px 0 rgba(0,0,0,.05);
    border: 1px solid #ededed;
    line-height: 25px;
    background-color: #FFF;

    .feex-item {
      display: flex;
      padding: 20px;
      border-bottom: 1px solid #eff1f1;
      color: #333;

      .left {
        width: 130px;
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
        width: 100%
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

    .buyer-box {
      padding: 15px 20px;
      border-bottom: 1px solid #eff1f1;
    }

    .cata-box {
      padding: 20px;

      .cata-1 {
        color: #c6bdbd;
      }

      .cata-2 {
        display: flex;
        padding: 10px;
        align-items: center;
        & > * {
          margin-right: 10px;
        }
        &:hover {
          background-color: #f4f5f5;
        }

        .studyed {
          color: #bfc2bb;
          font-size: 12px;
        }
      }

      .try {
        background-color: #FF5722;
        color: #FFF;
        font-size: 12px;
        padding: 0px 5px;
        border-radius: 2px;
        height: 23px;
      }
    }
  }
</style>