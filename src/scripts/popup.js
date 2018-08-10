'use strict';

let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function (element) {
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        // chrome.tabs.executeScript(
        //     tabs[0].id,
        //     // {code: 'document.body.style.backgroundColor = "' + color + '";'}
        //     {
        //         code: 'var scriptTag = document.createElement(\'script\');\n' +
        //             '    scriptTag.textContent = \'let a = 10;\';\n' +
        //             '    scriptTag.onload = function () { this.parentNode.removeChild(this) };\n' +
        //             '    var container = document.head || document.documentElement;\n' +
        //             'container.insertBefore(scriptTag, container.children[0]);'
        //     }
        // );
        chrome.tabs.sendMessage(tabs[0].id, {type: 'popup.js'}, function (response) {
            console.log(response);
        });
    });
};
