const store = require('./store');
const {
  CONN_ID_POPUP,
  MSG_DELETE_ACCOUNT,
  MSG_IMPORT_KEY_REQ,
  MSG_IMPORT_KEY_RES,
  MSG_INVALID_NEW_PASSWORD,
  MSG_INVALID_PASSWORD,
  MSG_LOG_OUT,
  MSG_NEW_PASSWORD,
  MSG_PASSWORD,
  MSG_PAGE_SELECT,
  MSG_TX_REJECT_REQ,
  MSG_TX_REJECT_RES,
  MSG_TX_SIGN_REQ,
  MSG_TX_SIGN_RES,
  // STATUS_FAIL,
  STATUS_SUCCESS,
  STORE_KEY_TX,
} = require('./enums');


console.log(`popup.js${new Date()}`);

// connection with background script
const BackgroundPort = chrome.runtime.connect({ name: CONN_ID_POPUP });
BackgroundPort.onMessage.addListener((v) => {
  console.log('popup.js: onMessage');
  console.log(v);
  // TODO remove - transaction will be added from storage
  // appendTransaction('onMessage');

  switch (v.type) {
    case MSG_IMPORT_KEY_RES:
      console.log(`todo1 ${v.type}`);
      console.log(`todo2 ${v.status}`);
      if (STATUS_SUCCESS === v.status) {
        // clear form
        // name field is not clear, because user has no access to it (it is hidden)
        // field was created for (future) use case with multiple keys
        // document.getElementById('imp-key-name').value = '';
        document.getElementById('imp-key-sk').value = '';
        document.getElementById('imp-key-pk').value = '';
        document.getElementById('imp-key-sg').value = '';
        document.getElementById('imp-key-password').value = '';
        // TODO import accepted
      } else { // STATUS_FAIL
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
    case MSG_TX_REJECT_RES:
    case MSG_TX_SIGN_RES:
      console.log(`${v.type} status:${v.status}`);
      if (STATUS_SUCCESS === v.status) {
        const id = `tx-${v.data}`;
        document.getElementById(id).remove();
      } else { // STATUS_FAIL
        // TODO tx reject or sign fail
      }
      break;
    default:
      // TODO
      console.log('Unknown type');
  }
});

function showPage(pageId, tabId) {
  pageId = pageId || 'create-acc-page';
  const pages = document.getElementsByClassName('page');
  for (let j = 0; j < pages.length; j++) {
    pages[j].style.display = 'none';
  }
  document.getElementById(pageId).style.display = 'block';

  if (pageId === 'user-page') {
    showTab(tabId);
  }
}

function showTab(tabId) {
  tabId = tabId || 'tab-tx';
  const tabs = document.getElementsByClassName('tabcontent');
  for (let j = 0; j < tabs.length; j++) {
    tabs[j].style.display = 'none';
  }
  document.getElementById(tabId).style.display = 'block';

  if (tabId === 'tab-tx') {
    // refresh transaction list
    console.log('refresh transaction list');
    store.getData(STORE_KEY_TX).then((obj) => {
      appendTransaction(obj);
    });

    // clear icon badge when pending transaction are visible
    chrome.browserAction.setBadgeText({ text: '' });
  }
}

/**
 * Appends transaction data to pending transaction list.
 *
 * @param data transaction data
 */
function appendTransaction(data) {
  const container = document.getElementById('tx-pending');
  // remove all children
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  console.log(data);
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const ts = key;
      const mid = data[key].m;
      const txData = data[key].d;
      const txAccountHashin = data[key].h;

      console.log(ts, txData, txAccountHashin);

      // clone transaction template
      const txElement = document.getElementById('tx-template').cloneNode(true);
      txElement.setAttribute('id', `tx-${ts}`);
      txElement.style.display = 'block';
      txElement.getElementsByClassName('tx-date')[0].innerHTML = new Date(parseInt(ts)).toLocaleString();
      txElement.getElementsByClassName('tx-data')[0].innerHTML = `${txData}:${txAccountHashin}`;

      // assign accept button
      const btnAccept = txElement.getElementsByClassName('btn-accept')[0];
      btnAccept.addEventListener('click', () => {
        console.log('btnAccept: click');
        BackgroundPort.postMessage({
          type: MSG_TX_SIGN_REQ,
          data: {
            ts,
            d: txData,
            h: txAccountHashin,
            m: mid,
          },
        });
      });

      // assign cancel button
      const btnCancel = txElement.getElementsByClassName('btn-cancel')[0];
      btnCancel.addEventListener('click', () => {
        console.log('btnCancel: click');
        BackgroundPort.postMessage({ type: MSG_TX_REJECT_REQ, data: ts });
      });

      // add transaction to list
      container.appendChild(txElement);
    }
  }
}

window.onload = () => {
  /*
  Listeners for Create account page
   */
  const btnCreateAcc = document.getElementById('btn-create-acc');
  btnCreateAcc.addEventListener('click', () => {
    const pass = document.getElementById('password-new').value;
    if (pass === document.getElementById('password-new-confirm').value) {
      BackgroundPort.postMessage({ type: MSG_NEW_PASSWORD, data: pass });
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
  const btnLogIn = document.getElementById('btn-login');
  btnLogIn.addEventListener('click', () => {
    const pass = document.getElementById('password').value;
    BackgroundPort.postMessage({ type: MSG_PASSWORD, data: pass });
    // clear password input
    document.getElementById('password').value = '';
  });
  /*
  Listeners for User page
   */
  // switching between tabs
  const tabLinks = document.getElementsByClassName('tablink');
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].addEventListener('click', (evt) => {
      showTab(evt.srcElement.value);
    });
  }
  // import key
  const btnImpKey = document.getElementById('btn-imp-key');
  btnImpKey.addEventListener('click', () => {
    const name = document.getElementById('imp-key-name').value;
    const sk = document.getElementById('imp-key-sk').value;
    const pk = document.getElementById('imp-key-pk').value;
    const sg = document.getElementById('imp-key-sg').value;
    const pass = document.getElementById('imp-key-password').value;
    BackgroundPort.postMessage({
      type: MSG_IMPORT_KEY_REQ,
      data: {
        name,
        sk,
        pk,
        sg,
        pass,
      },
    });
  });
  // log out
  const btnLogOut = document.getElementById('btn-logout');
  btnLogOut.addEventListener('click', () => {
    BackgroundPort.postMessage({ type: MSG_LOG_OUT });
  });
  // delete account
  const btnDeleteAcc = document.getElementById('btn-del-acc');
  btnDeleteAcc.addEventListener('click', () => {
    BackgroundPort.postMessage({ type: MSG_DELETE_ACCOUNT });
  });
};
