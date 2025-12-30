import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import prettierConfig from '@vue/eslint-config-prettier'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  prettierConfig,
  {
    files: ['**/*.vue', '**/*.ts', '**/*.tsx'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
]
