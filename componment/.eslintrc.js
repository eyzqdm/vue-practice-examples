module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: 0,
    'space-before-blocks': 0,
    'brace-style': 0,
    'handle-callback-err': 0,
    'lines-between-class-members': 0,
    'object-curly-newline': 0,
    'no-constant-condition': 0,
    'no-parsing-error': 0,
    'no-callback-literal': 0,
    'standard/no-callback-literal': 0
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      legacyDecorators: true
    }
  }
}
