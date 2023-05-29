import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src'),
      '~@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: atRule => {
              if (atRule.name === 'charset') atRule.remove();
            },
          },
        },
      ],
    },
    preprocessorOptions: {
      scss: {
        additionalData(content, resourcePath: string) {
          const stylesStr = [
            '@use "sass:math";',
          ].join(' ');
          const styleRootPath = path.join(__dirname, 'src/styles').replace(/\\/g, '/');
          // styles文件夹下不导入上面文件
          if (resourcePath.startsWith(styleRootPath)) return content;

          return stylesStr + content;
        },
        charset: false,
      },
    },
  },
})
