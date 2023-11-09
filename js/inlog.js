function login(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    localStorage.setItem("username", username);

    window.location.href = "index.html";
  } else {
    alert("Please enter your username and password.");
  }
}
