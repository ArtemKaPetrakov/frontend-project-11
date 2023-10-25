import onChange from 'on-change';
import { uniqueId } from 'lodash';
import i18n from 'i18next';
import resources from './locales/index.js';

import render from './render.js'; // <---  импорт обработчиков из отдельного файла
import { validate, getData, parserRss } from './utils.js'; // <---  импорт утилит из отдельного файла


export default async () => { // добавил async для i18n

  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  }; // все необходимые элементы на странице 

  const initialState = {
      formState: 'filling', // ожидание 
      links: [],
      feeds: [],
      posts: [],
      error: '', 
  };

  const state = onChange(initialState, render(initialState, elements, i18nInstance));

  const addNewRss = (parsedRss, url) => {
    const { feed, posts } = parsedRss;
    feed.id = uniqueId(); // уникальный id для feed 
    feed.feedLink = url; // добавляем ссылку для feed 
    state.feeds.push(feed); // добавляем feed в вотчер 
    posts.forEach((post) => {
      post.postID = uniqueId(); // уникальный id для post 
      post.feedID = feed.id; // id feed для каждого post 
      state.posts.push(post); // пушаем все post
    }); // добавляем уникальный id для каждого feed, добавляем уникальный id для каждого поста и привязываем его к id feed 
  };

  elements.form.addEventListener('submit', (event) => {

    event.preventDefault(); // отменили отправку события 
    const formData = new FormData(event.target); // создаем объект на основе объекта, который был инициатором события 
    const url = formData.get('url'); // достаем URL с помощью метода get (name = "url")

    validate(url, initialState.links) // произвожу валидацию с учетом начального состояния 
    .then((validUrl) => { // возвращаю Promise и с помощью метода then произвожу дальнейшую обработку
      state.formState = 'sending'; // поменял состояние в ватчере на заполнение 
      return getData(validUrl); // вернул промис (извлекаем содержимое URl c помощью axios и get запроса)
    }) 
    .then((rss) => {
      const parsedRss = parserRss(rss.data.contents); // получили promise c HTML страничкой надо ее распарсить
      addNewRss(parsedRss, url);
      initialState.links.push(url); // добавляем новый url в список ссылок, чтобы проверять на повторный ввод 
      initialState.error = ''; // очищаем текст ошибки в состояние 
      state.formState = 'success'; // меняем состояние в вотчере, что все прошло на успешно
    })
    .catch((error) => {
      initialState.error = error.type ?? error.message; // записываю тип ошибки (генерируется из валидации) или записываю сообщание ошибки (error - это объенкт и его можно посмотреть {error})
      state.formState = 'sending'; // как это убрать СРОЧНО   <-- тут есть проблема, надо ее решить 
      state.formState = 'error'; // меняю состояение в вотчере на 'erroe'
    });
    console.log('state - ', state)
  });
};



