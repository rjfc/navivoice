// Request microphone access
navigator.webkitGetUserMedia({ audio: true },
function (stream) {
    mediaStream = stream;
},
function (error) {
    console.error("Error trying to get the stream:: " + error.message);
});

// Close link
$("#link-close").click(function() {
    window.top.close();
});