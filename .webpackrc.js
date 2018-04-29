export default {
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['react-hot-loader/babel'],
    },
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  proxy: {
    '/api': {
      'target': 'http://localhost:7001/',
      // 'changeOrigin': true,
      //'pathRewrite': { '^/api': '' },
    },
  },
};
