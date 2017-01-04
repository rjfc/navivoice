/*var prefix = 'on';
chrome.storage.sync.set({'prefix': prefix});
var voice = 'on';
chrome.storage.sync.set({'voice': voice});

if ($("#checkbox-voice").is(':checked')) {
    var voice = 'on';
    chrome.storage.sync.set({'voice': voice});
}
else
{
    var voice = 'off';
    chrome.storage.sync.set({'voice': voice});
}

if ($("#checkbox-prefix").is(':checked')) {
    var prefix = 'on';
    chrome.storage.sync.set({'prefix': prefix});
}
else
{
    var prefix = 'off';
    chrome.storage.sync.set({'prefix': prefix});
}

var voice = "";
chrome.storage.sync.get('voice', function (result) {
    voice = result.voice;
    console.log(voice);
    if (voice == "on") {
        $("#checkbox-voice").prop('checked', true);
    }
    else if (voice == "off")
    {
        $('#checkbox-voice').prop('checked', false);
    }
});

var prefix = "";
chrome.storage.sync.get('prefix', function (result) {
    prefix = result.prefix;
    if (prefix == "on") {
        $("#checkbox-prefix").prop('checked', true);
    }
    else if (prefix == "off")
    {
        $('#checkbox-prefix').prop('checked', false);
    }
});
*/
