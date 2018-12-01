var transcript;
// Setting Chrome storage variables
var prefix = 'on';
chrome.storage.sync.set({'prefix': prefix});
var voice = 'on';
chrome.storage.sync.set({'voice': voice});

// Start event
function startButton(event) {
    console.log("starting up");
    recognition.start();
}

if (!('webkitSpeechRecognition' in window)) {
    //webkitSpeechRecognition not supported :(
    console.log("webkitSpeechRecognition not supported");
}
else {
    // webkitSpeechRecognition supported! :)
    console.log("webkitSpeechRecognition supported");
    var recognition = new webkitSpeechRecognition(); //Object which manages recognition success
    recognition.continuous = true; // Suitable for dictation
    recognition.interimResults = true; // Start receiving results even if they are not final
    recognition.lang = "en-US"; // Define some more parameters for the recognition
    recognition.maxAlternatives = 1;

    // Message arrays
    var whatResponses = ["Yes?", "Whats up?", "What can I help you with?", "Hello.", "Hey."];
    var okResponses = ["Alright.", "I gotchu.", "Okay.", "No problem."];

    // Immediately start listening
    startButton(event);

    recognition.onstart = function () {
        console.log("recognition starting");
        // Audio input listening started
        // Give visual feedback
    };

    recognition.onend = function () {
        console.log("recognition end");
        // Audio input listening ended
        // Give visual feedback
        // Continuous recording
        recognition.start();
    };

    recognition.onresult = function (event) {
        // Audio input results received
        if (typeof(event.results) == "undefined") {
            // Error
            recognition.start();
            return;
        }

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                var prefix = "";
                chrome.storage.sync.get('prefix', function (result) {
                    prefix = result.prefix;
                    // chrome prefix on
                    if (prefix == "on") {
                        if (event.results[i][0].transcript.toLowerCase().trim().startsWith("chrome")) {
                            // Results are final
                            console.log("words said:" + event.results[i][0].transcript);
                            var utterance = new SpeechSynthesisUtterance("");
                            var voices = window.speechSynthesis.getVoices();
                            utterance.lang = "en-US";
                            utterance.voice = voices.filter(function(voice) { return voice.name == 'Alex'; })[0];

                            // chrome new tab
                            if (event.results[i][0].transcript.toLowerCase().trim().includes("new tab")) {
                                chrome.tabs.create({url: "chrome://newtab"});
                                var utterance = new SpeechSynthesisUtterance("Opening a new tab.");
                            }
                            // chrome go to
                            else if (event.results[i][0].transcript.toLowerCase().trim().includes("go to") && event.results[i][0].transcript.trim().length > 13 && event.results[i][0].transcript.toLowerCase().trim().includes(".")) {
                                var requestedUrl = event.results[i][0].transcript.toLowerCase().trim().substr(13, event.results[i][0].transcript.trim().length - 1).replace(/\s+/g, '');
                                // reddit.com/r/ replace
                                if (requestedUrl.includes("reddit.comslashareslash")) {
                                    requestedUrl = requestedUrl.replace("reddit.comslashareslash","reddit.com/r/");
                                }
                                // if user doesn't say http:// then add http:// prefix
                                if (requestedUrl.startsWith("http://") == false) {
                                    chrome.tabs.update({
                                        url: "http://" + requestedUrl
                                    });
                                }
                                else {
                                    chrome.tabs.update({
                                        url: requestedUrl
                                    });
                                }
                                utterance = new SpeechSynthesisUtterance("Redirecting you to '" + requestedUrl + "'.");
                            }
                            // chrome close tab
                            else if (event.results[i][0].transcript.toLowerCase().trim().includes("close tab")) {
                                if (event.results[i][0].transcript.toLowerCase().trim().length > 17) {
                                    var requestedTab = event.results[i][0].transcript.toLowerCase().trim().substr(event.results[i][0].transcript.toLowerCase().trim().indexOf("tab") + 4, event.results[i][0].transcript.toLowerCase().trim().length - 1);
                                    console.log(requestedTab);
                                    chrome.tabs.query({}, function (tabs) {
                                        chrome.tabs.remove(tabs[parseInt(requestedTab) - 1].id);
                                    });
                                }
                                else {
                                    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                        chrome.tabs.remove(tabs[0].id);
                                    });
                                    utterance = new SpeechSynthesisUtterance("Closing tab.");
                                }
                            }
                            // chrome close chrome
                            else if (event.results[i][0].transcript.toLowerCase().trim().includes("close chrome")) {
                                chrome.tabs.query({}, function (tabs) {
                                    for (var i = 0; i < tabs.length; i++) {
                                        chrome.tabs.remove(tabs[i].id);
                                    }
                                });
                            }
                            // chrome scroll down
                            else if (event.results[i][0].transcript.toLowerCase().trim().includes("scroll down")) {
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "var height = $(window).height(); $('html, body').animate({scrollTop: '+=' + (height - 100) + 'px'}, 300);"
                                    });
                                });
                            }
                            // chrome scroll up
                            else if (event.results[i][0].transcript.toLowerCase().trim().includes("scroll up")) {
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "var height = $(window).height(); $('html, body').animate({scrollTop: '-=' + (height - 100) + 'px'}, 300);"
                                    });
                                });
                            }
                            // chrome go back
                            else if (event.results[i][0].transcript.toLowerCase().trim().includes("back") && event.results[i][0].transcript.toLowerCase().trim().includes("go to") == false) {
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "window.history.back();"
                                    });
                                });
                                utterance = new SpeechSynthesisUtterance("Going backwards.");
                            }
                            // chrome go forward
                            else if (event.results[i][0].transcript.toLowerCase().trim().includes("forward") && event.results[i][0].transcript.toLowerCase().trim().includes("go to") == false) {
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "window.history.forward();"
                                    });
                                });
                                utterance = new SpeechSynthesisUtterance("Going forwards.");
                            }
                            // chrome go to tab
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1).startsWith("go to tab") || event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1).startsWith("tab")) {
                                var requestedTab = event.results[i][0].transcript.toLowerCase().trim().substr(event.results[i][0].transcript.toLowerCase().trim().indexOf("tab") + 4, event.results[i][0].transcript.trim().length - 1);
                                chrome.tabs.query({}, function (tabs) {
                                    chrome.tabs.update(tabs[parseInt(requestedTab) - 1].id, {selected: true});
                                });
                                utterance = new SpeechSynthesisUtterance("Switching to tab '" + requestedTab + "'.");
                            }
                            // chrome click on
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1).startsWith("click on") && event.results[i][0].transcript.toLowerCase().trim().endsWith("no spaces") == false && event.results[i][0].transcript.toLowerCase().trim().length > 16) {
                                var requestedLink = event.results[i][0].transcript.toLowerCase().trim().substr(16, event.results[i][0].transcript.toLowerCase().trim().length - 1);
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "jQuery.expr[':'].Contains = jQuery.expr.createPseudo(function(arg) { return function( elem ) { return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0; }; }); window.location.href = $('a:Contains(\"" + requestedLink + "\")').attr('href');"
                                    });
                                });
                                utterance = new SpeechSynthesisUtterance("Clicking on '" + requestedLink + "'.");
                            }
                            // chrome click on no spaces
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1).startsWith("click on") && event.results[i][0].transcript.toLowerCase().trim().endsWith("no spaces") && event.results[i][0].transcript.toLowerCase().trim().length > 26) {
                                var requestedLink = event.results[i][0].transcript.toLowerCase().trim().substr(15, event.results[i][0].transcript.toLowerCase().trim().length - 25).replace(/\s+/g, '');
                                console.log(requestedLink);
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "jQuery.expr[':'].Contains = jQuery.expr.createPseudo(function(arg) { return function( elem ) { return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0; }; }); window.location.href = $('a:Contains(\"" + requestedLink + "\")').attr('href');"
                                    });
                                });
                                utterance = new SpeechSynthesisUtterance("Clicking on '" + requestedLink + "'.");
                            }
                            // chrome input
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1).startsWith("input") || event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1).startsWith("search") &&  event.results[i][0].transcript.toLowerCase().trim().length > 13) {
                                var requestedInput = event.results[i][0].transcript.toLowerCase().trim().substr(13, event.results[i][0].transcript.toLowerCase().trim().length - 1).trim();
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "$('input[type=\"text\"]').val('" + requestedInput + "');"
                                    });
                                });
                                 utterance = new SpeechSynthesisUtterance("Inputting '" + requestedInput + "'.");
                            }
                            // chrome explicit input
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1).startsWith("explicit input") &&  event.results[i][0].transcript.toLowerCase().trim().length > 22) {
                                var requestedExplicitInput = event.results[i][0].transcript.toLowerCase().trim().substr(22, event.results[i][0].transcript.toLowerCase().trim().indexOf("into") - 23);
                                var requestedField = event.results[i][0].transcript.toLowerCase().trim().substr(event.results[i][0].transcript.toLowerCase().trim().indexOf("into") + 4, event.results[i][0].transcript.toLowerCase().trim().length - 1).trim();
                                console.log(requestedExplicitInput);
                                console.log(requestedField);
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "$('input[type=\"text\"][placeholder=\"" + requestedField + "\" i]').val('" + requestedExplicitInput + "');"
                                    });
                                });
                                utterance = new SpeechSynthesisUtterance("Explicitly inputting '" + requestedExplicitInput + "' into '" + requestedField + "'.");
                            }
                            // chrome explicitly input
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1).startsWith("explicitly input") &&  event.results[i][0].transcript.toLowerCase().trim().length > 24) {
                                var requestedExplicitInput = event.results[i][0].transcript.toLowerCase().trim().substr(24, event.results[i][0].transcript.toLowerCase().trim().indexOf("into") - 25);
                                var requestedField = event.results[i][0].transcript.toLowerCase().trim().substr(event.results[i][0].transcript.toLowerCase().trim().indexOf("into") + 4, event.results[i][0].transcript.toLowerCase().trim().length - 1).trim();
                                console.log(requestedExplicitInput);
                                console.log(requestedField);
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "$('input[type=\"text\"][placeholder=\"" + requestedField + "\" i]').val('" + requestedExplicitInput + "');"
                                    });
                                });
                                utterance = new SpeechSynthesisUtterance("Explicitly inputting '" + requestedExplicitInput + "' into '" + requestedField + "'.");
                            }
                            // chrome submit
                            else if ((event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == "enter" || event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == "submit" || event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == "search") && event.results[i][0].transcript.trim().length < 14) {
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "$('input[type=\"text\"]').parent().find('input[type=\"submit\"]').trigger('click');"
                                        //$('button[type=\"submit\"]').trigger('click');
                                    });
                                });
                                utterance = new SpeechSynthesisUtterance("Submitting input.");
                            }
                            // chrome google
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1).startsWith("google")) {
                                var requestedSearch = event.results[i][0].transcript.toLowerCase().trim().substr(14, event.results[i][0].transcript.trim().length - 1);
                                chrome.tabs.update({
                                    url: "https://www.google.com/search?q=" + requestedSearch.split(' ').join('+')
                                });
                            }
                            // chrome stop speaking
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == "stop speaking") {
                                var voice = 'off';
                                chrome.storage.sync.set({'voice': voice});
                            }
                            // chrome start speaking
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == "start speaking") {
                                var voice = 'on';
                                chrome.storage.sync.set({'voice': voice});
                            }
                            // chrome help
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == "help") {
                                chrome.tabs.create({url: "http://www.navivoice.org/commands.html"});
                                utterance = new SpeechSynthesisUtterance("Opening help.");
                            }
                            // chrome toggle
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == "toggle") {
                                var prefix = 'off';
                                chrome.storage.sync.set({'prefix': prefix});
                                utterance = new SpeechSynthesisUtterance("Prefix has been turned off. You will now say commands without the 'chrome' prefix.");
                            }
                            // chrome othello reversi
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == "othello reversi") {
                                chrome.tabs.create({url: "https://misscaptainalex.files.wordpress.com/2013/05/210.gif"});
                                utterance = new SpeechSynthesisUtterance("JULIAN BOOLEAN!");
                            }
                            // chrome pause video
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == ("pause video") || event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == ("play video") || event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == ("paws video") ) {
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "$('.ytp-play-button').click();"
                                    });
                                });
                            }
                            // chrome mute video
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1) == ("mute video")) {
                                chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                    chrome.tabs.executeScript({
                                        code: "$('.ytp-mute-button').click();"
                                    });
                                });
                            }
                            // chrome calculate
                            else if (event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1).startsWith("calculate")) {
                                var answer = eval(event.results[i][0].transcript.toLowerCase().trim().substr(17, event.results[i][0].transcript.trim().length - 1).replace("divided by", "/").replace("multiplied by", "*").replace("x", "*").replace("times", "*"));
                                answer = answer.toString();
                                utterance = new SpeechSynthesisUtterance(event.results[i][0].transcript.toLowerCase().trim().substr(17, event.results[i][0].transcript.trim().length - 1) + " is " + answer);
                            }
                            // chrome (without follow up command)
                            else if (event.results[i][0].transcript.toLowerCase().trim() == ("chrome")) {
                                utterance = new SpeechSynthesisUtterance(whatResponses[Math.floor(Math.random()*whatResponses.length)]);
                            }
                            else {
                                utterance = new SpeechSynthesisUtterance("I don't understand " + event.results[i][0].transcript);
                            }
                            // if voice variable is set to on
                            var voice = "";
                            chrome.storage.sync.get('voice', function (result) {
                               voice = result.voice;
                               if (voice == "on") {
                                window.speechSynthesis.speak(utterance);
                               }
                            });
                        }
                    }
                    // chrome prefix off
                    else if (prefix == "off") {
                        // Results are final
                        console.log("words said:" + event.results[i][0].transcript);
                        var utterance = new SpeechSynthesisUtterance("");
                        var voices = window.speechSynthesis.getVoices();
                        utterance.lang = "en-US";
                        utterance.voice = voices.filter(function(voice) { return voice.name == 'Alex'; })[0];
                        // new tab
                        if (event.results[i][0].transcript.toLowerCase().trim().includes("new tab")) {
                            chrome.tabs.create({url: "chrome://newtab"});
                            var utterance = new SpeechSynthesisUtterance("Opening a new tab.");
                        }
                        // go to
                        else if (event.results[i][0].transcript.toLowerCase().trim().includes("go to") && event.results[i][0].transcript.trim().length > 6 && event.results[i][0].transcript.toLowerCase().trim().includes(".")) {
                            var requestedUrl = event.results[i][0].transcript.toLowerCase().trim().substr(6, event.results[i][0].transcript.trim().length - 1).replace(/\s+/g, '');
                            // reddit.com/r/ replace
                            if (requestedUrl.includes("reddit.comslashareslash")) {
                                requestedUrl = requestedUrl.replace("reddit.comslashareslash","reddit.com/r/");
                            }
                            // if user doesn't say http:// then add
                            if (requestedUrl.startsWith("http://") == false) {
                                chrome.tabs.update({
                                    url: "http://" + requestedUrl
                                });
                            }
                            else {
                                chrome.tabs.update({
                                    url: requestedUrl
                                });
                            }
                            utterance = new SpeechSynthesisUtterance("Redirecting you to '" + requestedUrl + "'.");
                        }
                        // close tab
                        else if (event.results[i][0].transcript.toLowerCase().trim().includes("close tab")) {
                            if (event.results[i][0].transcript.toLowerCase().trim().length > 10) {
                                var requestedTab = event.results[i][0].transcript.toLowerCase().trim().substr(event.results[i][0].transcript.toLowerCase().trim().indexOf("tab") + 4, event.results[i][0].transcript.toLowerCase().trim().length - 1);
                                console.log(requestedTab);
                                chrome.tabs.query({}, function (tabs) {
                                    chrome.tabs.remove(tabs[parseInt(requestedTab) - 1].id);
                                });
                            }
                            else {
                                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                    chrome.tabs.remove(tabs[0].id);
                                });
                                utterance = new SpeechSynthesisUtterance("Closing tab.");
                            }
                        }
                        // close chrome
                        else if (event.results[i][0].transcript.toLowerCase().trim().includes("close chrome")) {
                            chrome.tabs.query({}, function (tabs) {
                                for (var i = 0; i < tabs.length; i++) {
                                    chrome.tabs.remove(tabs[i].id);
                                }
                            });
                        }
                        // scroll down
                        else if (event.results[i][0].transcript.toLowerCase().trim().includes("scroll down")) {
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "var height = $(window).height(); $('html, body').animate({scrollTop: '+=' + (height - 100) + 'px'}, 300);"
                                });
                            });
                        }
                        // scroll up
                        else if (event.results[i][0].transcript.toLowerCase().trim().includes("scroll up")) {
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "var height = $(window).height(); $('html, body').animate({scrollTop: '-=' + (height - 100) + 'px'}, 300);"
                                });
                            });
                        }
                        // go to
                        else if (event.results[i][0].transcript.toLowerCase().trim().includes("back") && event.results[i][0].transcript.toLowerCase().trim().includes("go to") == false) {
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "window.history.back();"
                                });
                            });
                            utterance = new SpeechSynthesisUtterance("Going backwards.");
                        }
                        // forward
                        else if (event.results[i][0].transcript.toLowerCase().trim().includes("forward") && event.results[i][0].transcript.toLowerCase().trim().includes("go to") == false) {
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "window.history.forward();"
                                });
                            });
                            utterance = new SpeechSynthesisUtterance("Going forwards.");
                        }
                        // go to tab
                        else if (event.results[i][0].transcript.toLowerCase().trim().startsWith("go to tab") || event.results[i][0].transcript.toLowerCase().trim().startsWith("tab")) {
                            var requestedTab = event.results[i][0].transcript.toLowerCase().trim().substr(event.results[i][0].transcript.toLowerCase().trim().indexOf("tab") + 4, event.results[i][0].transcript.trim().length - 1);
                            chrome.tabs.query({}, function (tabs) {
                                chrome.tabs.update(tabs[parseInt(requestedTab) - 1].id, {selected: true});
                            });
                            utterance = new SpeechSynthesisUtterance("Switching to tab '" + requestedTab + "'.");
                        }
                        // click on
                        else if (event.results[i][0].transcript.toLowerCase().trim().startsWith("click on") && event.results[i][0].transcript.toLowerCase().trim().endsWith("no spaces") == false && event.results[i][0].transcript.toLowerCase().trim().length > 9) {
                            var requestedLink = event.results[i][0].transcript.toLowerCase().trim().substr(9, event.results[i][0].transcript.toLowerCase().trim().length - 1);
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "jQuery.expr[':'].Contains = jQuery.expr.createPseudo(function(arg) { return function( elem ) { return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0; }; }); window.location.href = $('a:Contains(\"" + requestedLink + "\")').attr('href');"
                                });
                            });
                            utterance = new SpeechSynthesisUtterance("Clicking on '" + requestedLink + "'.");
                        }
                        // click on no spaces
                        else if (event.results[i][0].transcript.toLowerCase().trim().startsWith("click on") && event.results[i][0].transcript.toLowerCase().trim().endsWith("no spaces") && event.results[i][0].transcript.toLowerCase().trim().length > 19) {
                            var requestedLink = event.results[i][0].transcript.toLowerCase().trim().substr(9, event.results[i][0].transcript.toLowerCase().trim().length - 19).replace(/\s+/g, '');
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "jQuery.expr[':'].Contains = jQuery.expr.createPseudo(function(arg) { return function( elem ) { return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0; }; }); window.location.href = $('a:Contains(\"" + requestedLink + "\")').attr('href');"
                                });
                            });
                            utterance = new SpeechSynthesisUtterance("Clicking on '" + requestedLink + "'.");
                        }
                        // input
                        else if ((event.results[i][0].transcript.toLowerCase().trim().startsWith("input") && event.results[i][0].transcript.toLowerCase().trim().length > 6) || (event.results[i][0].transcript.toLowerCase().trim().startsWith("search") && event.results[i][0].transcript.toLowerCase().trim().length > 7)) {
                            if (event.results[i][0].transcript.toLowerCase().trim().startsWith("input")) {
                                var requestedInput = event.results[i][0].transcript.toLowerCase().trim().substr(6, event.results[i][0].transcript.toLowerCase().trim().length - 1).trim();
                            }
                            else
                            {
                                var requestedInput = event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.toLowerCase().trim().length - 1).trim();
                            }
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "$('input[type=\"text\"]').val('" + requestedInput + "');"
                                });
                            });
                            utterance = new SpeechSynthesisUtterance("Inputting '" + requestedInput + "'.");
                        }
                        // explicit input
                        else if (event.results[i][0].transcript.toLowerCase().trim().startsWith("explicit input") &&  event.results[i][0].transcript.toLowerCase().trim().length > 15) {
                            var requestedExplicitInput = event.results[i][0].transcript.toLowerCase().trim().substr(15, event.results[i][0].transcript.toLowerCase().trim().indexOf("into") - 16);
                            var requestedField = event.results[i][0].transcript.toLowerCase().trim().substr(event.results[i][0].transcript.toLowerCase().trim().indexOf("into") + 4, event.results[i][0].transcript.toLowerCase().trim().length - 1).trim();
                            console.log(requestedExplicitInput);
                            console.log(requestedField);
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "$('input[type=\"text\"][placeholder=\"" + requestedField + "\" i]').val('" + requestedExplicitInput + "');"
                                });
                            });
                            utterance = new SpeechSynthesisUtterance("Explicitly inputting '" + requestedExplicitInput + "' into '" + requestedField + "'.");
                        }
                        // explicitly input
                        else if (event.results[i][0].transcript.toLowerCase().trim().startsWith("explicitly input") &&  event.results[i][0].transcript.toLowerCase().trim().length > 17) {
                            var requestedExplicitInput = event.results[i][0].transcript.toLowerCase().trim().substr(17, event.results[i][0].transcript.toLowerCase().trim().indexOf("into") - 18);
                            var requestedField = event.results[i][0].transcript.toLowerCase().trim().substr(event.results[i][0].transcript.toLowerCase().trim().indexOf("into") + 4, event.results[i][0].transcript.toLowerCase().trim().length - 1).trim();
                            console.log(requestedExplicitInput);
                            console.log(requestedField);
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "$('input[type=\"text\"][placeholder=\"" + requestedField + "\" i]').val('" + requestedExplicitInput + "');"
                                });
                            });
                            utterance = new SpeechSynthesisUtterance("Explicitly inputting '" + requestedExplicitInput + "' into '" + requestedField + "'.");
                        }
                        // submit
                        else if ((event.results[i][0].transcript.toLowerCase().trim() == "enter" || event.results[i][0].transcript.toLowerCase().trim() == "submit"  || event.results[i][0].transcript.toLowerCase().trim() == "search") && event.results[i][0].transcript.trim().length < 7) {
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "$('input[type=\"text\"]').parent().find('input[type=\"submit\"]').trigger('click');"
                                    //$('button[type=\"submit\"]').trigger('click');
                                });
                            });
                            utterance = new SpeechSynthesisUtterance("Submitting input.");
                        }
                        // google
                        else if (event.results[i][0].transcript.toLowerCase().trim().startsWith("google")) {
                            var requestedSearch = event.results[i][0].transcript.toLowerCase().trim().substr(7, event.results[i][0].transcript.trim().length - 1);
                            chrome.tabs.update({
                                url: "https://www.google.com/search?q=" + requestedSearch.split(' ').join('+')
                            });
                        }
                        // stop speaking
                        else if (event.results[i][0].transcript.toLowerCase().trim() == "stop speaking") {
                            var voice = 'off';
                            chrome.storage.sync.set({'voice': voice});
                        }
                        // start speaking
                        else if (event.results[i][0].transcript.toLowerCase().trim() == "start speaking") {
                            var voice = 'off';
                            chrome.storage.sync.set({'voice': voice});
                        }
                        // help
                        else if (event.results[i][0].transcript.toLowerCase().trim() == "help") {
                            chrome.tabs.create({url: "http://www.navivoice.org/commandsNoPrefix.html"});
                            utterance = new SpeechSynthesisUtterance("Opening help.");
                        }
                        // toggle
                        else if (event.results[i][0].transcript.toLowerCase().trim() == "toggle") {
                            var prefix = 'on';
                            chrome.storage.sync.set({'prefix': prefix});
                            utterance = new SpeechSynthesisUtterance("Prefix has been turned on. You will now say commands with the 'chrome' prefix.");
                        }
                        // othello reversi
                        else if (event.results[i][0].transcript.toLowerCase().trim() == "othello reversi") {
                            chrome.tabs.create({url: "https://misscaptainalex.files.wordpress.com/2013/05/210.gif"});
                            utterance = new SpeechSynthesisUtterance("JULIAN BOOLEAN!");
                        }
                        // pause video
                        else if (event.results[i][0].transcript.toLowerCase().trim() == ("pause video") || event.results[i][0].transcript.toLowerCase().trim() == ("play video") || event.results[i][0].transcript.toLowerCase().trim() == ("paws video")) {
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "$('.ytp-play-button').click();"
                                });
                            });
                        }
                        // mute video
                        else if (event.results[i][0].transcript.toLowerCase().trim() == ("mute video")) {
                            chrome.tabs.executeScript(null, {file: "scripts/jquery-3.1.1.min.js"}, function () {
                                chrome.tabs.executeScript({
                                    code: "$('.ytp-mute-button').click();"
                                });
                            });
                        }
                        // calculate
                        else if (event.results[i][0].transcript.toLowerCase().trim().startsWith("calculate")) {
                            var answer = eval(event.results[i][0].transcript.toLowerCase().trim().substr(10, event.results[i][0].transcript.trim().length - 1).replace("divided by", "/").replace("multiplied by", "*").replace("x", "*").replace("times", "*"));
                            answer = answer.toString();
                            utterance = new SpeechSynthesisUtterance(event.results[i][0].transcript.toLowerCase().trim().substr(10, event.results[i][0].transcript.trim().length - 1) + " is " + answer);
                        }
                        // if voice variable is set to on
                        var voice = "";
                        chrome.storage.sync.get('voice', function (result) {
                            voice = result.voice;
                            if (voice == "on") {
                                window.speechSynthesis.speak(utterance);
                            }
                        });
                    }
                });
                // bug fix
                recognition.stop();
                recognition.start();
            }
            else {
                // Interim results
                console.log("interim words: " + event.results[i][0].transcript);
            }
        }
    }
}

// open enableMicrophone.html on install
function install_notice() {
    if (localStorage.getItem('install_time'))
        return;
    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "./enableMicrophone.html"});
}
install_notice();