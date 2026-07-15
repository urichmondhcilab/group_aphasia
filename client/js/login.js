let loginBtn = document.getElementById("login");
let userNameInput = document.getElementById("username");
let slpOption = document.getElementById("slp");
let participantOption = document.getElementById("participant");
let username = userNameInput.value;
let titleObj = document.getElementById("title");

let meeting_channel = null;


// initializing the publish and subscribe keys for PubNub
let init_values = {
  publishKey: "pub-c-931a8a05-bc0b-426f-9d3f-8bee93b34d1f",
  subscribeKey: "sub-c-e5c423cc-279e-4547-9d1c-321fa2bfd68d",
  uuid:"temp_user_name",
};

// creating a PubNub object
const pubnub = new PubNub(init_values);

loginBtn.addEventListener('click', login);

window.addEventListener('load', retrieveUsername);

userNameInput.addEventListener('input', saveUserName);

const default_channel = "default_channel";

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
