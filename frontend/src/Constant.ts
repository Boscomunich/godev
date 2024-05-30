let url = '';
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    url = "http://localhost:3000";
} else {
    url = "https://server.vidaxmine.com";
}

export {url}