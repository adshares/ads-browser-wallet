'use strict';

const {
    CONN_ID_POPUP,
    MSG_DELETE_ACCOUNT,
    MSG_IMPORT_KEY_REQ,
    MSG_IMPORT_KEY_RES,
    MSG_LOG_OUT,
    MSG_NEW_PASSWORD,
    MSG_PASSWORD,
    MSG_PAGE_SELECT,
    MSG_INVALID_PASSWORD,
    MSG_INVALID_NEW_PASSWORD,
    STATUS_FAIL,
    STATUS_SUCCESS
} = require('./enums');


console.log('popup.js' + new Date());

// connection with background script
let BackgroundPort = chrome.runtime.connect({name: CONN_ID_POPUP});
BackgroundPort.onMessage.addListener(function (v) {
    console.log('popup.js: onMessage');
    console.log(v);
    // TODO remove - transaction will be added from storage
    // appendTransaction('onMessage');

    switch (v.type) {
        case MSG_IMPORT_KEY_RES:
            console.log('todo1 ' + v.type);
            console.log('todo2 ' + v.status);
            if (STATUS_SUCCESS === v.status) {
                // TODO import accepted
            } else {// STATUS_FAIL
                // TODO import rejected
            }
            break;
        case MSG_PAGE_SELECT:
            showPage(v.pageId, v.tabId);
            break;
        case MSG_INVALID_PASSWORD:
            // TODO invalid password - error handling
            console.error('invalid password');
            break;
        case MSG_INVALID_NEW_PASSWORD:
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
            BackgroundPort.postMessage({type: MSG_NEW_PASSWORD, data: pass});
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
        BackgroundPort.postMessage({type: MSG_PASSWORD, data: pass});
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
    // import key
    let btnImpKey = document.getElementById('btn-imp-key');
    btnImpKey.addEventListener('click', function () {
        const name = document.getElementById('imp-key-name').value;
        const sk = document.getElementById('imp-key-sk').value;
        const pk = document.getElementById('imp-key-pk').value;
        const sg = document.getElementById('imp-key-sg').value;
        const pass = document.getElementById('imp-key-password').value;
        BackgroundPort.postMessage({
            type: MSG_IMPORT_KEY_REQ,
            data: {
                name: name,
                sk: sk,
                pk: pk,
                sg: sg,
                pass: pass
            }
        });
    });
    // log out
    let btnLogOut = document.getElementById('btn-logout');
    btnLogOut.addEventListener('click', function () {
        BackgroundPort.postMessage({type: MSG_LOG_OUT});
    });
    // delete account
    let btnDeleteAcc = document.getElementById('btn-del-acc');
    btnDeleteAcc.addEventListener('click', function () {
        BackgroundPort.postMessage({type: MSG_DELETE_ACCOUNT});
    });
};
