const currPost = document.querySelector('article');
const postId = currPost.dataset.id;

if (isLogged) {
    for (let arrow of currPost.querySelectorAll('.arrow'))
        arrow.addEventListener('click', vote);
    document.querySelector('article [data-func=\'save\']').addEventListener('click', save);
} else
    document.querySelector('article [data-func=\'save\']').href = BASE_URL + '/login?required=save';
currPost.querySelector('.share').addEventListener('click', sharePost);
if (hasValue(START_VOTE)) {
    loadVote(currPost, START_VOTE);
}
let postDeleteButton = document.querySelector('article [data-func=\'delete\']');
if (postDeleteButton)
    postDeleteButton.addEventListener('click', deleteModal);

function hideChildren(event) {
    const curComm = getParent(event, 3);
    const button = event.currentTarget;
    curComm.querySelector('.child').classList.toggle('hidden');
    if (button.textContent === 'hide child comments')
        button.textContent = 'show child comments';
    else button.textContent = 'hide child comments';
}

function showComment(inputComment) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.dataset.id = inputComment.id;

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
    if (inputComment.author === 'x')
        authorElem.textContent = '[deleted]';
    else {
        authorElem.href = BASE_URL + '/profile/' + inputComment.author;
        authorElem.textContent = inputComment.author;
    }
    let postAuthor;
    if (inputComment.author === document.querySelector('article .author').textContent) {
        postAuthor = document.createElement('span');
        postAuthor.textContent = 'OP';
        postAuthor.classList.add('op');
    }
    const pointsElem = document.createElement('span');
    let score = (hasValue(inputComment.upvotes) && hasValue(inputComment.downvotes))
        ? inputComment.upvotes - inputComment.downvotes :   '0';
    pointsElem.textContent = score + ' points';
    pointsElem.classList.add('points-tag');
    const dateElem = document.createElement('span');
    dateElem.textContent = inputComment.comment_date;
    dateElem.classList.add('date-tag');
    const childCount = document.createElement('em');
    childCount.classList.add('hidden');
    let tagArr = (postAuthor)
        ? [expandButton, authorElem, postAuthor, pointsElem, dateElem, childCount]
        : [expandButton, authorElem, pointsElem, dateElem, childCount];
    for (let tag of tagArr)
        tagline.appendChild(tag);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');
    const permalink = document.createElement('a');
    permalink.textContent = 'permalink';
    const saveButton = document.createElement('a');
    saveButton.textContent = 'save';
    const replySpan = document.createElement('span');
    const replyButton = document.createElement('a');
    replySpan.appendChild(replyButton);
    replyButton.classList.add('reply');
    replyButton.textContent = 'reply';
    for (let button of [permalink, saveButton, replySpan])
        buttonsDiv.appendChild(button);
    if (isLogged) {
        saveButton.addEventListener('click', save);
        if (inputComment.author === document.querySelector('#current-user').textContent) {
            authorElem.dataset.highlight = 'you';
            const deleteButton = document.createElement('a');
            deleteButton.dataset.func = 'delete';
            deleteButton.textContent = 'delete';
            buttonsDiv.appendChild(deleteButton);
            deleteButton.addEventListener('click', deleteModal);
        }
    } else saveButton.href = BASE_URL + '/login?required=save';

    for (let elem of [tagline, makeCommentContent(inputComment), buttonsDiv])
        entry.appendChild(elem);

    const parent = document.querySelector(".comment[data-id=\"" + inputComment.parent + "\"]");
    if (parent) {
        if (!parent.querySelector('.child')) {
            let childDiv = document.createElement('div');
            let childButton = document.createElement('a');
            childButton.textContent = 'hide child comments';
            parent.querySelector('.buttons').appendChild(childButton);
            childButton.addEventListener('click', hideChildren);
            childDiv.classList.add('child');
            parent.querySelector('.entry').appendChild(childDiv);
        }
        parent.querySelector('.child').appendChild(commentDiv);
    } else document.querySelector('.comment-area').appendChild(commentDiv);

    expandButton.addEventListener('click', hideComment);
    replyButton.addEventListener('click', reply);
    let userVote = inputComment.vote;
    if (isLogged && hasValue(userVote))
        loadVote(commentDiv, userVote);
    if (hasValue(inputComment.comment_saved)) {
        saveButton.textContent = 'unsave';
        let savedIcon = document.createElement('img');
        savedIcon.src = BASE_URL + '/assets/saved.png';
        tagline.appendChild(savedIcon);
    }
}

