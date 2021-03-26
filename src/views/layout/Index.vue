<!--
 * @Date: 2021-03-25 15:53:11
 * @LastEditTime: 2021-03-26 17:51:55
 * @Description: 首页
-->
<template>
  <el-container class="layout">
    <side-bar :isCollapse="isCollapse"></side-bar>
    <el-container>
      <nav-bar v-model:isCollapse="isCollapse" class="nav_bar"></nav-bar>
      <!-- <tags-view class="tags_view"></tags-view> -->
      <el-main class="main_bar">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang='ts'>
import { ref, reactive, defineComponent } from 'vue'
import SideBar from './components/SideBar.vue'
import NavBar from './components/NavBar.vue'
import TagsView from './components/TagsView.vue'

export default defineComponent({
    components: { SideBar, NavBar, TagsView },
    setup: () => {
        let isCollapse = ref(false)

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
        .tags_view {
            height: 40px;
            line-height: 40px;
        }
        .main_bar {
            flex: 1;
        }
    }
}
</style>