// initialize pubnub
let init_pubnub = {};
init_pubnub.publishKey = init_values.publishKey;
init_pubnub.subscribeKey = init_values.subscribeKey;
init_pubnub.uuid = "main_computer";

// creating a PubNub object
const pubnub = new PubNub(init_pubnub);

// create a subscription to a single channel
const channel = ['default_channel'];
let meeting_channel = null;


// const subscription1 = channel.subscription({ receivePresenceEvents: true });

let userMessage = document.getElementById('user_message');
let largeMessageContainer = document.getElementById('large_message_container');
let largeMessage = document.getElementById('large_message');
let allParticipantContainer = document.getElementById('all_participants_container');

const mediaQuery = window.matchMedia('(min-width: 781px)');

let menuItemParticipantObj = document.getElementById('menu-item-participant');
let menuItemMessageObj = document.getElementById('menu-item-messages');
let menuItemCurrentMessageObj = document.getElementById('menu-item-current-message');
// keep a set of usernames
let user = new Set();
const colors = ['red', 'purple', 'blue', 'green', 'orange'];
let color_count = 0;

// received message audio
const receivedMessageSound = new Audio('./audio/received_message.mp3');

pubnub.subscribe({ // Subscribe to wait for messages
    channels: channel,
    withPresence: true
});


// when page is reloaded clear user variable
window.addEventListener('DOMContentLoaded', () => {
  const [navigation] = performance.getEntriesByType('navigation');
  
  if (navigation && navigation.type === 'reload') {
    console.log('This page was reloaded!');
    // Place your reload-specific logic here
    user.clear();
  }
});

menuItemParticipantObj.addEventListener('click', showParticipantDiv);
menuItemMessageObj.addEventListener('click', showMessageDiv);
menuItemCurrentMessageObj.addEventListener('click', showCurrentMessageDiv);

mediaQuery.addEventListener('change', returnLargeScreenStyles);

// add a subscription connection status listener
pubnub.addListener({
    status: (s) => {console.log('Status', s.category) },
    message: (m) => {
        console.log(m)
        console.log(m.message.text);
        console.log(m.publisher);

        // update meeting channel;
        console.log( "message id: " + m.message.type );
        console.log("channel name: " + m.channel);

        let username = m.publisher;
        let status = m.message.status;


        console.log("status:", status);        

        if (m.channel == "default_channel"){
            // update meeting_channel name;
            let meetingChannel = "channel" + m.message.text;

            // add meeting channel to the channel array
            channel.push(meetingChannel);
            console.log(channel);            
            pubnub.subscribe({
                channels: channel,
                withPresence: true 
            });            
        }else{
            // upload message to broadcast screen

            let messageText = document.createTextNode(m.message.text);
            let largeMessageText = document.createTextNode(m.message.text);
            let userText = document.createTextNode(m.publisher);

            let messageDiv = document.createElement('div');
            let userDivImgContainer = document.createElement('div');
            let userDiv = document.createElement('div');
            let userImage = document.createElement('img');

            let messages = document.querySelectorAll('.user_div_img_container');

            // 
            messages.forEach(message => {
                message.style.backgroundColor = 'white';
                message.style.color = 'black';            
            });        

            messageDiv.appendChild(messageText);
            userDiv.appendChild(userText);
            userDivImgContainer.appendChild(userImage);
            userDivImgContainer.appendChild(userDiv);
            userDivImgContainer.appendChild(messageDiv);    
            
            messageDiv.className = 'message';
            userDiv.className = 'user';
            userImage.className = 'user_img icon';
            userDivImgContainer.className = 'user_div_img_container';  
            // userDivImgContainer.style.backgroundColor = '#731C13';  
            userDivImgContainer.style.backgroundColor = '#EBF3F8';  
            userDivImgContainer.style.color = 'black'; 


            // loading participant column
            if(!user.has(username)){
                // create entry for participant column
                let imageUrl = "../client/images/" + status + ".png";
                console.log(imageUrl);

                if (status == undefined){
                    status = "";
                }

                let statusText = document.createTextNode(status);

                let participantContainer = document.createElement('div');
                // let participantNameStatusContainer = docu
                let statusDiv = document.createElement('div');
                let statusCircle = document.createElement('div');
                let statusIcon = document.createElement('div');

                let participantUserName = userDiv.cloneNode(true);

                statusCircle.style.backgroundColor = colors[(color_count++) % colors.length];
                statusCircle.className = 'status_circle';
                statusIcon.className = 'icon';
                statusDiv.className = 'status_text'; // for identification in subsequent calls
                statusIcon.style.backgroundImage = `url('${imageUrl}')`;

                statusDiv.appendChild(statusText);
                participantContainer.appendChild(statusCircle);

                participantContainer.appendChild(participantUserName);
                participantContainer.appendChild(statusIcon);
                participantContainer.appendChild(statusDiv);

                participantContainer.className = 'participant';
                participantContainer.id = username;
                allParticipantContainer.appendChild(participantContainer);  
                user.add(username);
            }else{
                console.log("has username");

                if(status != undefined)
                    updateStatus(username, status);
                
            }


            // loading message column
            // check if text message only
            if(status === undefined || status == ""){
                // load text message
                largeMessage.textContent = m.message.text;
                userMessage.prepend(userDivImgContainer); 

            }else{
                console.log("whats happening");
                updateStatus(username, status);
            }    
            
            receivedMessageSound.play();            
        }
    },
    file: async (fileEvent) => {
            // fileEvent contains file ID, filename, publisher, and caption
            console.log('File received:', fileEvent);

            // Generate a temporary, securely signed URL to display the image
            const fileUrl = await pubnub.getFileUrl({
                channel: fileEvent.channel,
                id: fileEvent.file.id,
                name: fileEvent.file.name

            });

            let message = fileEvent.message;
            let publisher = fileEvent.publisher;
            console.log("message with the image: " + message);


            // attachImageToThread(fileUrl);

            // create text nodes
            const messageText = document.createTextNode(message.text);
            const largeMessageText = document.createTextNode(message.text);
            const userText = document.createTextNode(publisher);

            // create divs for text nodes and some image objects 
            const imgElement = document.createElement('img');
            const userDivImgContainer = document.createElement('div');            
            const messageDiv = document.createElement('div');
            const userDiv = document.createElement('div');
            const userImage = document.createElement('img');
            const container = document.createElement('div');

            let messages = document.querySelectorAll('.user_div_img_container');

            // get all previous messages and remove any highlights on them
            messages.forEach(message => {
                message.style.backgroundColor = 'white';
                message.style.color = 'black';            
            });

            // attach text to divs and children to parents 
            messageDiv.appendChild(messageText);
            userDiv.appendChild(userText);
            userDivImgContainer.appendChild(userImage);
            userDivImgContainer.appendChild(userDiv);
            userDivImgContainer.appendChild(messageDiv); 
        
            // style divs 
            messageDiv.className = 'message';
            userDiv.className = 'user';
            userImage.className = 'user_img icon';        
            userDivImgContainer.className = 'user_div_img_container'; 
            container.className = 'message_with_image';
            
            userDivImgContainer.style.backgroundColor = '#EBF3F8';    

            imgElement.src = fileUrl;
            imgElement.className = 'image_messages';

            container.appendChild(imgElement);
            container.appendChild(userDivImgContainer);

            userMessage.prepend(container);   

            largeMessage.textContent = "";
            let imageClone = imgElement.cloneNode();
            imageClone.className = 'large_image_with_message';
            largeMessage.appendChild(largeMessageText);
            largeMessage.appendChild(imageClone);

            userMessage.prepend(container);             
            receivedMessageSound.play();   
        }    
});


