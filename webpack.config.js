const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  // точка входа (ФАЙЛ КОТОРЫЙ СОДЕРЖИТ ВСЕ МОДУЛИ)
  module: {
    // лоадеры (какие преобразования нужно сделать, перед генерацией бандла)
    rules: [
      {
        test: /\.(scss)$/,
        // проверка файла на css 
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
         { 
          test: /\.(js)$/, use: 'babel-loader' 
        },
      
      // // Вторая — лоадер, используемый для обработки данного типа файлов (css-loader в нашем случае)
      // // Мы хотим не только импортировать такие файлы, но и поместить их в тег <style>, чтобы они применялись к элементам DOM. Для этого нужен style-loader.
      // { test: /\.(js)$/, use: 'babel-loader' },
      // // Лоадеры могут использоваться не только для импорта файлов, но и для их преобразования. Самым популярным является преобразование JavaScript следующего поколения в современный JavaScript с помощью Babel. Для этого используется babel-loader.
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  // Теперь вебпак знает о точке входа и лоадерах. Следующим шагом является указание директории для бандла. Для этого нужно добавить свойство output в настройки вебпака
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    // Основной задачей вебпака является генерация бандла, на который можно сослаться в index.html.
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
     // создавать файл со стилями
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: [
        './dist/**',
    ],
    }),
  ],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  //mode в значение production - минифицирует код пере деплоем и создаст оптимизированный бандл, development делает полню развертку файл
  devServer: {
    open: true,
    // открывает браузер после запуска
  }
};

/*Весь процесс выглядит примерно так:

Вебпак получает точку входа, находящуюся в ./src/index.js
Он анализирует операторы import / require и создает граф зависимостей
Вебпак начинает собирать бандл, преобразовывая код с помощью соответствующих лоадеров
Он собирает бандл и помещает его в dist/index_bundle.js
*/