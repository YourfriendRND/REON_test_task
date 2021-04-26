import { ERROR_MESSAGE_TIME } from './contants.js';
import { contentArea } from './posts.js';

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

export  { showDownloadError }