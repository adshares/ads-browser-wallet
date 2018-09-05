'use strict';

console.log('popup.js' + new Date());

// connection with background script
let BackgroundPort = chrome.runtime.connect({name: 'ads-popup'});
BackgroundPort.onMessage.addListener(function (v) {
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

function isPassSet() {
    const isPass = localStorage.getItem('isPass');
    return 'true' === isPass;
}
function isLogIn() {
    // TODO
    return false;
}

window.onload = function () {

    function showPage(pageId) {
        let pages = document.getElementsByClassName('page');
        for (let j = 0; j < pages.length; j++) {
            pages[j].style.display = 'none';
        }
        document.getElementById(pageId).style.display = 'block';

        if (pageId === 'user-page') {
            showTab();
        }
    }

    function showTab(tabId) {
        const id = tabId || 'tab-tx';
        let tabs = document.getElementsByClassName('tabcontent');
        for (let j = 0; j < tabs.length; j++) {
            tabs[j].style.display = 'none';
        }
        document.getElementById(id).style.display = 'block';

        if (id === 'tab-tx') {
            // clear icon badge when awaiting transaction are visible
            chrome.browserAction.setBadgeText({text: ''});
        }
    }

    // selects active page
    let pageId;
    if (isPassSet()) {
        if (isLogIn()) {
            pageId = 'user-page';
        } else {
            pageId = 'login-page';
        }
    } else {
        pageId = 'create-acc-page';
    }
    showPage(pageId);

    /*
    Listeners for Create account page
     */
    let btnCreateAcc = document.getElementById('btn-create-acc');
    btnCreateAcc.addEventListener('click', function() {
        const pass = document.getElementById('password-new').value;
        // TODO validate password (length, chars)
        if (pass === document.getElementById('password-new-confirm').value) {
            // TODO store password

            localStorage.setItem('isPass', 'true');
            document.getElementById('user-page').classList.add('active');
            showPage('user-page');
        } else {
            // TODO pass not match - error handling
        }
    });
    /*
    Listeners for Login page
     */
    let btnLogIn = document.getElementById('btn-login');
    btnLogIn.addEventListener('click', function() {
        const pass = document.getElementById('password').value;
        // TODO validate password (correctness)
        let isPassValid = true;
        if (isPassValid) {
            showPage('user-page');
        } else {
            // TODO invalid password - error handling
        }
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
    btnLogOut.addEventListener('click', function() {
        showPage('login-page');
    });
    let btnDeleteAcc = document.getElementById('btn-del-acc');
    btnDeleteAcc.addEventListener('click', function() {
        localStorage.removeItem('isPass');
        showPage('create-acc-page');
    });
};
