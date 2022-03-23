import jwtDecode from 'jwt-decode';

export const fetchPost = (url, body = {}, headers = {}) => (
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(body),
    })
)

export const cloneAsObject = (obj) => {
    if (obj === null || !(obj instanceof Object)) {
        return obj;
    }
    var temp = (obj instanceof Array) ? [] : {};
    // ReSharper disable once MissingHasOwnPropertyInForeach
    for (var key in obj) {
        temp[key] = cloneAsObject(obj[key]);
    }
    return temp;
}

export const jwtDecode3g = (token) => (token && jwtDecode(token))