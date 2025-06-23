const currUser = document.querySelector('.side h2').textContent;
const topMenu = document.querySelector('.top-menu');
const descDiv = document.querySelector('.side .desc');
const descButton = document.querySelector('.side a');
const wikiSection = document.querySelector('.wiki-section');
const wikiBar = wikiSection.querySelector('input');
const searchMenu = document.querySelector('.wiki-results');
const wikiList = document.querySelector('.wiki-list');

function navClick(event) {
    if (event.currentTarget.dataset.current === '1') return;
    for (link of navAll)
        link.dataset.current = (link === event.currentTarget) ? '1' : '0';
    let activeNav = document.querySelector('nav a[data-current=\'1\']').textContent;
    if (activeNav === 'comments' || activeNav === 'posts')
        fetch(BASE_URL + '/load/profile/' + currUser + '/' + activeNav).then(onResponse).then(onJson);
    else if (activeNav === 'saved')
        fetch(BASE_URL + '/load/saves').then(onResponse).then(onJson);
    else if (activeNav === 'wiki')
        fetch(BASE_URL + '/wiki?action=get').then(onResponse).then(showWiki);
    else fetch(BASE_URL + '/load/profile/' + currUser).then(onResponse).then(onJson);
}

document.querySelector('.dropdown').addEventListener('click', sortMenu);
for (child of navAll)
    child.addEventListener('click', navClick);

function showComment(inputComment) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.dataset.id = inputComment.comment_id;

    commentDiv.appendChild(makeCommentVotes());

    const entry = document.createElement('div');
    entry.classList.add('entry');
    commentDiv.appendChild(entry);

    const tagline = document.createElement('p');
    tagline.classList.add('tagline');
    const expandButton = document.createElement('a');
    expandButton.classList.add('expand');
    expandButton.textContent = '[-]';
    const authorElem = document.createElement('a');
    authorElem.classList.add('author');
    authorElem.href = BASE_URL + '/profile/' + currUser;
    authorElem.textContent = currUser;
    const pointsElem = document.createElement('span');
    if (!inputComment.comment_id) {
        inputComment.all_upvotes = inputComment.upvotes;
        inputComment.all_downvotes = inputComment.downvotes;
        inputComment.all_dates = inputComment.comment_date;
    }
    let score = inputComment.all_upvotes - inputComment.all_downvotes;
    pointsElem.textContent = score + ' points';
    pointsElem.classList.add('points-tag');
    const dateElem = document.createElement('span');
    dateElem.textContent = inputComment.all_dates;
    dateElem.classList.add('date-tag');
    for (let tag of [expandButton, authorElem, pointsElem, dateElem])
        tagline.appendChild(tag);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');
    const saveButton = document.createElement('a');
    saveButton.textContent = 'save';
    if (isLogged)
        saveButton.addEventListener('click', save);
    else saveButton.href = BASE_URL + '/login?required=save';
    const fullComments = document.createElement('a');
    fullComments.textContent = 'full comments (' + inputComment.parent_count + ')';
    fullComments.href = BASE_URL + '/post/' + inputComment.parent_post;
    for (let button of [saveButton, fullComments])
        buttonsDiv.appendChild(button);

    for (let elem of [tagline, makeCommentContent(inputComment), buttonsDiv])
        entry.appendChild(elem);

    mainSection.appendChild(commentParent(inputComment));
    mainSection.appendChild(commentDiv);

    expandButton.addEventListener('click', hideComment);
    
    let userVote = inputComment.vote;
    if (!hasValue(userVote))
        userVote = inputComment.comment_vote;
    if (isLogged && hasValue(userVote))
        loadVote(commentDiv, userVote);
    if (hasValue(inputComment.comment_saved)) {
        saveButton.textContent = 'unsave';
        let savedIcon = document.createElement('img');
        savedIcon.src = BASE_URL + '/assets/saved.png';
        tagline.appendChild(savedIcon);
    }
}