function sendComment(event) {
    event.preventDefault();
    if (event.currentTarget.content.value.length < 1000 && event.currentTarget.content.value.length > 1) {
        const form_data = {method: 'post', body: new FormData(event.currentTarget)};
        fetch(BASE_URL + '/reply', form_data).then(onResponse).then(showComment);
        if (event.currentTarget === document.querySelector('.main-comment-maker form'))
            event.currentTarget.content.value = '';
        else event.currentTarget.parentNode.remove();
    }
}

function hideOtherBoxes(event) {
    for (box of document.querySelectorAll('.comment-maker'))
        if (box.parentNode.querySelector('.reply') !== event.currentTarget)
            box.classList.add('hidden');
}

function replyToggle(event) {
    hideOtherBoxes(event);
    let replyDiv = event.currentTarget.parentNode.querySelector('.comment-maker');
    if (replyDiv)
        replyDiv.classList.toggle('hidden');
}

function reply(event) {
    if (isLogged) {
        hideOtherBoxes(event);
        const curComm = getParent(event, 4);

        const replyDiv = document.createElement('div');
        event.currentTarget.parentNode.appendChild(replyDiv);
        replyDiv.classList.add('comment-maker');
        const commentForm = replyDiv.appendChild(document.createElement('form'));
        commentForm.method = 'post';
        
        const editor = commentForm.appendChild(document.createElement('textarea'));
        editor.name = 'content';
        editor.placeholder = 'What are your thoughts?';

        const parentVal = commentForm.appendChild(document.createElement('input'));
        parentVal.type = 'hidden';
        parentVal.name = 'parent';
        parentVal.value = curComm.dataset.id;

        const postVal = commentForm.appendChild(document.createElement('input'));
        postVal.type = 'hidden';
        postVal.name = 'relpost';
        postVal.value = postId;

        const csrfInput = commentForm.appendChild(document.createElement('input'));
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = giveToken();

        const replyBottomDiv = commentForm.appendChild(document.createElement('div'));
        const save = replyBottomDiv.appendChild(document.createElement('button'));
        save.type = 'submit';
        save.textContent = 'save';

        const counterElem = replyBottomDiv.appendChild(document.createElement('span'));
        counterElem.dataset.val = '0';
        counterElem.textContent = '0/1000';
        editor.addEventListener('input', lenCheck);
        event.currentTarget.removeEventListener('click', reply);
        event.currentTarget.addEventListener('click', replyToggle);
        commentForm.addEventListener('submit', sendComment);
    } else event.currentTarget.href = BASE_URL + '/login?required=reply';
}

function onJson(json) {
    for (let comment of document.querySelectorAll('.comment'))
        comment.remove();
    document.querySelector('.comment-title').textContent = (json.length > 0)
        ? json.length + ' comments' : 'no comments (yet)';
    for (let comment of json)
        showComment(comment);
}

fetch(BASE_URL + '/post/' + postId + '/comments').then(onResponse).then(onJson);

function sortComments(event) {
    let option = event.currentTarget.textContent;
    document.querySelector('.dropdown span').textContent = option;
    fetch(BASE_URL + '/post/' + postId + '/comments/' + option).then(onResponse).then(onJson);
}

function refreshComments() {
    const currSort = document.querySelector('.dropdown span').textContent;
    fetch(BASE_URL + '/post/' + postId + '/comments/' + currSort).then(onResponse).then(onJson);
}

document.querySelector('.dropdown').addEventListener('click', sortMenu);
for (let choice of document.querySelectorAll('.drop-choices a'))
    choice.addEventListener('click', sortComments);

if (isLogged) {
    document.querySelector('.main-comment-maker textarea').addEventListener('input', lenCheck);
    document.querySelector('.main-comment-maker form').addEventListener('submit', sendComment);
}