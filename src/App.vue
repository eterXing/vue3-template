<!--
 * @Date: 2021-03-19 17:32:47
 * @LastEditTime: 2021-03-26 17:34:52
 * @Description: file content
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { provide, getCurrentInstance, defineComponent } from 'vue'

export default defineComponent({
    name: 'App',
    setup() {
        let internalInstance: any = getCurrentInstance(),
            $http = internalInstance.appContext.config.globalProperties.$http

        // http请求
        provide('$http', $http)

        // 区分操作系统
        function datectOS() {
            let isWin = navigator.platform === 'Win32' || navigator.platform === 'Windows',
                isMac = navigator.platform === 'Mac68K' || navigator.platform === 'MacPPC' || navigator.platform === 'Macintosh' || navigator.platform === 'MacIntel'

            if (isMac) {
                document.body.style.fontFamily = 'PingFangSC-Regular, sans-serif'
            } else if (isWin) {
                document.body.style.fontFamily = 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif'
            }
        }
        datectOS()
    },
})
</script>

<style>
#app {
    width: 100vw;
    height: 100vh;
}
</style>