function showPost(inputPost) {
    if (!inputPost.post_id) {
        inputPost.post_id = inputPost.id;
        inputPost.all_upvotes = inputPost.upvotes;
        inputPost.all_downvotes = inputPost.downvotes;
        inputPost.post_title = inputPost.title;
    }
    const article = document.createElement('article');
    article.dataset.id = inputPost.post_id;

    const votesDiv = makePostVotes(inputPost.all_upvotes, inputPost.all_downvotes);

    const entryDiv = document.createElement('div');
    entryDiv.classList.add('entry');

    const titleElem = document.createElement('p');
    titleElem.classList.add('title');
    const title = document.createElement('a');
    title.textContent = inputPost.post_title;
    title.href = BASE_URL + '/post/' + inputPost.post_id;
    titleElem.appendChild(title);
    const tagline = document.createElement('p');
    tagline.classList.add('tagline');
    tagline.textContent = 'submitted by';
    const author = document.createElement('a');
    author.classList.add('author');
    author.textContent = currUser;
    author.href = BASE_URL + '/profile/' + currUser;
    tagline.appendChild(author);

    for (child of [titleElem, tagline, makePostButtons(title, inputPost)])
        entryDiv.appendChild(child);
    for (child of [makePostHiddenDiv(), votesDiv, entryDiv])
        article.appendChild(child);
    mainSection.appendChild(article);
    article.querySelector('.hide-text a').addEventListener('click', hidePost);
    
    let userVote = inputPost.vote;
    if (!hasValue(userVote))
        userVote = inputPost.post_vote;
    if (isLogged && hasValue(userVote))
        loadVote(article, userVote);
    if (hasValue(inputPost.post_saved)) {
        article.querySelector('.buttons [data-func=\'save\']').textContent = 'unsave';
        let savedIcon = document.createElement('img');
        savedIcon.src = BASE_URL + '/assets/saved.png';
        tagline.appendChild(savedIcon);
    }
}

function onJson(json) {
    mainSection.classList.remove('hidden');
    topMenu.classList.remove('hidden');
    wikiSection.parentNode.classList.add('hidden');
    mainSection.innerHTML = '';
    for (let entry of json) {
        if (entry.comment_id || entry.comment_date)
            showComment(entry);
        else if (entry.post_id || entry.post_date)
            showPost(entry);
    }
    if (mainSection.innerHTML === '')
        fillerText(mainSection);
}

fetch(BASE_URL + '/load/profile/' + currUser).then(onResponse).then(onJson);

function sortComments(event) {
    let option = event.currentTarget.textContent;
    let currentNav = document.querySelector('nav a[data-current=\'1\']').textContent;
    if (currentNav === 'comments' || currentNav === 'posts')
        fetch(BASE_URL + '/load/profile/' + currUser + '/' + currentNav + '/' + option).then(onResponse).then(onJson);
    else if (currentNav === 'saved')
        fetch(BASE_URL + '/load/saves/' + option).then(onResponse).then(onJson);
    else if (currentNav === 'overview')
        fetch(BASE_URL + '/load/profile/' + currUser + '/all/' + option).then(onResponse).then(onJson);
    document.querySelector('.dropdown span').textContent = option;
}

for (let choice of document.querySelectorAll('.drop-choices a'))
    choice.addEventListener('click', sortComments);

function descOptionRefresh() {
    const icon = descButton.querySelector('img');
    if (document.querySelector('.desc').textContent.length === 0) {
        icon.src = BASE_URL + '/assets/penciladd.png';
        descButton.querySelector('span').textContent = 'add description';
    } else {
        icon.src = BASE_URL + '/assets/pencil.png';
        descButton.querySelector('span').textContent = 'edit description';
    }
}

function closeEditor(event) {
    getParent(event, 2).remove();
}

function refreshDesc(json) {
    if (hasValue(json.new_desc))
        descDiv.textContent = json.new_desc;
    else descDiv.innerHTML = '';
    descOptionRefresh();
}

function sendDesc(event) {
    if (event.currentTarget.desc.value.length < 255) {
        const form_data = {method: 'post', body: new FormData(event.currentTarget)};
        fetch(BASE_URL + '/descedit', form_data).then(onResponse).then(refreshDesc);
        event.currentTarget.remove();
    }
    event.preventDefault();
}

