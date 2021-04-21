const ERROR_MESSAGE_TIME = 10000;
const postTemplate = document.querySelector('#post-template').content.querySelector('.post');
const contentArea = document.querySelector('.posts-area');
const paginationNext = document.querySelector('.pagination__button-next');
const paginationBack = document.querySelector('.pagination__button-back');
const paginationIncrement = 10;
const paginationDecrement = 20;
let postQuantity = 10;
let counter = 0;

const searchField = document.querySelector('.search-form__data-field');

const createPost = (array, contentBlock) => {
    const postFragment = document.createDocumentFragment();
    if (counter === 0) {
        for (counter; counter < postQuantity; counter++) {
            const similarPost = postTemplate.cloneNode(true);
            similarPost.querySelector('.post__headline').textContent = array[counter].title;
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
                break
            }
            similarPost.querySelector('.post__headline').textContent = array[counter].title;
            similarPost.querySelector('.post__text').textContent = array[counter].body;
            similarPost.querySelector('.post__user-id').innerHTML = array[counter].userId;
            similarPost.querySelector('.post__number').innerHTML = array[counter].id;
            postFragment.appendChild(similarPost)
            paginationBack.disabled = false;
        }
    }
    contentBlock.appendChild(postFragment)
}

const changePostNext = (array, contentBlock) => {
    contentBlock.innerHTML = "";
    postQuantity = (postQuantity <= array.length) ? postQuantity + paginationIncrement : postQuantity;
    if (postQuantity === array.length || postQuantity > array.length) {
        paginationNext.disabled = true;
    }
}

const changePostBack = (array, contentBlock) => {
    contentBlock.innerHTML = "";
    postQuantity = postQuantity - paginationIncrement;
    if (searchField.value.length) {
        counter = counter - paginationIncrement;
    }
    else {
        counter = counter - paginationDecrement;
    }
    if (counter <= paginationIncrement || postQuantity <= array.length) {
        paginationBack.disabled = true;
        paginationNext.disabled = false;
    }
}

const showPostOnPage = (array) => {
    let searchArray = [];
    createPost(array, contentArea)
    paginationNext.addEventListener('click', () => {
        if (!searchField.value.length) {
            changePostNext(array, contentArea)
            createPost(array, contentArea)
        }
        else {
            changePostNext(searchArray, contentArea)
            createPost(searchArray, contentArea)
        }
    })

    paginationBack.addEventListener('click', () => {
        if (!searchField.value.length) {
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
       postQuantity = 10;
       counter = 0;
       for (let i = 0; i < array.length; i++) {
           if (array[i].body.indexOf(searchField.value) >= 1 || array[i].title.indexOf(searchField.value) >= 1) {
               searchArray.push(array[i]);
            }
        }

       if (searchArray.length > 0 ) {
           contentArea.innerHTML = "";
           createPost(searchArray, contentArea)
           postQuantity = postQuantity + paginationIncrement; 
       }
        else {
            contentArea.innerHTML = "";
        }

       if (searchField.value.length === 0) {
           createPost(array, contentArea)
       }
    })
}

const showDownloadError = () => {
    const mistakeBlock = document.createElement('div');
    mistakeBlock.style.width = '100%';
    mistakeBlock.style.height = '100%';
    mistakeBlock.style.padding = '20px 0'
    mistakeBlock.style.margin = '0 0 20px 0'
    mistakeBlock.style.backgroundColor = 'red';
    mistakeBlock.style.textAlign = 'center'
    mistakeBlock.textContent = 'Не удалось загрузить данные с сервера, пожалуйста, попробуйте позже'
    mistakeBlock.style.color = '#ffffff'
    contentArea.appendChild(mistakeBlock)

    setTimeout(() => {
        if (contentArea.contains(mistakeBlock)) {
            mistakeBlock.remove();
        }
    }, ERROR_MESSAGE_TIME)
};

export {showPostOnPage, showDownloadError};