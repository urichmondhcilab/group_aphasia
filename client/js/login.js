let loginBtn = document.getElementById("login");
let userNameInput = document.getElementById("username");
let slpOption = document.getElementById("slp");
let participantOption = document.getElementById("participant");

loginBtn.addEventListener('click', login);

window.addEventListener('load', retrieveUsername);

userNameInput.addEventListener('input', saveUserName);

/**
 * Go to message.html if participant else ...
 * update the value of username
 * @param {Object} e is the event object created when the login is clicked
 */
function login(e){
    let username = userNameInput.value;
    console.log(username);
    if (participantOption.checked){
        window.location.href = `message.html?user=${encodeURIComponent(username)}`;
        // `page2.html?user=${encodeURIComponent(username)}`
        
    }

}

/**
 * saves or retrieves the username in local storage 
 * @param {EventObject} e 
 */
function retrieveUsername(e){
    const userName = localStorage.getItem("savedUserName");

    if (userName){
        userNameInput.value = userName;
    }
}

function saveUserName(e){
    localStorage.setItem("savedUserName", e.target.value);
}
