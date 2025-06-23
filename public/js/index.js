let postRank = 1;

function onJokeJson(json) {
    document.querySelector('#jotd p').textContent = json.attachments[0].text;
}

function onJokeErr(error) {
    document.querySelector('#jotd').remove();
}

function navClick(event) {
    if (event.currentTarget.dataset.current === '1') return;
    for (link of navAll)
        link.dataset.current = (link === event.currentTarget) ? '1' : '0';
    let activeNav = document.querySelector('nav a[data-current=\'1\']').textContent;
    fetch(BASE_URL + "/homeposts/" + activeNav).then(onResponse).then(loadPosts);
}

fetch('https://icanhazdadjoke.com/slack').then(onResponse, onJokeErr).then(onJokeJson);

function showPost(inputPost) { 
    const article = document.createElement('article');
    article.dataset.id = inputPost.id;

    const rank = document.createElement('span');
    rank.classList.add('rank');
    rank.textContent = postRank;
    postRank++;

    const votesDiv = makePostVotes(inputPost.upvotes, inputPost.downvotes);

    const entryDiv = document.createElement('div');
    entryDiv.classList.add('entry');

    const titleElem = document.createElement('p');
    titleElem.classList.add('title');
    const title = document.createElement('a');
    title.textContent = inputPost.title;
    title.href = BASE_URL + '/post/' + inputPost.id;
    titleElem.appendChild(title);
    const tagline = document.createElement('p');
    tagline.classList.add('tagline');
    tagline.textContent = 'submitted by';
    const author = document.createElement('a');
    author.classList.add('author');
    if (inputPost.author === 'x')
        author.textContent = '[deleted]';
    else {
        author.href = BASE_URL + '/profile/' + inputPost.author;
        author.textContent = inputPost.author;
    }
    tagline.appendChild(author);

    for (child of [titleElem, tagline, makePostButtons(title, inputPost)])
        entryDiv.appendChild(child);
    for (child of [rank, makePostHiddenDiv(), votesDiv, entryDiv])
        article.appendChild(child);
    mainSection.appendChild(article);
    article.querySelector('.hide-text a').addEventListener('click', hidePost);
    let userVote = inputPost.vote;
    if (isLogged && hasValue(userVote))
        loadVote(article, userVote);
    if (hasValue(inputPost.post_saved)) {
        article.querySelector('.buttons [data-func=\'save\']').textContent = 'unsave';
        let savedIcon = document.createElement('img');
        savedIcon.src = BASE_URL + '/assets/saved.png';
        tagline.appendChild(savedIcon);
    }
}

function loadPosts(json) {
    mainSection.innerHTML = '';
    postRank = 1;
    for (let entry of json)
        showPost(entry);
    if (mainSection.innerHTML === '')
        fillerText();
}

fetch(BASE_URL + '/homeposts').then(onResponse).then(loadPosts);
for (child of navAll)
    child.addEventListener('click', navClick);