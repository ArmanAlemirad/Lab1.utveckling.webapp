function redirect() {
    localStorage.removeItem("username");
    window.location.href = "index.html";
}
setTimeout(redirect, 2500);