'use strict';

console.log('popup.js' + new Date());

// connection with background script
let BackgroundPort = chrome.runtime.connect({name: 'ads-popup'});
BackgroundPort.onMessage.addListener(function (v) {
    console.log('popup.js: onMessage');
    console.log(v);
    // TODO remove - transaction will be added from storage
    // appendTransaction('onMessage');

    switch (v.type) {
        case 'page_select':
            showPage(v.pageId, v.tabId);
            break;
        case 'invalid_password':
            // TODO invalid password - error handling
            console.error('invalid password');
            break;
        case 'invalid_new_password':
            // TODO invalid new password - error handling
            console.error('invalid new password');
            break;
        default:
            // TODO
            console.log('Unknown type');
    }
});

function showPage(pageId, tabId) {
    pageId = pageId || 'create-acc-page';
    let pages = document.getElementsByClassName('page');
    for (let j = 0; j < pages.length; j++) {
        pages[j].style.display = 'none';
    }
    document.getElementById(pageId).style.display = 'block';

    if ('user-page' === pageId) {
        showTab(tabId);
    }
}

function showTab(tabId) {
    tabId = tabId || 'tab-tx';
    let tabs = document.getElementsByClassName('tabcontent');
    for (let j = 0; j < tabs.length; j++) {
        tabs[j].style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';

    if ('tab-tx' === tabId) {
        // clear icon badge when awaiting transaction are visible
        chrome.browserAction.setBadgeText({text: ''});
    }
}

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
        chrome.runtime.sendMessage({status: 'signed', signature: '0123'});
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

    /*
    Listeners for Create account page
     */
    let btnCreateAcc = document.getElementById('btn-create-acc');
    btnCreateAcc.addEventListener('click', function () {
        const pass = document.getElementById('password-new').value;
        if (pass === document.getElementById('password-new-confirm').value) {
            BackgroundPort.postMessage({type: 'new_password', data: pass});
        } else {
            // TODO pass not match - error handling
        }
        // clear password input
        document.getElementById('password-new').value = '';
        document.getElementById('password-new-confirm').value = '';
    });
    /*
    Listeners for Login page
     */
    let btnLogIn = document.getElementById('btn-login');
    btnLogIn.addEventListener('click', function () {
        const pass = document.getElementById('password').value;
        BackgroundPort.postMessage({type: 'password', data: pass});
        // clear password input
        document.getElementById('password').value = '';
    });
    /*
    Listeners for User page
     */
    // switching between tabs
    let tabLinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].addEventListener('click', function (evt) {
            showTab(evt.srcElement.value);
        });
    }
    let btnLogOut = document.getElementById('btn-logout');
    btnLogOut.addEventListener('click', function () {
        BackgroundPort.postMessage({type: 'log_out'});
    });
    let btnDeleteAcc = document.getElementById('btn-del-acc');
    btnDeleteAcc.addEventListener('click', function () {
        BackgroundPort.postMessage({type: 'delete_account'});
    });
};
