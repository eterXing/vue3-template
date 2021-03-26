<!--
 * @Date: 2021-03-23 10:42:14
 * @LastEditTime: 2021-03-26 18:26:07
 * @Description: index页面
-->
<template>
  <div>
    <div @click="toHome">{{title}}</div>
    <div>{{name}}</div>
    <div>{{age}}</div>
  </div>
</template>

<script lang='ts'>
import { ref, reactive, toRefs, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
    setup: () => {
        const $router = useRouter()

        let title = ref(0),
            user = reactive({ name: '十七', age: 12 })

        const toHome = () => {
            $router.push('/home')
        }
        return { title, toHome, ...toRefs(user) }
    },
})
</script>

<style scoped lang="scss">
</style>