import { uniqueId } from 'lodash';

const renderInput = (state, i18nextInstance) => {
  const form = document.querySelector('.rss-form');
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const submitButton = document.querySelector('button[type="submit"]');

  switch (state.form.valid) {
    case 'invalid':
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = state.form.validationErrors[0];
      submitButton.disabled = false;
      input.readOnly = false;
      break;
    case 'waitingResponse':
      submitButton.disabled = true;
      input.readOnly = true;
      break;
    case 'filling':
      submitButton.disabled = false;
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18nextInstance.t('success');
      input.readOnly = false;
      input.value = '';
      input.focus();
  }
};

const renderFeeds = (state, i18nextInstance) => {
  const feedLists = document.querySelector('.feeds');

  const feedCards = document.createElement('div');
  feedCards.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nextInstance.t('feeds');

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  const listGroupItem = document.createElement('li');
  listGroupItem.classList.add('list-group-item', 'border-0', 'border-end-0');

  const listTitle = document.createElement('h3');
  listTitle.classList.add('h6', 'm-0');
  const listDescription = document.createElement('p');
  listDescription.classList.add('m-0', 'small', 'text-black-50');

  if (!feedLists.hasChildNodes()) {
    cardBody.appendChild(cardTitle);
  }
  feedLists.appendChild(feedCards);
  feedCards.appendChild(cardBody);

  state.rssContent.feeds.forEach((el) => {
    listGroup.appendChild(listGroupItem);
    listTitle.textContent = el.title;
    listDescription.textContent = el.description;

    listGroupItem.appendChild(listTitle);
    listGroupItem.appendChild(listDescription);
    feedCards.appendChild(listGroup);
  });
};

const renderPosts = (state, i18nextInstance) => {
  const postsDiv = document.querySelector('.posts');
  const feedCard = document.createElement('div');
  feedCard.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nextInstance.t('posts');

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  cardBody.appendChild(cardTitle);

  state.rssContent.feeds.forEach((feed) => {
    feed.posts.forEach((post) => {
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
      listLink.setAttribute('data-id', uniqueId());
      listLink.textContent = post.title;
      listLink.href = post.link;

      listGroupItem.appendChild(listLink);

      // Вставляем новый элемент перед первым элементом списка
      listGroup.insertBefore(listGroupItem, listGroup.firstChild);
    });

    feedCard.appendChild(cardBody);
    feedCard.appendChild(listGroup);
  });

  postsDiv.innerHTML = '';
  postsDiv.appendChild(feedCard);
};

export { renderInput, renderFeeds, renderPosts };
