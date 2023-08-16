// // Проверить на валдиность 

// // Поменять представление при отпрвке ссылки 
// // <p class="feedback m-0 position-absolute small text-danger"></p> - по умолчанию 
// // <p class="feedback m-0 position-absolute small text-success">RSS успешно загружен</p> - если ссылка корректна 
// // <p class="feedback m-0 position-absolute small text-success text-danger">Ссылка должна быть валидным URL</p> - если не валидная 


import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';



export default () => {

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const initialState = {
      // valid: true,
      formState: 'filling',
      // url: '',
      feeds: [],
      error: '', 
  };

  

  const validate = (url, feeds) => {
    
    const schema = yup
    .string() // строка 
    .trim() // преобразует и удалет начальные и конечные пробелы 
    .url() // Проверяет значение как допустимый URL-адрес с помощью регулярного выражения
    .required() // поле обязательное 
    .notOneOf(feeds); // Запретить значения из набора значений

    // try {
    //   schema.validateSync(url);
    //   return '';
    // } catch (error) {
    //   return error;
    // };

    return schema.validate(url);
  };

  const renderFormError = (state, elements) => {

    const { input, feedback } = elements;

    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');

    switch (state.error) {
      case 'url':
      feedback.textContent = 'плозхой юрл';
      break;
  
      case 'notOneOf':
        feedback.textContent = 'уже есть';
        break;
      
      default:
        feedback.textContent = `${state.error}`;
    }
  };


  const renderFormSuccess = (elements) => {

    const { form, input, feedback } = elements;

    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = 'Ништяк';
    form.reset();
    input.focus();
  };



  // Обработчик общий 
  const render = (state, elements) => (path, value) => {

    const { input, feedback } = elements;

    if (path === 'formState') {

      switch (value) {

        case 'filling':
        // input.textContent = state.url;
        break;

        case 'success':
        // input.classList.remove('is-invalid');
        // feedback.classList.remove('text-danger');
        // feedback.classList.add('text-success');
        // feedback.textContent = 'Ништяк';
        // form.reset();
        // input.focus();
        // break;

        return renderFormSuccess(elements);

        case 'error':
        // input.classList.add('is-invalid');
        // feedback.classList.remove('text-success');
        // feedback.classList.add('text-danger');

        // switch (state.error.type) {
        //   case 'url':
        //     feedback.textContent = 'плозхой юрл';
        //     break;
        
        //   case 'notOneOf':
        //     feedback.textContent = 'уже есть';
        //     break;
          
        //   default:
        //     feedback.textContent = 'хз что не так';
        // }
        // break;

        return renderFormError(state, elements);

        default:
          throw new Error(`Unknown state: ${state.error.type}`);
      }
    }
  };

  const state = onChange(initialState, render(initialState, elements));


  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');

    validate(url, state.feeds)
    .then(() => {
      state.formState = 'filling';
    })
    .then(() => {
      // console.log(url)
      initialState.feeds.push(url);
      initialState.error = '';
      state.formState = 'filling'; // как это убрать 
      state.formState = 'success';
    })
    .catch((error) => {
      initialState.error = error.type;
      state.formState = 'filling'; // как это убрать  
      state.formState = 'error';
      // console.log("Состояние -", state);
      // console.log("Ошибка -", state.error);
    });

    // state.formState = 'filling';
    // const error = validate(url, state.feeds);
    // console.log(validate(url, state.feeds))
    // state.error = error;
    // state.formState = _.isEmpty(state.error) ? 'success' : 'error';
    // // state.formState = 'filling';
    // // state.formState = _.isEmpty(state.error) ? 'success' : 'error';
    // if (state.formState === 'success') {
    //   state.feeds.push(url);
    // };
    // console.log("Валидация -", validate(url, state.feeds))
    // console.log("Состояние -", state);
    // console.log("Состояние -", initialState);
    // console.log("Форма -", state.formState);
    // console.log("Тип Ошибки -", state.error);
    // console.log("Фиды -", state.form.feeds);
  });
};



