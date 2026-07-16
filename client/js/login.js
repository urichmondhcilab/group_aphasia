let loginBtn = document.getElementById("login");
let userNameInput = document.getElementById("username");
let slpOption = document.getElementById("slp");
let participantOption = document.getElementById("participant");
let username = userNameInput.value;
let titleObj = document.getElementById("title");
let refreshObj = document.getElementById("refresh");
let nextBtn = document.getElementById("debug_next");

let meeting_channel = null;

// initializing the publish and subscribe keys for PubNub
let init_pubnub = {};
init_pubnub.publishKey = init_values.publishKey;
init_pubnub.subscribeKey = init_values.subscribeKey;
init_pubnub.uuid = "temp_user_name";

// creating a PubNub object
const pubnub = new PubNub(init_pubnub);
const default_channel = "default_channel";

// event listeners
loginBtn.addEventListener('click', login);
window.addEventListener('load', retrieveUsername);
userNameInput.addEventListener('input', saveUserName);
slpOption.addEventListener('change', changeButtonText);
refreshObj.addEventListener('click', reloadPage);
nextBtn.addEventListener('click', next);


// subscribe to the default channel
pubnub.subscribe({ // Subscribe to wait for messages
    channels: [default_channel],
    withPresence: true
});

pubnub.addListener({
    status: (s) => {console.log('Status', s.category)},
    message: (m) => {
        console.log(m.message.text);
        console.log(m.publisher);  
        
        // check message type
        if (m.message.type === "id"){
            // update the session name
            let currentMessage = m.message.text;
            let messageLength = currentMessage.length;
            let cleanMessage = currentMessage.substring(0, messageLength - 2).replaceAll('_', '/');
            titleObj.textContent = "Join Session: " + cleanMessage;
            updateChannel(currentMessage);
        }
    }
});

/**
 * Update the meeting channel name when the channel is retrieved from facilitator
 * @param {Sting} channel is the channel to join
 */
function updateChannel(channel){
    meeting_channel = channel;
}

/**
 * Go to message.html if participant else ...
 * update the value of username
 * @param {Object} e is the event object created when the login is clicked
 */
function login(e){
    let username = userNameInput.value;
    console.log(username);
    if (participantOption.checked && meeting_channel != null){
        window.location.href = `message.html?user=${encodeURIComponent(username)}&channel=${encodeURIComponent(meeting_channel)}`;
        
    }else if(slpOption.checked){
        window.location.href = `facilitator.html?user=${encodeURIComponent(username)}`;
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

/**
 * Save the username in the local storage
 * @param {EventObject} e 
 */
function saveUserName(e){
    localStorage.setItem("savedUserName", e.target.value);
}

/**
 * Change the text on the button based on 
 * @param {EventObject} e 
 */
function changeButtonText(e){
    // come back
}

/**
 * reload the page
 */
function reloadPage(e){
    window.location.reload();
}


function next(){
    window.location.href = 'message.html';
}