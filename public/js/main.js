const isLogged = /logout/.test(document.querySelector('header div').textContent);
const navAll = document.querySelectorAll('nav a');
const mainSection = document.querySelector('.all-entries');

function onResponse(response) {
    return response.json();
}

function onSaveResponse(response) {
    if (!response.ok) {
        console.log('Error during the database connection.');
        return null;
    }
}

function getParent(event, num) {
    let elem = event.currentTarget;
    for (let i = 0; i < num; i++)
        elem = elem.parentNode;
    return elem;
}

function hasValue(variable) {
    return (variable !== null && variable !== undefined);
}

function removeIfExists(elem) {
    if (elem) elem.remove();
}

function fillerText(elem) {
    const fillerDiv = document.createElement('div');
    fillerDiv.classList.add('filler');
    fillerDiv.textContent = 'There is nothing here!';
    elem.appendChild(fillerDiv);
}

function sortHide() {
    document.querySelector('.drop-choices').classList.add('hidden');
}

function sortMenu(event) {
    document.querySelector('.drop-choices').classList.remove('hidden');
    event.stopPropagation();
    document.addEventListener('click', sortHide);
}

let isShareClick = false;

function clickedOnMenu() {
    isShareClick = true;
}

function shareBlur() {
    const icon = document.querySelector('.share-menu a');
    if (icon) {
        if (!isShareClick)
            icon.parentNode.remove();
        isShareClick = false;
    }
}

function copied(event) {
    clickedOnMenu();
    let button = event.currentTarget;
    button.querySelector('img').src = BASE_URL + '/assets/sharecheck.png';
    button.parentNode.querySelector('p').textContent = 'Copied!';
    button.removeEventListener('click', copied);
}

function sharePost(event) {
    let otherMenu = document.querySelector('.share-menu');
    if (otherMenu)
        otherMenu.remove();
    clickedOnMenu();
    const shareDiv = document.createElement('div');
    event.currentTarget.parentNode.appendChild(shareDiv);
    shareDiv.classList.add('share-menu');
    const linkButton = shareDiv.appendChild(document.createElement('a'));
    linkButton.href = '#';
    linkButton.appendChild(document.createElement('img')).src = BASE_URL + '/assets/sharebutton.png';
    shareDiv.appendChild(document.createElement('p')).textContent = 'Copy link';
    linkButton.addEventListener('click', copied);
    document.addEventListener('click', shareBlur);
    shareDiv.addEventListener('click', clickedOnMenu);
}

function hidePost(event) {
    let curPost = (event.currentTarget.parentNode.querySelector('.share'))
        ? getParent(event, 3) : getParent(event, 2);
    for (const child of curPost.querySelectorAll('.votes, .entry, .thumbnail, .hide-text'))
        child.classList.toggle('hidden');
}

function lenCheckAll(event, max) {
    const counter = event.currentTarget.parentNode.querySelector('div span');
    let chars = event.currentTarget.value.length;
    if (chars > max)
        counter.dataset.val = '2';
    else if (chars > max * 0.9)
        counter.dataset.val = '1';
    else counter.dataset.val = '0';
    counter.textContent = chars + '/' + max;
}

function lenCheck(event) {
    lenCheckAll(event, 1000);
}

function lenCheckDesc(event) {
    lenCheckAll(event, 255);
}

function convertVote(value) {
    if (value === 'up') return 1;
    if (value === 'down') return -1;
    if (value === 'none') return 0;
}

function vote(event) {
    const currVal = event.currentTarget.dataset.arrow;
    let other;
    for (let button of event.currentTarget.parentNode.querySelectorAll('img'))
        if (button.dataset.arrow !== currVal)
            other = button;
    other.src = BASE_URL + '/assets/arrow' + other.dataset.arrow + '.png';
    event.currentTarget.src = BASE_URL + '/assets/' + currVal + 'vote.png';
    event.currentTarget.removeEventListener('click', vote);
    other.removeEventListener('click', removeVote);
    other.addEventListener('click', vote);
    event.currentTarget.addEventListener('click', removeVote);
    const currId = getParent(event, 2).dataset.id;
    let scoreDiv = event.currentTarget.parentNode.querySelector('.score');
    let entryType = (scoreDiv) ? 'post' : 'comment';
    if (scoreDiv) {
        let increment = convertVote(currVal) - convertVote(scoreDiv.dataset.vote);
        if (increment < 0)
            for (let i = 0; i > increment; i--)
                scoreDiv.textContent--;
        else
            for (let i = 0; i < increment; i++)
                scoreDiv.textContent++;
        scoreDiv.dataset.vote = currVal;
    }
    fetch(BASE_URL + '/vote/' + currVal + '/' + entryType + '/' + currId).then(onSaveResponse);
}

