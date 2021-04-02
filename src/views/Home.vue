<!--
 * @Date: 2021-03-23 10:42:07
 * @LastEditTime: 2021-04-02 15:11:24
 * @Description: file content
-->
<template>
  <div class="dp_index">
    {{ title }}
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent } from 'vue'
export default defineComponent({
    setup: () => {
        let title: any = ref('')

        title = '你好啊，我是home'
        return { title }
    },
})
</script>

<style scoped lang="scss">
</style>
