<!--
 * @Date: 2021-03-25 16:13:22
 * @LastEditTime: 2021-03-29 13:49:11
 * @Description: 侧边栏
-->
<template>
  <div class="side_bar">
    <div class="logo">
      admin
    </div>
    <el-scrollbar class="scrollbar-wrapper">
      <el-menu :default-active="activeRouter" @select='selectPath' unique-opened menu-trigger="click" :collapse="isCollapse" class="el-menu-vertical">
        <template v-for="item in routerList" :key="item.route">
          <el-menu-item v-if='item.isOnce' :index="item.route">
            <i :class="'iconfont '+ item.icon"></i>
            <template #title>{{ item.resourceName }}</template>
          </el-menu-item>
          <el-submenu v-else :index="item.route">
            <template #title>
              <i :class="'iconfont '+ item.icon"></i>
              <span>{{ item.resourceName }}</span>
            </template>
            <template v-for="childItem in item.children" :key="childItem.route">
              <el-menu-item :index="childItem.route">
                {{ childItem.resourceName }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
    props: { isCollapse: Boolean },
    setup: () => {
        const $store = useStore(),
            $route = useRoute(),
            $router = useRouter()

        let activeRouter: any = ref(''),
            routerList = $store.getters.userRoutes

        const selectPath = (val: string) => {
            $router.push(val)
        }

        watch(
            () => $route,
            (val) => {
                activeRouter.value = val.path
            },
            { deep: true, immediate: true }
        )
        return { activeRouter, routerList, selectPath }
    },
})
</script>

<style lang='scss'>
@import '@/assets/css/theme.scss';
.side_bar {
    .logo {
        height: 48px;
        line-height: 48px;
        text-align: center;
        background-color: $color;
        color: #fff;
        font-size: 24px;
        font-weight: 600;
        border-bottom: 1px solid #fff;
    }
    .scrollbar-wrapper {
        height: calc(100% - 49px);
    }
    .el-scrollbar__view,
    .el-menu {
        height: 100%;
    }
    .el-menu-item:hover {
        background-color: rgb(239, 242, 255);
    }
    .el-menu {
        border-right: 0;
        width: 220px;
        .el-menu-item,
        .el-submenu__title {
            font-size: 16px;
            i {
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
                font-size: 20px;
            }
            .el-submenu__icon-arrow {
                margin-right: 0;
                font-size: 16px;
            }
        }
        .el-menu--inline {
            .el-menu-item {
                padding-left: 52px !important;
            }
        }
    }

    .el-menu--collapse {
        width: 100px;
        text-align: center;
        .el-menu-item {
            i {
                display: inline-block;
                margin-right: 0;
            }
        }
    }
}

.el-menu-item.is-active {
    background-color: $color !important;
    color: #fff;
}
</style>