function removeVote(event) {
    const currVal = event.currentTarget.dataset.arrow;
    event.currentTarget.src = BASE_URL + '/assets/arrow' + currVal + '.png';
    event.currentTarget.removeEventListener('click', removeVote);
    event.currentTarget.addEventListener('click', vote);
    const currId = getParent(event, 2).dataset.id;
    let scoreDiv = event.currentTarget.parentNode.querySelector('.score');
    let entryType = (scoreDiv) ? 'post' : 'comment';
    if (scoreDiv) {
        if (scoreDiv.dataset.vote === 'up')
            scoreDiv.textContent--;
        if (scoreDiv.dataset.vote === 'down')
            scoreDiv.textContent++;
        scoreDiv.dataset.vote = 'none';
    }
    fetch(BASE_URL + '/vote/remove/' + entryType + '/' + currId).then(onSaveResponse);
}

function loadVote(entry, inputVote) {
    let current, other;
    for (let button of entry.querySelectorAll('.arrow')) {
        if (button.dataset.arrow === inputVote)
            current = button;
        else other = button;
    }
    other.src = BASE_URL + '/assets/arrow' + other.dataset.arrow + '.png';
    current.src = BASE_URL + '/assets/' + current.dataset.arrow + 'vote.png';
    let score = current.parentNode.querySelector('.score');
    if (score)
        score.dataset.vote = current.dataset.arrow;
    current.removeEventListener('click', vote);
    current.addEventListener('click', removeVote);
}

function commentParent(inputComment) {
    const parentDiv = document.createElement('div');
    parentDiv.classList.add('parent-post');
    const postTitle = document.createElement('a');
    postTitle.classList.add('post-title');
    postTitle.href = BASE_URL + '/post/' + inputComment.parent_post;
    postTitle.textContent = inputComment.parent_title;
    const authorSpan = document.createElement('span');
    authorSpan.textContent = ' by ';
    const authorLink = document.createElement('a');
    authorLink.classList.add('author');
    if (inputComment.author === 'x')
        authorLink.textContent = '[deleted]';
    else {
        authorLink.href = BASE_URL + '/profile/' + inputComment.parent_author;
        authorLink.textContent = inputComment.parent_author;
    }
    authorSpan.appendChild(authorLink);
    parentDiv.appendChild(postTitle);
    parentDiv.appendChild(authorSpan);
    return parentDiv;
}

function makeCommentVotes() {
    const midCol = document.createElement('div');
    midCol.classList.add('midcol');
    const upArrow = document.createElement('img');
    upArrow.dataset.arrow = 'up';
    upArrow.src = BASE_URL + '/assets/arrowup.png';
    const downArrow = document.createElement('img');
    downArrow.src = BASE_URL + '/assets/arrowdown.png';
    downArrow.dataset.arrow = 'down';
    for (let arrow of [upArrow, downArrow]) {
        arrow.classList.add('arrow');
        midCol.appendChild(arrow);
        if (isLogged)
             arrow.addEventListener('click', vote);
    }
    return midCol;
}

function makeCommentContent(inputComment) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('usertext');
    const userText = document.createElement('p');
    userText.textContent = inputComment.content;
    textDiv.appendChild(userText);
    return textDiv;
}

function hideComment(event) {
    let button = event.currentTarget;
    button.textContent = (button.textContent === '[-]') ? '[+]' : '[-]';
    let curComm = getParent(event, 3);
    curComm.classList.toggle('collapsed');
    for (let elem of ['.usertext', '.buttons'])
        curComm.querySelector(elem).classList.toggle('hidden');
    let childDiv = curComm.querySelector('.child');
    if (childDiv)
        childDiv.classList.toggle('hidden');
    if (curComm.querySelector('em')) {
        curComm.querySelector('em').classList.toggle('hidden');
        let childCount = curComm.querySelectorAll('.comment').length;
        if (childCount === 0)
            curComm.querySelector('em').textContent = '';
        else if (childCount === 1)
            curComm.querySelector('em').textContent = '(1 child)';
        else
            curComm.querySelector('em').textContent = '(' + childCount + ' children)';
    }
}

function makePostHiddenDiv() {
    const hiddenDiv = document.createElement('div');
    hiddenDiv.classList.add('hide-text');
    hiddenDiv.classList.add('hidden');
    hiddenDiv.textContent = 'You have hidden this post. '
    const showButton = document.createElement('a');
    showButton.textContent = 'Show again';
    hiddenDiv.appendChild(showButton);
    return hiddenDiv;
}

