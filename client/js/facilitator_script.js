// constants
const newMeeting = document.getElementById("new_meeting");
const meetingInformation = document.getElementById('meeting_information');
// retrieve information from login.js and client.html
const params = new URLSearchParams(window.location.search);
const username = params.get('user'); // get the user parameter.

// variables 
let channelCount = 0;

// event listeners
newMeeting.addEventListener('click', createChannel);

// initializing the publish and subscribe keys for PubNub
let init_values = {
  publishKey: "pub-c-931a8a05-bc0b-426f-9d3f-8bee93b34d1f",
  subscribeKey: "sub-c-e5c423cc-279e-4547-9d1c-321fa2bfd68d",
  uuid: username,
};

// creating a PubNub object
const pubnub = new PubNub(init_values);

// send the channel to participants on the default channel
function broadcastChannel(channelID){
  pubnub.publish({
    channel: "default_channel",
    message: {"text": channelID, "type": "id"},
  },
  function(status, response){
      console.log(status);
      console.log(response);
  });
}

// create a new channel with the date;
function createChannel(e){
    // get current date 
    let now = new Date();
    now = now.toLocaleDateString().replaceAll('/', '_');
    let channelID = now + "_" + channelCount;
    channelCount++;
    console.log("broadcast channel " + channelID);

    // update information on Facilitator mage
    updateMeetingInformation(channelID);
    //braodcast the new channel to participants
    broadcastChannel(channelID);
}

function updateMeetingInformation(channelID){
  meetingInformation.textContent = "New Meeting Created!: " + channelID;
}
