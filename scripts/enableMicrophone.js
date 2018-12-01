navigator.webkitGetUserMedia({ audio: true },
function (stream) {
    mediaStream = stream;
},
function (error) {
    console.error("Error trying to get the stream:: " + error.message);
});

$("#down-arrow").hover(function() {
    $(this).css("width", "6%");
},function() {
    $(this).css("width", "5%");
});

$("#down-arrow").click(function() {
    if ($("#slide-1").css("display") == "inline-block") {
        $("#slide-1").css("display", "none");
        $("#slide-2").css("display", "inline-block");
        $("#slide-2").addClass("animated fadeInDown");
    }
    else if ($("#slide-2").css("display") == "inline-block") {
        $("#slide-2").css("display", "none");
        $("#slide-3").css("display", "inline-block");
        $("#slide-3").addClass("animated fadeInDown");
        $("#down-arrow").css("visibility", "hidden");
    }
});

$("#button-close").mousedown(function() {
    $(this).css("top", "323px");
});

$("#button-close").mouseup(function() {
    $(this).css("top", "320px");
});

$("#button-close").click(function() {
    window.top.close();
})