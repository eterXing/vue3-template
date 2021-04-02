<!--
 * @Date: 2021-03-25 17:10:19
 * @LastEditTime: 2021-04-02 15:56:39
 * @Description: 导航标签
-->
<template>
  <div class="tags_view">
    <div class="content">
      <i class="el-icon-arrow-left" v-show="moveStatus" @click="moveTo('prev')"></i>
      <dp-scroll-pane class='tags-view-wrapper' ref='scrollPane' @showMoveBtn='showMoveBtn'>
        <div v-for="(item, index) in visitedList" :key="index" :to="item.path" :class="isActive(item) ? 'active' : ''" :ref="el => { if (el) tags[index] = el }" class="tags-view-item" @click="toLink(item)">
          <span> {{item.name}} </span>
          <i v-if="item.name !== '首页'" class="el-icon-close" @click.stop="delVisitedPage(item, index)"></i>
        </div>
      </dp-scroll-pane>
      <i class="el-icon-arrow-right" v-show="moveStatus" @click="moveTo('next')"></i>
    </div>
    <div class="right">
      <el-dropdown placement='bottom' @command="handleClick">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down tagsArrow"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command='1'>关闭左侧</el-dropdown-item>
            <el-dropdown-item :command='2'>关闭右侧</el-dropdown-item>
            <el-dropdown-item :command='3'>关闭其他</el-dropdown-item>
            <el-dropdown-item :command='4'>关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang='ts'>
import { ref, reactive, defineComponent, onMounted, nextTick, Ref, watch, onBeforeUpdate } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DpScrollPane from '@/components/DpScrollPane.vue'

export default defineComponent({
    components: { DpScrollPane },
    setup: () => {
        const $route = useRoute(),
            $router = useRouter()

        let visitedList: { path: string; name: any; query?: any }[] = reactive([{ path: '/home', name: '首页' }]),
            moveStatus: Ref<any> = ref(false),
            scrollPane: Ref<any> = ref(),
            tags: Ref<any> = ref([])

        // 显示左右移动按钮
        const showMoveBtn = (status: Boolean) => {
                if (status !== moveStatus.value) {
                    moveStatus.value = status
                }
            },
            // 左右移动
            moveTo = (status: any) => {
                scrollPane.value.moveToTags(status)
            },
            // 对当前标签进行处理
            handleClick = (val: number) => {
                let index: number = 0

                visitedList.some((item: any, idx: number) => {
                    if (item.path === $route.path) {
                        index = idx
                    }
                })
                if (val === 1) {
                    // 关闭左侧
                    visitedList.splice(1, index - 1)
                    nextTick(() => {
                        moveToCurrentTag(visitedList[0], 0)
                    })
                } else if (val === 2) {
                    let data = visitedList.slice(0, index + 1)
                    visitedList.length = 0
                    visitedList.push(...data)
                    nextTick(() => {
                        moveToCurrentTag(visitedList[0], 0)
                    })
                } else if (val === 3) {
                    if ($route.path !== '/home') {
                        visitedList.length = 0
                        visitedList.push({ path: '/home', name: '首页' }, { name: $route.name, path: $route.path, query: $route.query })
                    } else {
                        visitedList.length = 0
                        visitedList.push({ name: $route.name, path: $route.path, query: $route.query })
                    }
                    nextTick(() => {
                        moveToCurrentTag(visitedList[0], 0)
                    })
                } else if (val === 4) {
                    visitedList.length = 0
                    visitedList.push({ path: '/home', name: '首页' })
                    $router.push({ path: '/home' })
                    nextTick(() => {
                        moveToCurrentTag(visitedList[0], 0)
                    })
                }
            },
            // 添加标签
            addViewTags = (data: { path: string; name: any; query: any }) => {
                let status: boolean,
                    { name, path, query } = data

                if (['/', '/home'].includes(path)) {
                    return
                }
                // 有则替换
                status = visitedList.some((item: { path: any }, index: number) => {
                    if (item.path === path) {
                        visitedList.splice(index, 1, { name, path, query })
                        return true
                    }
                })
                // 无则添加
                if (!status) {
                    visitedList.push({ name, path, query })
                }
            },
            // 是否获得焦点
            isActive = (route: { path: string }) => {
                return route.path === $route.path
            },
            // 移动
            moveToCurrentTag = (data: { path: any }, type: 0 | 1) => {
                nextTick(() => {
                    let index: number = NaN

                    visitedList.some((item: { path: any }, idx: number) => {
                        if (item.path === data.path) {
                            index = idx
                        }
                    })

                    if (!index && index !== 0) {
                        return
                    }
                    if (type) {
                        //移动
                        scrollPane.value.moveToTarget(tags.value[index])
                    } else {
                        // 删除切换
                        scrollPane.value.delToTarget(tags.value[index])
                    }
                })
            },
            // 跳转链接
            toLink = (data: { path: any; query?: any }) => {
                $router.push({ path: data.path, query: data.query })
                moveToCurrentTag(data, 1)
            },
            // 删除标签
            delVisitedPage = (data: { path: any }, index: number) => {
                let newData: { path: string; name: any; query?: any }

                visitedList.splice(index, 1)

                if ($route.path !== data.path) {
                    return
                }
                if (visitedList.length === index) {
                    newData = visitedList[index - 1]
                } else {
                    newData = visitedList[index]
                }
                $router.push({ path: newData.path, query: newData.query })
                moveToCurrentTag(newData, 0)
            }

        // 确保在每次更新之前重置ref
        onBeforeUpdate(() => {
            tags.value = []
        })

        watch(
            () => $route,
            (val) => {
                //判断有无相同的route，有则跳转，无则新增再跳转
                addViewTags(val)
                moveToCurrentTag(val, 1)
            },
            { deep: true, immediate: true }
        )

        return { visitedList, moveStatus, showMoveBtn, handleClick, isActive, moveTo, toLink, delVisitedPage, scrollPane, tags }
    },
})
</script>

<style scoped lang='scss'>
@import '@/assets/css/theme.scss';
.tags_view {
    height: 24px;
    margin: 8px 20px 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .content {
        flex: 1;
        margin-right: 16px;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > i {
            cursor: pointer;
            display: inline-block;
            font-size: 16px;
        }
        > i:hover {
            color: $color;
        }
        .tags-view-wrapper {
            flex: 1;
            height: 100%;
            .tags-view-item {
                display: inline-block;
                position: relative;
                cursor: pointer;
                height: 24px;
                line-height: 24px;
                border-radius: 2px;
                color: rgba(153, 153, 153, 1);
                background: #fff;
                padding: 0 8px;
                font-size: 12px;
                margin-left: 8px;
                &.active {
                    color: $color;
                }
                i {
                    display: inline-block;
                    margin-left: 8px;
                    padding: 1px;
                    color: rgba(153, 153, 153, 1);
                    border-radius: 50%;
                }
                i:hover {
                    transition: all 0.5s;
                    color: #fff;
                    background-color: rgb(180, 188, 204);
                }
            }
        }
    }
    .el-dropdown-link {
        display: inline-block;
        border: 1px solid #fff;
        border-radius: 2px;
        background-color: #fff;
        height: 16px;
        width: 16px;
        text-align: center;
        i {
            font-size: 14px;
        }
    }
    .tagsArrow {
        width: 16px;
        height: 16px;
    }
}
</style>