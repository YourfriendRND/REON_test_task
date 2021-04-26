import { getData } from './api.js';
import { COMMENTS_URL, POSTS_URL, PAGINATION_DECREMENT, PAGINATION_INCREMENT, QUANTITY_OF_COMMENTS } from './contants.js';
import { showDownloadError } from './util.js';

const postTemplate = document.querySelector('#post-template').content.querySelector('.post');
const contentArea = document.querySelector('.posts-area');
const searchField = document.querySelector('.search-form__data-field');
const paginationNext = document.querySelector('.pagination__button-next');
const paginationBack = document.querySelector('.pagination__button-back');
let postQuantity = 10;
let counter = 0;

const commentBlock = document.querySelector('.comments');
const commentTemplate = document.querySelector('#comment-template').content.querySelector('.comment');
const backCommentButton = commentBlock.querySelector('.comments__back');

const printComments = (array) => {
    const commentFragment = document.createDocumentFragment();
    for (let i = 0; i < QUANTITY_OF_COMMENTS; i++) {
        const similarComment = commentTemplate.cloneNode(true);
        similarComment.querySelector('.comment__title').textContent = array[i].name;
        similarComment.querySelector('.comment__author-contacts--email').textContent = array[i].email;
        similarComment.querySelector('.comment__author-content').textContent = array[i].body;
        commentFragment.appendChild(similarComment);
    }
    commentBlock.querySelector('.comments__content').appendChild(commentFragment);
}

const createLinkToComments = (array) => {
    const postsInfoLink = document.querySelectorAll('.post__headline--info-link');
    for (let i = 0; i < postsInfoLink.length; i++) {
        postsInfoLink[i].addEventListener('click', (evt) => {
            evt.preventDefault();
            const post = postsInfoLink[i].parentElement.parentElement.cloneNode(true);
            contentArea.innerHTML = "";
            contentArea.appendChild(post);
            paginationNext.classList.add('visually-hidden');
            paginationBack.classList.add('visually-hidden');
            post.querySelector('.post-content__like-button').remove();
            post.querySelector('.post-content__delete-button').remove();
            printComments(array)
            if (document.querySelector('.comments__headline').classList.contains('visually-hidden') && document.querySelector('.comments__back').classList.contains('visually-hidden')) {
                document.querySelector('.comments__headline').classList.remove('visually-hidden');
                document.querySelector('.comments__back').classList.remove('visually-hidden');          
            }
        })
    }
}

const showComments = (array) => {
    const downloadComments = (arrayComments) => {
        createLinkToComments(arrayComments)
        backCommentButton.addEventListener('click', () => {
            contentArea.innerHTML = "";
            paginationNext.classList.remove('visually-hidden');
            paginationBack.classList.remove('visually-hidden');
            counter = counter - PAGINATION_INCREMENT;
            createPost(array, contentArea)
            commentBlock.querySelector('.comments__content').innerHTML = "";
            document.querySelector('.comments__headline').classList.add('visually-hidden');
            document.querySelector('.comments__back').classList.add('visually-hidden')
            createLinkToComments(arrayComments)
        })
    }
    getData(COMMENTS_URL, downloadComments, showDownloadError);
}


const prepareContent = (array, contentBlock) => {
    const postFragment = document.createDocumentFragment();
    if (counter === 0) {
        for (counter; counter < postQuantity; counter++) {
            const similarPost = postTemplate.cloneNode(true);
            similarPost.querySelector('.post__headline--info-link').textContent = array[counter].title;
            similarPost.querySelector('.post__text').textContent = array[counter].body;
            similarPost.querySelector('.post__user-id').innerHTML = array[counter].userId;
            similarPost.querySelector('.post__number').innerHTML = array[counter].id;
            postFragment.appendChild(similarPost)
        }
    }
    else {
        for (counter; counter < postQuantity; counter++) {
            const similarPost = postTemplate.cloneNode(true);
            if (!array[counter]) {
                if (counter % 10 !== 0) {
                    counter = counter - (counter % 10);
                }
                break
            }
            similarPost.querySelector('.post__headline--info-link').textContent = array[counter].title;
            similarPost.querySelector('.post__text').textContent = array[counter].body;
            similarPost.querySelector('.post__user-id').innerHTML = array[counter].userId;
            similarPost.querySelector('.post__number').innerHTML = array[counter].id;
            postFragment.appendChild(similarPost)
            paginationBack.disabled = false;
        }
    }
    contentBlock.appendChild(postFragment)        
}

const createPost = (array, contentBlock) => {
    prepareContent(array, contentBlock);
    const deleateButtons = document.querySelectorAll('.post-content__delete-button');
    for (let i = 0; i < deleateButtons.length; i++) {
        deleateButtons[i].addEventListener('click', () => {
            deleateButtons[i].parentNode.parentNode.removeChild(deleateButtons[i].parentNode);
        }) 
    }
}

const changePostNext = (array, contentBlock) => {
    contentBlock.innerHTML = "";
    postQuantity = (postQuantity < array.length) ? postQuantity + PAGINATION_INCREMENT : postQuantity;
    if (postQuantity === array.length || postQuantity > array.length) {
        paginationNext.disabled = true;
    }
    showComments(array)
}

const buttonDisabled = (array) => {
    if (postQuantity <= array.length || counter === PAGINATION_INCREMENT) {
        paginationBack.disabled = true;
        paginationNext.disabled = false;
    }
}

const changePostBack = (array, contentBlock) => {
    contentBlock.innerHTML = "";
    postQuantity = postQuantity - PAGINATION_INCREMENT;
    showComments(array)
    if (searchField.value.length && array.length < PAGINATION_DECREMENT) {
        counter = counter - PAGINATION_INCREMENT;
    }
    else if (searchField.value.length && array.length > PAGINATION_DECREMENT) {
        counter = counter - PAGINATION_DECREMENT;
    }
    else {
        counter = counter - PAGINATION_DECREMENT;
    }
    buttonDisabled(array)
}

const showPostOnPage = (array) => {
    let searchArray = [];
    createPost(array, contentArea)
    showComments(array)
    paginationNext.addEventListener('click', () => {
        if (searchField.value.length === 0) {
            changePostNext(array, contentArea)
            createPost(array, contentArea)
        }
        else {
            changePostNext(searchArray, contentArea)
            createPost(searchArray, contentArea)   
        }
    })

    paginationBack.addEventListener('click', () => {
        if (searchField.value.length === 0) {
            changePostBack(array, contentArea)
            createPost(array, contentArea)
        }
        else {
            changePostBack(searchArray, contentArea)
            createPost(searchArray, contentArea)
        }
    })

    searchField.addEventListener('input', () => {
       searchArray = []
       if (searchField.value.length > 0) {
           counter = 0;
           postQuantity = 10;
            for (let i = 0; i < array.length; i++) {
                if (array[i].body.indexOf(searchField.value) >= 1 || array[i].title.indexOf(searchField.value) >= 1) {
                    searchArray.push(array[i]);
                }
            }
            contentArea.innerHTML = "";
            createPost(searchArray, contentArea)
       }
       else {
           counter = 0;
           postQuantity = 10;
           contentArea.innerHTML = "";
           createPost(array, contentArea)
       }
    })
}

getData(POSTS_URL, showPostOnPage, showDownloadError);

export { contentArea, searchField }