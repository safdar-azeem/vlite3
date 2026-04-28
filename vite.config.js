import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        tailwindcss(),
        dts({
            tsconfigPath: './tsconfig.app.json',
            insertTypesEntry: true,
            exclude: ['src/playground', 'src/App.vue', 'src/main.ts'],
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        lib: {
            entry: {
                index: path.resolve(__dirname, 'src/index.ts'),
                'test/index': path.resolve(__dirname, 'src/test/index.ts'),
            },
            name: 'vlite3',
            formats: ['es'],
        },
        rollupOptions: {
            // Externalize deps that should not be bundled
            external: function (id) {
                var externals = [
                    'vue',
                    'v-tooltip-lite',
                    'v-datepicker-lite',
                    'v-event-calendar',
                    'v-notion-editor',
                    'vue-carousel-lite',
                    '@vueuse/core',
                    '@vueuse/integrations',
                    '@iconify/vue',
                    'vue-router',
                    'vue-draggable-plus',
                    '@jaames/iro',
                    'iconify-icon-picker',
                    'vue3-google-signin',
                    'scrollreveal',
                    'xlsx',
                    'v-file-preview',
                    'file-saver',
                    'papaparse',
                    'jsbarcode',
                    'dayjs',
                    'qrcode',
                    '@vue/test-utils',
                ];
                // Check exact match or start with for scoped packages if needed
                // For simple behavior, we can check if the id starts with the external name
                return externals.some(function (ext) { return id === ext || id.startsWith(ext + '/'); });
            },
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
                exports: 'named',
                assetFileNames: 'style.[ext]',
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
});
