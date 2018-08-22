'use strict';

console.log('popup.js');

// let changeColor = document.getElementById('changeColor');
// chrome.storage.sync.get('color', function (data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// });
// changeColor.onclick = function (element) {
//     let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//         chrome.tabs.executeScript(
//             tabs[0].id,
//             // {code: 'document.body.style.backgroundColor = "' + color + '";'}
//             {
//                 code: 'var scriptTag = document.createElement(\'script\');\n' +
//                     '    scriptTag.textContent = \'let a = 10;\';\n' +
//                     '    scriptTag.onload = function () { this.parentNode.removeChild(this) };\n' +
//                     '    var container = document.head || document.documentElement;\n' +
//                     'container.insertBefore(scriptTag, container.children[0]);'
//             }
//         );
//         chrome.tabs.sendMessage(tabs[0].id, {type: 'popup.js'}, function (response) {
//             console.log(response);
//         });
//     });
// };

chrome.runtime.onConnect.addListener(function (port) {
    console.log("popup.js: onConnect");
    console.log(port);
});

chrome.runtime.onMessage.addListener(function (v) {
    console.log('popup.js: onMessage');
    console.log(v);
});

/**
 * Appends transaction data to awaiting transaction list.
 *
 * @param data transaction data
 */
function appendTransaction(data) {
    const container = document.getElementById('tab-tx');
    // format data
    data = JSON.stringify(data);

    // clone transaction template
    let txElement = document.getElementById('tx-template').cloneNode(true);
    txElement.removeAttribute('id');
    txElement.style.display = 'block';
    txElement.getElementsByClassName('tx-data')[0].innerHTML = data;
    // assign accept button
    let btnAccept = txElement.getElementsByClassName('btn-accept')[0];
    btnAccept.addEventListener('click', function () {
        console.log('btnAccept: click');
        txElement.remove();
    });
    // assign cancel button
    let btnCancel = txElement.getElementsByClassName('btn-cancel')[0];
    btnCancel.addEventListener('click', function () {
        console.log('btnCancel: click');
        txElement.remove();
    });
    // add transaction to list
    container.appendChild(txElement);
}

window.onload = function () {

    // switching between tabs
    let tabLinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].addEventListener('click', function (evt) {
            // get tabs
            let tabs = document.getElementsByClassName('tabcontent');
            // hide all
            for (let j = 0; j < tabs.length; j++) {
                tabs[j].style.display = 'none';
            }
            // show selected
            const selectedTabId = evt.srcElement.value;
            document.getElementById(selectedTabId).style.display = 'block';
        });
    }
};
