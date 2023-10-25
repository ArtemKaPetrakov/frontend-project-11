
const createFeedItem = (feed) => { // функция создает Фид с класссами и атрибутами 
  const feedItem = document.createElement('li');
  feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');

  const feedHeader = document.createElement('h3'); // создаем Хедер 
  feedHeader.classList.add('h6', 'm-0');
  feedHeader.textContent = feed.feedTitle;
  feedItem.append(feedHeader); // помещаем в item 

  const feedBody = document.createElement('p'); // созадем Описание
  feedBody.classList.add('m-0', 'small', 'text-black-50');
  feedBody.textContent = feed.feedDescription;

  feedItem.append(feedBody); // помещаем в item 

  return feedItem; // возвращаем 
};

const createPostItem = (post) => { // создаем Пост 
  const postItem = document.createElement('li');
  postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const postLink = document.createElement('a'); // создаем ссылку нв пост 
  postLink.setAttribute('href', `${post.postLink}`);
  postLink.classList.add('fw-bold');
  postLink.setAttribute('data-id', `${post.postID}`);
  postLink.setAttribute('target', '_blank');
  postLink.setAttribute('rel', 'noopener noreferrer');
  postLink.textContent = post.postTitle;

  postItem.append(postLink); // помещаем в item 

  return postItem;
};

// ----------------- тут магия 

const createFeedsContainer = (container, i18nInstance) => {
  const feedsContainer = document.createElement('div');
  feedsContainer.classList.add('card', 'border-0');
  feedsContainer.innerHTML = `<div class="card-body"><h2 class="card-title h4">Фиды</h2></div>`;
  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');
  feedsContainer.append(feedsList);
  container.append(feedsContainer);
};

const createPostsContainer = (container, i18nInstance) => {
  const postsContainer = document.createElement('div');
  postsContainer.classList.add('card', 'border-0');
  postsContainer.innerHTML = `<div class="card-body"><h2 class="card-title h4">Посты</h2></div>`;
  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');
  postsContainer.append(postsList);
  container.append(postsContainer);
};

const renderContent = (state, elements, i18nInstance) => {

  const { feeds, posts } = elements;

  feeds.replaceChildren(); // каждый раз очищаю по итогу остается один в конце!
  posts.replaceChildren(); // каждый раз очищаю и остается оджин в конце!

  createFeedsContainer(feeds, i18nInstance);
  const feedsList = feeds.querySelector('ul');

  createPostsContainer(posts, i18nInstance);
  const postsList = posts.querySelector('ul');

  state.feeds.forEach((feed) => feedsList.append(createFeedItem(feed)));
  state.posts.forEach((post) => postsList.append(createPostItem(post)));


  return state;
};

// ------------------------------------------


const renderFormError = (state, elements, i18nInstance) => {

  const { input, feedback } = elements;

  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');

  switch (state.error) {
    case 'url':
      feedback.textContent = i18nInstance.t('feedback.url'); // валидный url 
    break;

    case 'notOneOf':
      feedback.textContent = i18nInstance.t('feedback.notOneOf'); // не совпадает 
      break;
    case 'invalidRss': 
      feedback.textContent = i18nInstance.t('feedback.invalidRss'); // не валидный RSS
      break; 

    case 'Network Error': 
      feedback.textContent = i18nInstance.t('feedback.networkError'); // случайно нашел не работает интернет 
      break;  
    
    default:
      feedback.textContent = `${state.error}`;
  }
};

const renderFormSuccess = (elements, i18nInstance) => {

  const { form, input, feedback } = elements;

  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18nInstance.t('feedback.success');
  form.reset();
  input.focus();
};


const handleFormState = (state, elements, i18nInstance) => {

  const { feedback } = elements;

    switch (state.formState) {
      case 'sending':
        feedback.textContent = '';
      break;
      case 'success':
        return renderFormSuccess(elements, i18nInstance);
      case 'error':
        return renderFormError(state, elements, i18nInstance);
      default:
        throw new Error(`Unknown state: ${state.formState}`);
    }
    return state;
};

export default (state, elements, i18nInstance) => (path) => {
  switch (path) {
    case 'formState': 
      return handleFormState(state, elements, i18nInstance); 
    case 'feeds':
    case 'posts':
     return renderContent(state, elements, i18nInstance);  
      default:
    throw new Error(`Unknown path: ${path}`);
  }
};