function makePostVotes(upvotes, downvotes) {
    const votesDiv = document.createElement('div');
    votesDiv.classList.add('votes');
    const upArrow = document.createElement('img');
    upArrow.dataset.arrow = 'up';
    upArrow.src = BASE_URL + '/assets/arrowup.png';
    const downArrow = document.createElement('img');
    downArrow.src = BASE_URL + '/assets/arrowdown.png';
    downArrow.dataset.arrow = 'down';
    for (let arrow of [upArrow, downArrow]) {
        arrow.classList.add('arrow');
        if (isLogged)
            arrow.addEventListener('click', vote);
    }
    const scoreDiv = document.createElement('div');
    scoreDiv.classList.add('score');
    scoreDiv.dataset.vote = 'none';
    scoreDiv.textContent = upvotes - downvotes;
    for (child of [upArrow, scoreDiv, downArrow])
        votesDiv.appendChild(child);
    return votesDiv;
}

function makePostButtons(title, inputPost) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');
    const commentsButton = document.createElement('a');
    commentsButton.textContent = inputPost.comment_count + ' comments';
    commentsButton.href = title.href;
    const shareParent = document.createElement('span');
    const shareButton = document.createElement('a');
    shareButton.classList.add('share');
    shareButton.textContent = 'share';
    shareButton.addEventListener('click', sharePost);
    shareParent.appendChild(shareButton);
    const saveButton = document.createElement('a');
    saveButton.textContent = 'save';
    saveButton.dataset.func = 'save';
    if (isLogged)
        saveButton.addEventListener('click', save);
    else saveButton.href = BASE_URL + '/login?required=save';
    const hideButton = document.createElement('a');
    hideButton.classList.add('hide');
    hideButton.textContent = 'hide';
    hideButton.addEventListener('click', hidePost);
    for (button of [commentsButton, shareParent, saveButton, hideButton])
        buttonsDiv.appendChild(button);
    if (isLogged && (inputPost.author === document.querySelector('#current-user').textContent ||
        (document.querySelector('header span') &&
            document.querySelector('header span').textContent === document.querySelector('#current-user').textContent))) {
        const deleteButton = document.createElement('a');
        deleteButton.textContent = 'delete';
        deleteButton.addEventListener('click', deleteModal);
        buttonsDiv.appendChild(deleteButton);
    }
    return buttonsDiv;
}

function save(event) {
    let action = (event.currentTarget.textContent === 'save')
        ? 'add' : 'remove';
    const currEntry = getParent(event, 3);
    if (currEntry.querySelector('.tagline img') === null) {
        let savedIcon = document.createElement('img');
        savedIcon.src = BASE_URL + '/assets/saved.png';
        currEntry.querySelector('.tagline').appendChild(savedIcon);
    } else currEntry.querySelector('.tagline img').remove();
    let entryType = (currEntry.querySelector('.score')) ? 'post' : 'comment';
    fetch(BASE_URL + '/save/' + entryType + '/' + currEntry.dataset.id + '/' + action).then(onSaveResponse);
    event.currentTarget.textContent = (action === 'add') ? 'unsave' : 'save';
}

function modalClose() {
    document.querySelector('#modal').remove();
    document.body.classList.remove('no-scroll');
}

function deleteModal(event) {
    const modalParent = document.createElement('section');
    modalParent.id = 'modal';

    const modalDiv = modalParent.appendChild(document.createElement('div'));
    const modalHeader = modalDiv.appendChild(document.createElement('h1'));
    let currEntry = getParent(event, 3);
    let entryType = (currEntry.querySelector('.score')) ? 'post' : 'comment';
    modalHeader.textContent = 'Are you sure you want to delete this ' + entryType + '?';
    modalDiv.appendChild(document.createElement('p')).textContent = (entryType === 'post')
        ? currEntry.querySelector('.title').textContent
        : "\"" + currEntry.querySelector('.usertext').textContent + "\"";
    modalParent.dataset.id = currEntry.dataset.id;
    modalParent.dataset.type = entryType;
    const yesButton = modalDiv.appendChild(document.createElement('a'));
    yesButton.textContent = 'Yes';
    yesButton.addEventListener('click', modalClose);
    const noButton = modalDiv.appendChild(document.createElement('a'));
    noButton.textContent = 'No';
    noButton.addEventListener('click', modalClose);

    document.body.classList.add('no-scroll');
    document.body.appendChild(modalParent);
}