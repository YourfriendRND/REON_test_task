const getData = (url, onSuccess, onError) => {
    fetch(url)
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
    })
    .then((json) => {
        onSuccess(json)
    })
    .catch(() => {
        onError()
    })
}

export {getData}
