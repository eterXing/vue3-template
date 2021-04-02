<!--
 * @Date: 2021-03-25 15:53:11
 * @LastEditTime: 2021-04-02 15:51:31
 * @Description: 首页
-->
<template>
  <el-container class="layout">
    <side-bar :isCollapse="isCollapse"></side-bar>
    <el-container>
      <nav-bar v-model:isCollapse="isCollapse" class="nav_bar"></nav-bar>
      <tags-view class="tags_view"></tags-view>
      <div class="main_bar">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </el-container>
  </el-container>
</template>

<script lang='ts'>
import { ref, defineComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SideBar from './components/SideBar.vue'
import NavBar from './components/NavBar.vue'
import TagsView from './components/TagsView.vue'

export default defineComponent({
    components: { SideBar, NavBar, TagsView },
    setup: () => {
        const $store = useStore(),
            $route = useRoute(),
            $router = useRouter()

        let isCollapse = ref(false),
            routerList = $store.getters.userRoutes

        onMounted(() => {
            if ($route.path === '/') {
                $router.push(routerList[0].isOnce ? routerList[0].path : routerList[0].children[0].path)
            }
        })
        return { isCollapse }
    },
})
</script>

<style scoped lang='scss'>
.layout {
    width: 100%;
    height: 100%;
    background-color: rgb(237, 241, 255);
    .el-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        .nav_bar {
            height: 48px;
            line-height: 48px;
        }
        .main_bar {
            flex: 1;
            padding: 0 20px 20px 20px;
            .fade-enter-active,
            .fade-leave-active {
                transition: opacity 1s ease;
            }

            .fade-enter-from,
            .fade-leave-to {
                opacity: 0;
            }
        }
    }
}
</style>