function editDesc(event) {
    const descForm = descDiv.appendChild(document.createElement('form'));
    descForm.method = 'post';
    
    const editor = descForm.appendChild(document.createElement('textarea'));
    editor.name = 'desc';

    const bottomDiv = descForm.appendChild(document.createElement('div'));
    const saveButton = bottomDiv.appendChild(document.createElement('button'));
    saveButton.type = 'submit';
    saveButton.textContent = 'save';

    const csrfInput = bottomDiv.appendChild(document.createElement('input'));
    csrfInput.type = 'hidden';
    csrfInput.name = '_token';
    csrfInput.value = giveToken();

    const cancelButton = bottomDiv.appendChild(document.createElement('button'));
    cancelButton.textContent = 'cancel';

    const counterElem = bottomDiv.appendChild(document.createElement('span'));
    bottomDiv.dataset.val = '0';
    counterElem.textContent = '0/255';
    editor.addEventListener('input', lenCheckDesc);
    cancelButton.addEventListener('click', closeEditor);
    descForm.addEventListener('submit', sendDesc);
}

if (descButton) {
    descButton.addEventListener('click', editDesc);
    descOptionRefresh();
}

function showWiki(json) {
    wikiSection.parentNode.classList.remove('hidden');
    mainSection.classList.add('hidden');
    topMenu.classList.add('hidden');
    wikiList.innerHTML = '';
    for (let entry of json) {
        showArticle(entry);
    }
    if (wikiList.innerHTML === '')
        fillerText(wikiList);
}

function showArticle(inputArticle) {
    if (wikiList.querySelector('.filler'))
        wikiList.querySelector('.filler').remove();
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('wiki-entry');
    entryDiv.dataset.id = inputArticle.id;
    const linkDiv = document.createElement('div');
    const link = document.createElement('a');
    link.textContent = inputArticle.title;
    link.href = inputArticle.link;
    const deleteButton = document.createElement('span');
    deleteButton.textContent = 'delete';
    deleteButton.addEventListener('click', deleteWiki);
    linkDiv.appendChild(link);
    entryDiv.appendChild(linkDiv);
    entryDiv.appendChild(deleteButton);
    wikiList.appendChild(entryDiv);
}

function addWiki(event) {
    fetch(BASE_URL + '/wiki?action=add&link=' + encodeURIComponent(event.currentTarget.dataset.link) + '&title='
        + encodeURIComponent(event.currentTarget.textContent)).then(onResponse).then(showArticle);
}

function deleteWiki(event) {
    fetch(BASE_URL + '/wiki?action=delete&id=' + encodeURIComponent(event.currentTarget.parentNode.dataset.id)).then(refreshWiki);
}

function refreshWiki(response) {
    if (!response.ok) {
        console.log('Error during the database connection.');
        return null;
    } else fetch(BASE_URL + '/wiki?action=get').then(onResponse).then(showWiki);
}

function showSearch() {
    searchMenu.classList.remove('hidden');
}

function blurSearch(event) {
    if (event.currentTarget.parentNode !== searchMenu && event.currentTarget !== wikiBar)
        searchMenu.classList.add('hidden');
    event.stopPropagation();
}

function onWikiJson(json) {
    searchMenu.innerHTML = '';
    let total = json[1].length;
    for (let i = 0; i < total; i++) {
        let result = document.createElement('a');
        result.textContent = json[1][i];
        result.dataset.link = json[3][i];
        searchMenu.appendChild(result);
        result.addEventListener('click', addWiki);
    }
}

function wikiFunc(event) {
    showSearch();
    if (event.currentTarget.value.length > 2)
        fetch("https://en.wikipedia.org/w/api.php?action=opensearch&search=" + event.currentTarget.value
            + "&limit=10&origin=*&format=json").then(onResponse).then(onWikiJson);
}

wikiBar.addEventListener('input', wikiFunc);
document.addEventListener('click', blurSearch);
wikiBar.addEventListener('focus', showSearch);