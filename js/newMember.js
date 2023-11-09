document.getElementById("registrationForm").addEventListener("submit", function(event){
    event.preventDefault(); 
    showMessage();
    window.location.href = "index.html";
  });
  
  function showMessage() {
    alert("You have successfully created a new account.");
  }