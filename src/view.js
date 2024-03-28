const renderInput = (state, i18nextInstance) => {
  const form = document.querySelector('.rss-form');
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const submitButton = document.querySelector('button[type="submit"]');

  if (state.form.valid === 'valid') {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18nextInstance.t('success');
    input.value = '';
    input.focus();
  } else {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = state.errors[0];
  }
};

const renderFeeds = (state) => {
  const feedLists = document.querySelector('.feeds');

  const feedCards = document.createElement('div');
  feedCards.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = 'Фиды';

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  const listGroupItem = document.createElement('li');
  listGroupItem.classList.add('list-group', 'border-0', 'rounded-0');

  const listTitle = document.createElement('h3');
  listTitle.classList.add('h6', 'm-0');
  const listDescription = document.createElement('p');
  listDescription.classList.add('m-0', 'small', 'text-black-50');

  if (!feedLists.hasChildNodes()) {
    feedLists.appendChild(feedCards);
    feedCards.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
  }

  state.rssContent.feeds.forEach((el) => {
    listGroup.appendChild(listGroupItem);
    listTitle.textContent = el.title;
    listDescription.textContent = el.description;

    listGroupItem.appendChild(listTitle);
    listGroupItem.appendChild(listDescription);
    feedCards.appendChild(listGroup);
  });
};

const renderPosts = (state) => {
  const postsDiv = document.querySelector('.posts');

  const postsCards = document.createElement('div');
  postsCards.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = 'Посты';

  if (!postsDiv.hasChildNodes()) {
    cardBody.appendChild(cardTitle);
    postsCards.appendChild(cardBody);
    postsDiv.appendChild(postsCards);
  }

  state.rssContent.feeds.forEach((el) => {
    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group', 'border-0', 'rounded-0');

    el.posts.forEach((post) => {
      const listGroupItem = document.createElement('li');
      listGroupItem.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0',
      );

      const listLink = document.createElement('a');
      listLink.classList.add('fw-bold');
      listLink.setAttribute('target', '_blank');
      listLink.setAttribute('rel', 'noopener noreferrer');
      listLink.textContent = post.title;

      listLink.href = post.link;

      listGroupItem.appendChild(listLink);
      listGroup.appendChild(listGroupItem);
    });

    cardBody.appendChild(listGroup); // Добавляем список группы в тело карточки постов
  });
};

export { renderInput, renderFeeds, renderPosts };
