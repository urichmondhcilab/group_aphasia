// constants
const newMeeting = document.getElementById("new_meeting");

// variables 
let channelCount = 0;

// event listeners
newMeeting.addEventListener('click', createChannel);

// initializing the publish and subscribe keys for PubNub
let init_values = {
  publishKey: "pub-c-931a8a05-bc0b-426f-9d3f-8bee93b34d1f",
  subscribeKey: "sub-c-e5c423cc-279e-4547-9d1c-321fa2bfd68d",
  uuid: "testName",
};

// creating a PubNub object
const pubnub = new PubNub(init_values);


// send the channel to participants on the default channel
function broadcastChannel(){

}


// create a new channel with the date;
function createChannel(e){
    // get current date 
    let now = new Date();
    now = now.toLocaleDateString().replaceAll('/', '_');
    let channelID = now + "_" + channelCount;
    channelCount++;



    console.log("broadcast channel " + channelID);

    //braodcast the new channel to participants
    broadcastChannel(channelID);
}
