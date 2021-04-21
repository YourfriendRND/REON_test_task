import { getData } from './api.js';
import { showPostOnPage, showDownloadError } from "./posts.js";

const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
getData(SERVER_URL, showPostOnPage, showDownloadError)