function updateStatus(username, status){
            let currentParticipantObject = document.getElementById(username);
            let statusIcon = currentParticipantObject.querySelector('.icon');
            let statusDiv = currentParticipantObject.querySelector('.status_text');

            let imageUrl = "../client/images/" + status + ".png";
            statusIcon.style.backgroundImage = `url('${imageUrl}')`;
            statusDiv.textContent = status;    
}

let participantObj = document.querySelector('.participants');
let containerObj = document.querySelector('.container');
let userMessageContainer = document.querySelector('.user_message_container');

function showParticipantDiv(e){
    console.log("showing all participant div");
    participantObj.style.display = "block";
    containerObj.style.display = "none";
    userMessageContainer.style.display = "none";  
    largeMessageContainer.style.display = "none";
    
    participantObj.style.width = "100%";
}

function showMessageDiv(e){
    console.log("showing message div");
    participantObj.style.display = "none";  
    containerObj.style.display = "flex";
    userMessageContainer.style.display = "block";
    largeMessageContainer.style.display = "none"  

    containerObj.style.width = "100%"    
    userMessageContainer.style.width = "100%";
}

function showCurrentMessageDiv(e){
    console.log("showing large message div");
    
    participantObj.style.display = "none";
    containerObj.style.display = "flex";    
    userMessageContainer.style.display = "none";
    largeMessageContainer.style.display = "flex";

    containerObj.style.width = "100%"
    largeMessageContainer.style.width = "100%";    
}

function returnLargeScreenStyles(e){
    if (event.matches){
        console.log("in here");

        participantObj.style.cssText = "";
        userMessageContainer.style.cssText = "";
        largeMessageContainer.style.cssText = "";        

        participantObj.style.display = "block";  
        containerObj.style.display = "flex";
        userMessageContainer.style.display = "block";
        largeMessageContainer.style.display = "flex" ;

        participantObj.className = "participants";
        containerObj.className = "container";
        userMessageContainer.className = "user_message_container";
        largeMessageContainer.className = "large_message_container";
    }else{
        participantObj.style.display = "block";
        containerObj.style.display = "none";
        userMessageContainer.style.display = "none";  
        largeMessageContainer.style.display = "none";
        
        participantObj.style.width = "100%";        
    }
}
