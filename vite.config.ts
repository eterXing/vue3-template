/*
 * @Date: 2021-03-19 17:32:47
 * @LastEditTime: 2021-03-23 18:01:31
 * @Description: vite配置文件
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

function pathResolve(dir) {
    return resolve(__dirname, './', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    resolve: {
        alias: {
            '@': pathResolve('src')
        }
    },

    server: {
        port: 9999,
        open: true,
        cors: true
    },
    css: {
        preprocessorOptions: {
            scss: {
                theme: '@import "@/assets/css/theme.scss";'
            }
        }
    },
    plugins: [vue()]
})