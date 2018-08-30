'use strict';

console.log('popup.js' + new Date());

// TODO remove - script will send single messages to background
// connection with background script
let port = chrome.runtime.connect({name:'ads-popup'});
port.onMessage.addListener(function (v) {
    console.log('popup.js: onMessage');
    console.log(v);
    // TODO remove - transaction will be added from storage
    appendTransaction('onMessage');
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
        // TODO compute signature
        chrome.runtime.sendMessage({status:'signed', signature:'0123'});
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

    //TODO clear when transaction will be displayed
    // clear icon badge
    chrome.browserAction.setBadgeText({text: ''});
};
