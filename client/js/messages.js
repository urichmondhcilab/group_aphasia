// retrieve information from login.js and client.html
const params = new URLSearchParams(window.location.search);
const username = params.get('user'); // get the user parameter.
const channel = "channel" + params.get('channel'); // get the channel parameter.

console.log("the channel to join is: " + channel);

const fileInput = document.getElementById('hiddenFileInput');
const uploadButton = document.getElementById('uploadButton');

// menu objects
const textBtn = document.getElementById('text-menu-item');
const quickTextBtn = document.getElementById('quick-text-menu-item');

// interfaces - each menu item triggers a menu interface
const messageInterface = document.getElementById('message_container');
const quickMessagesInterface = document.getElementById('template_message_container');

// the send button and text input objects 
const sendBtn = document.getElementById("send");
const clearBtn = document.getElementById("clear");
const textAreaObj = document.getElementById("textarea");

console.log("the username is: " + username);

// status buttons
const agreeBtn = document.getElementById('agree');
const disagreeBtn = document.getElementById('disagree');
const unsureBtn = document.getElementById('unsure');
const helpBtn = document.getElementById('help');
const waitBtn = document.getElementById('wait');
const repeatBtn = document.getElementById('repeat');
const yesBtn =document.getElementById('yes')
const noBtn = document.getElementById('no');
const questionBtn = document.getElementById('question');
const respondBtn = document.getElementById('respond');
const changeTopicBtn = document.getElementById('change_topic');


// initializing the publish and subscribe keys for PubNub
let init_values = {
  publishKey: "pub-c-931a8a05-bc0b-426f-9d3f-8bee93b34d1f",
  subscribeKey: "sub-c-e5c423cc-279e-4547-9d1c-321fa2bfd68d",
  uuid: username,
};

// creating a PubNub object
const pubnub = new PubNub(init_values);


// event listeners for objects 
textBtn.addEventListener('click', switchInterface);
quickTextBtn.addEventListener('click', switchInterface);

sendBtn.addEventListener('click', sendMessage);
clearBtn.addEventListener('click', clearMessage);
// fileInput.addEventListener('click', testUpload);
fileInput.addEventListener('change', uploadImage); // change detects when the chosen file changes
uploadButton.addEventListener('click', ()=>{fileInput.click();}) // custom file button activates custom hidden file object

// eventListeners for status buttons
agreeBtn.addEventListener('click', function(e){ 
    console.log("clicking a status button");
    sendMessage(e, 'agree')});
disagreeBtn.addEventListener('click', (e)=>{sendMessage(e, 'disagree')});
unsureBtn.addEventListener('click', (e)=>{sendMessage(e, 'unsure')});
helpBtn.addEventListener('click', (e)=>{sendMessage(e, 'help')});
waitBtn.addEventListener('click', (e)=>{sendMessage(e, 'wait')});
repeatBtn.addEventListener('click', (e)=>{sendMessage(e, 'repeat')});
yesBtn.addEventListener('click', (e)=>{sendMessage(e, 'yes')});
noBtn.addEventListener('click', (e)=>{sendMessage(e, 'no')});
questionBtn.addEventListener('click', (e)=>{sendMessage(e, 'question')});
respondBtn.addEventListener('click', (e)=>{sendMessage(e, 'respond')});
changeTopicBtn.addEventListener('click', (e)=>{sendMessage(e, 'change')});


//switch Interface
function switchInterface(e){
    let menuItem = e.target.id;

    switch(menuItem)
    {
        case 'text-menu-item': case 'text_icon': case 'text-text':
            messageInterface.style.display = 'flex';
            quickMessagesInterface.style.display = 'none';
            quickTextBtn.style.backgroundColor = 'white';
            quickTextBtn.style.color = 'black';
            // textBtn.style.backgroundColor = '#0070C2';
            // textBtn.style.backgroundColor = '#5C7E8F';        
            textBtn.style.backgroundColor = '#8b9dc3';                    
            textBtn.style.color = 'white';
            // console.log('in text-menu-item');
            break;
        case 'quick-text-menu-item': case 'quick_text_icon': case 'quick-text-text':
            messageInterface.style.display = 'none';
            quickMessagesInterface.style.display = 'flex';  
            quickTextBtn.style.backgroundColor = '#0070C2';
            // quickTextBtn.style.backgroundColor = '#5C7E8F';
            quickTextBtn.style.backgroundColor = '#8b9dc3';
            
            quickTextBtn.style.color = 'white';
            textBtn.style.backgroundColor = 'white';                      
            textBtn.style.color='black';
            // console.log('in quick-text-menu-item');
            break;
    }
    console.log(e.target);
}

// send a message
function sendMessage(e, status){
    console.log("sending...");
    let message = textAreaObj.value;
    console.log(message);
    pubnub.publish(
    {
        channel: channel,
        message: {"text": message, "status": status},
        customMessageType: "text-message"
    },
    function(status, response) {
        console.log(status);
        console.log(response);
    });    
}

// upload an Image
async function uploadImage() {
    const myFile = fileInput.files[0];
    console.log(myFile.name);
    let message = textAreaObj.value;

    try {
        const result = await pubnub.sendFile({
            channel: "my_channel",
            file: myFile,
            message: {"text": message // Optional caption
            },
            customMessageType: ""
        }, function(status, response)
    {console.log("status: " + status)});
        console.log('Image uploaded successfully!', result);
    } catch (error) {
        console.error('Upload failed:', error);
    }
}

function clearMessage(e){
    textAreaObj.value="";
}




