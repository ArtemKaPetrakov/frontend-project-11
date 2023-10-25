import * as yup from 'yup'; // схема для валидации
import axios from 'axios'; // для http запросов

export const validate = (url, feeds) => {  
  const schema = yup
    .string() // строка 
    .trim() // преобразует и удалет начальные и конечные пробелы 
    .url() // Проверяет значение как допустимый URL-адрес с помощью регулярного выражения
    .required() // поле обязательное 
    .notOneOf(feeds); // Запретить значения из набора значений
  return schema.validate(url);
};

export const getData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`); // извлекаем содержимое страницы с избежанием политики одинакового происхождения и выклюаем кеш 

export const parserRss = (data) => {
  const parser = new DOMParser(); // позволяет парсить строчку HTMl // XML в DOM 
  const xmlDocument = parser.parseFromString(data, 'application/xml'); // парсим страничку - ПОЛУЧАЕМ DOM!!! учитываю вид строки application/xml - можно смотреть в config 

  if (xmlDocument.querySelector('parsererror')) {
    throw new Error ('invalidRss'); // ошибка, если не парсится ссылка 
  }

  const feedTitle = xmlDocument.querySelector('title').textContent;  // получаю title Фида 
  const feedDescription = xmlDocument.querySelector('description').textContent; // получаю description Фида 

  const posts = []; // создаю массив для постов 

  const postsElements = xmlDocument.querySelectorAll('item'); // ищу все элементы с постами 

  postsElements.forEach((post) => {
    const postTitle = post.querySelector('title').textContent; // ищу title для post 
    const postDescription = post.querySelector('description').textContent; // ищу descrition для post 
    const postLink = post.querySelector('link').textContent; // ищу link для post 
    posts.push({
      postTitle, postDescription, postLink,
    }); // создаю объект для каждого поста
  });

  return {
    feed: {
      feedTitle, feedDescription,
    },
    posts,
  }; // возвращаю объект с описанием feed и всех posts внутри этого feed
};