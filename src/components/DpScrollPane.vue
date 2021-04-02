<!--
 * @Date: 2021-03-29 14:32:55
 * @LastEditTime: 2021-04-02 14:37:47
 * @Description: 标签滚动相关
-->
<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent } from 'vue'
export default defineComponent({
    setup: (props, context) => {
        const padding = 8
        let left = ref(0),
            scrollContainer: any = ref(null),
            scrollWrapper: any = ref(null)

        // 鼠标滚动
        const handleScroll = (e: { wheelDelta: number; deltaY: number }) => {
                const eventDelta = e.wheelDelta || -e.deltaY * 3,
                    $containerWidth = scrollContainer.offsetWidth,
                    $wrapperWidth = scrollWrapper.offsetWidth

                if (eventDelta > 0) {
                    left.value = Math.min(0, left.value + eventDelta)
                } else if ($containerWidth - padding < $wrapperWidth) {
                    if (left.value < -($wrapperWidth - $containerWidth + padding)) {
                        left.value = left.value
                    } else {
                        left.value = Math.max(left.value + eventDelta, $containerWidth - $wrapperWidth - padding)
                    }
                } else {
                    left.value = 0
                }
            },
            // 选中标签
            moveToTarget = ($target: any) => {
                const $containerWidth = scrollContainer.offsetWidth,
                    $targetLeft = $target.offsetLeft,
                    $targetWidth = $target.offsetWidth,
                    $wrapperWidth = scrollWrapper.offsetWidth // 总长度

                if ($targetLeft < -left.value) {
                    // 标签在左边
                    left.value = -$targetLeft + padding
                } else if ($targetLeft + padding > -left.value && $targetLeft + $targetWidth < -left.value + $containerWidth - padding) {
                    // 标签在当前显示列表中
                } else {
                    // 标签在右边
                    left.value = -($targetLeft - ($containerWidth - $targetWidth) + padding)
                }

                // 判断总长度和标签长度计算左右按钮显隐
                if ($wrapperWidth > $containerWidth) {
                    context.emit('showMoveBtn', true)
                } else {
                    context.emit('showMoveBtn', false)
                }
            },
            // 左右按钮移动
            moveToTags = (status: string) => {
                const $containerWidth = scrollContainer.offsetWidth, // 屏幕长度
                    $wrapperWidth = scrollWrapper.offsetWidth // 总长度

                if ($containerWidth >= $wrapperWidth) {
                    return
                }
                // 右移
                if (status === 'next') {
                    if ($wrapperWidth - $containerWidth + left.value <= $containerWidth) {
                        left.value = $containerWidth - $wrapperWidth
                    } else {
                        left.value = left.value - $containerWidth
                    }
                } else if (status === 'prev') {
                    if ($containerWidth + left.value > 0) {
                        left.value = 0
                    } else {
                        left.value = left.value + $containerWidth
                    }
                }
            },
            // 删除标签
            delToTarget = () => {
                const $containerWidth = scrollContainer.offsetWidth, // 屏幕长度
                    $wrapperWidth = scrollWrapper.offsetWidth // 总长度

                if ($wrapperWidth <= $containerWidth) {
                    left.value = 0
                } else if (-left.value + $containerWidth >= $wrapperWidth) {
                    left.value = $containerWidth - $wrapperWidth
                }

                // 判断总长度和标签长度计算左右按钮显隐
                if ($wrapperWidth <= $containerWidth) {
                    context.emit('showMoveBtn', false)
                }
            }

        return { left, scrollContainer, scrollWrapper, handleScroll, moveToTarget, moveToTags, delToTarget }
    },
})
</script>

<style scoped lang='scss'>
.scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    .scroll-wrapper {
        transition: all 0.4s;
        position: absolute;
    }
}
</style>