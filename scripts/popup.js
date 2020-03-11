chrome.runtime.getBackgroundPage(function(bg) {
    if (bg.sessionDataHTML) {
        document.body.innerHTML = bg.sessionDataHTML;
    }
    setInterval(function () {
        bg.sessionDataHTML = document.body.innerHTML
    }, 10);

    var enableInput = $("#enableInputButton");
    enableInput.click(function () {
        chrome.tabs.create({
            active: true,
            url: 'enableMicrophone.html'
        }, null);
    });

    var openCommands = $("#commandsButton");
    openCommands.click(function () {
        var prefix = "";
        chrome.storage.sync.get('prefix', function (result) {
            prefix = result.prefix;
            if (prefix == "on") {
                chrome.tabs.create({
                    active: true,
                    url: 'http://www.getnavivoice.com/commands.html'
                }, null);
            }
            else if (prefix == "off")
            {
                chrome.tabs.create({
                    active: true,
                    url: 'http://www.getnavivoice.com/commandsNoPrefix.html'
                }, null);
            }
        });
    });

    var openSettings = $("#settingsButton");
    openSettings.click(function () {
        chrome.tabs.create({
            active: true,
            url: 'settings.html'
        }, null);
    });

    /*var toggleListen = $("#toggleListen");
    toggleListen.click(function () {
        if (toggleListen.hasClass("not-listening")) {
            toggleListen.addClass("listening");
            toggleListen.css("background-color", "#428A45");
            toggleListen.removeClass("not-listening");
            toggleListen.text("STOP LISTENING")
            chrome.runtime.getBackgroundPage(function (bgWindow) {
                bgWindow.startButton(event);
            });
        }
        else if (toggleListen.hasClass("listening")) {
           // chrome.runtime.reload();
        }
    });

    toggleListen.mouseenter(function () {
        if (toggleListen.hasClass("not-listening")) {
            toggleListen.css("background-color", "#CC0000");
        }
        if (toggleListen.hasClass("listening")) {
            toggleListen.css("background-color", "#428A45");
        }
    });

    toggleListen.mouseleave(function () {
        if (toggleListen.hasClass("not-listening")) {
            toggleListen.css("background-color", "#FF3333");
        }
        if (toggleListen.hasClass("listening")) {
            toggleListen.css("background-color", "#53AC56");
        }
    });*/
});
