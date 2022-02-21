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