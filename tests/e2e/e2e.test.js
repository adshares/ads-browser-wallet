const CryptoJS = require('crypto-js');
const { By, logging } = require('selenium-webdriver');
const { setupBrowser } = require('./setup');
const {
  STORE_KEY_VAULT,
} = require('../../src/scripts/enums');

/**
 * Plugin account password
 * @type {string}
 */
const password = 'asdf';
/**
 * Secret key
 * @type {string}
 */
const secretKey = 'FF767FC8FAF9CFA8D2C3BD193663E8B8CAC85005AD56E085FAB179B52BD88DD6';
/**
 * Public key
 * @type {string}
 */
const publicKey = 'D69BCCF69C2D0F6CED025A05FA7F3BA687D1603AC1C8D9752209AC2BBF2C4D17';
/**
 * Signature of empty string created with secret key
 * @type {string}
 */
const signature = '7A1CA8AF3246222C2E06D2ADE525A693FD81A2683B8A8788C32B7763DF6037A5'
  + 'DF3105B92FEF398AF1CDE0B92F18FE68DEF301E4BF7DB0ABC0AEA6BE24969006';

/**
 * Selenium WebDriver
 */
let driver;
/**
 * Popup page URI
 */
let popupUri;

/**
 * Returns data from store.
 *
 * @param key
 * @returns {Promise<void>}
 */
async function getStoreDataByKey(key) {
  return (await driver.executeAsyncScript(`chrome.storage.local.get('${key}', arguments[arguments.length - 1]);`))[key];
}

/**
 * Returns data from store.
 *
 * @param key
 * @param pass
 * @returns {Promise<void>}
 */
async function getEncryptedStoreDataByKey(key, pass) {
  const encrypted = (await driver.executeAsyncScript(`chrome.storage.local.get('${key}', arguments[arguments.length - 1]);`))[key];
  let decrypted;
  if (encrypted) {
    decrypted = CryptoJS.AES.decrypt(encrypted, pass)
      .toString(CryptoJS.enc.Utf8);
  } else {
    decrypted = encrypted;
  }
  return decrypted;
}

/**
 * Saves data to store.
 *
 * @param key
 * @param data
 * @param pass
 * @returns {Promise<void>}
 */
async function setEncryptedStoreDataByKey(key, data, pass) {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), pass)
    .toString();
  const dataObject = {};
  dataObject[key] = encrypted;
  const dataString = JSON.stringify(dataObject);
  const script = `chrome.storage.local.set(${dataString}, arguments[arguments.length - 1]);`;
  return driver.executeAsyncScript(script);
}

/**
 * Clears store.
 *
 * @returns {Promise}
 */
async function clearStore() {
  return driver.executeAsyncScript('chrome.storage.local.clear( arguments[arguments.length - 1]);');
}

async function getPendingTxCount() {
  const txElementArray = await driver.findElements(By.css('#tx-pending > div'));
  return txElementArray.length;
}

async function isElementDisplayed(pageId) {
  return driver.findElement(By.id(pageId))
    .isDisplayed();
}

async function isPageCreateAccount() {
  return isElementDisplayed('create-acc-page');
}

async function isPageLogin() {
  return isElementDisplayed('login-page');
}

async function isPageUser() {
  return isElementDisplayed('user-page');
}

async function isTabTransactions() {
  return isElementDisplayed('tab-tx');
}

async function isTabSettings() {
  return isElementDisplayed('tab-settings');
}

describe('create account', () => {
  beforeAll(async () => {
    ({
      driver,
      popupUri,
    } = await setupBrowser());
  });
  beforeEach(async () => {
    // open popup
    await driver.get(popupUri);
    expect(await isPageCreateAccount())
      .toBeTruthy();
  });
  afterEach(async () => {
    await clearStore();
  });
  afterAll(async () => {
    await driver.quit();
  });

  test('create account and login', async () => {
    expect.assertions(4);

    // input password for new account
    await driver.findElement(By.id('password-new'))
      .sendKeys(password);
    await driver.findElement(By.id('password-new-confirm'))
      .sendKeys(password);
    // create account button
    await driver.findElement(By.id('btn-create-acc'))
      .click();

    // check if account was created
    const decrypted = await getEncryptedStoreDataByKey(STORE_KEY_VAULT, password);
    expect(decrypted)
      .toBe('{}');

    expect(await isPageUser())
      .toBeTruthy();
    // default tab is tx tab
    expect(await isTabTransactions())
      .toBeTruthy();
  });

  test('create account with invalid password', async () => {
    expect.assertions(4);

    const invalidPassword = '';

    // input password for new account
    await driver.findElement(By.id('password-new'))
      .sendKeys(invalidPassword);
    await driver.findElement(By.id('password-new-confirm'))
      .sendKeys(invalidPassword);
    // create account button
    await driver.findElement(By.id('btn-create-acc'))
      .click();

    // check if account was created
    expect(await getStoreDataByKey(STORE_KEY_VAULT))
      .toBeUndefined();

    expect(await isPageUser())
      .toBeFalsy();
    // default tab is tx tab
    expect(await isTabTransactions())
      .toBeFalsy();
  });

  test('create account with not matching passwords', async () => {
    expect.assertions(4);

    // input password for new account
    await driver.findElement(By.id('password-new'))
      .sendKeys('asdfasdfasdf1');
    await driver.findElement(By.id('password-new-confirm'))
      .sendKeys('asdfasdfasdf2');
    // create account button
    await driver.findElement(By.id('btn-create-acc'))
      .click();

    // check if account was created
    expect(await getStoreDataByKey(STORE_KEY_VAULT))
      .toBeUndefined();

    expect(await isPageUser())
      .toBeFalsy();
    // default tab is tx tab
    expect(await isTabTransactions())
      .toBeFalsy();
  });
});

describe('log in', () => {
  beforeAll(async () => {
    ({
      driver,
      popupUri,
    } = await setupBrowser());
    // create account
    await driver.get(popupUri);
    const data = {};
    await setEncryptedStoreDataByKey(STORE_KEY_VAULT, data, password);
  });
  beforeEach(async () => {
    // open popup
    await driver.get(popupUri);
    expect(await isPageLogin())
      .toBeTruthy();
  });
  afterAll(async () => {
    await driver.quit();
  });

  test('log in with valid credentials, then logout', async () => {
    expect.assertions(5);
    /**
     * Login
     */
    // input password
    await driver.findElement(By.id('password'))
      .sendKeys(password);
    // log in button
    await driver.findElement(By.id('btn-login'))
      .click();
    expect(await isPageUser())
      .toBeTruthy();
    /**
     * Logout
     */
    // switch to settings tab
    await driver.findElement(By.xpath('//button[@value="tab-settings"]'))
      .click();
    expect(await isPageUser())
      .toBeTruthy();
    expect(await isTabSettings())
      .toBeTruthy();

    // log out button
    await driver.findElement(By.id('btn-logout'))
      .click();
    expect(await isPageLogin())
      .toBeTruthy();
  });

  test('log in with invalid credentials', async () => {
    expect.assertions(2);

    const invalidPassword = 'sdfgsdfgsdfgsdfg';
    // input password
    await driver.findElement(By.id('password'))
      .sendKeys(invalidPassword);
    // log in button
    await driver.findElement(By.id('btn-login'))
      .click();
    expect(await isPageUser())
      .not
      .toBeTruthy();
  });
});

describe('import key', () => {
  beforeAll(async () => {
    ({
      driver,
      popupUri,
    } = await setupBrowser());
    // create account
    await driver.get(popupUri);
    const data = {};
    await setEncryptedStoreDataByKey(STORE_KEY_VAULT, data, password);
    await driver.get(popupUri);
    // log in
    await driver.findElement(By.id('password'))
      .sendKeys(password);
    await driver.findElement(By.id('btn-login'))
      .click();
    await driver.findElement(By.xpath('//button[@value="tab-settings"]'))
      .click();
  });
  beforeEach(async () => {
    expect(await isPageUser())
      .toBeTruthy();
    expect(await isTabSettings())
      .toBeTruthy();
  });
  afterEach(async () => {
    await driver.findElement(By.id('imp-key-sk'))
      .clear();
    await driver.findElement(By.id('imp-key-pk'))
      .clear();
    await driver.findElement(By.id('imp-key-sg'))
      .clear();
    await driver.findElement(By.id('imp-key-password'))
      .clear();
  });
  afterAll(async () => {
    await driver.quit();
  });
  test('import valid key', async () => {
    expect.assertions(6);

    // input secret key
    await driver.findElement(By.id('imp-key-sk'))
      .sendKeys(secretKey);
    // input public key
    await driver.findElement(By.id('imp-key-pk'))
      .sendKeys(publicKey);
    // input signature
    await driver.findElement(By.id('imp-key-sg'))
      .sendKeys(signature);
    // input password
    await driver.findElement(By.id('imp-key-password'))
      .sendKeys(password);
    // import key button
    await driver.findElement(By.id('btn-imp-key'))
      .click();

    // check if form.js fields are empty - key was imported
    expect(await driver.findElement(By.id('imp-key-sk'))
      .getAttribute('value'))
      .toBe('');
    expect(await driver.findElement(By.id('imp-key-pk'))
      .getAttribute('value'))
      .toBe('');
    expect(await driver.findElement(By.id('imp-key-sg'))
      .getAttribute('value'))
      .toBe('');
    expect(await driver.findElement(By.id('imp-key-password'))
      .getAttribute('value'))
      .toBe('');
  });
  test('import key with invalid signature', async () => {
    expect.assertions(6);

    const invalidSignature = '3523C65D4296455FCD3E07055F43C71872699558DD73A94BBD16C77852155FAE'
      + '0EF46E87AB3D8F86EDAC26A65BEE7B90AFFE7E0F8C592927475A66805F128509';
    // input secret key
    await driver.findElement(By.id('imp-key-sk'))
      .sendKeys(secretKey);
    // input public key
    await driver.findElement(By.id('imp-key-pk'))
      .sendKeys(publicKey);
    // input signature
    await driver.findElement(By.id('imp-key-sg'))
      .sendKeys(invalidSignature);
    // input password
    await driver.findElement(By.id('imp-key-password'))
      .sendKeys(password);
    // import key button
    await driver.findElement(By.id('btn-imp-key'))
      .click();

    // check if form.js fields are empty - key was imported
    expect(await driver.findElement(By.id('imp-key-sk'))
      .getAttribute('value'))
      .not
      .toBe('');
    expect(await driver.findElement(By.id('imp-key-pk'))
      .getAttribute('value'))
      .not
      .toBe('');
    expect(await driver.findElement(By.id('imp-key-sg'))
      .getAttribute('value'))
      .not
      .toBe('');
    expect(await driver.findElement(By.id('imp-key-password'))
      .getAttribute('value'))
      .not
      .toBe('');
  });
});

describe('positive path test', () => {
  beforeAll(async () => {
    ({
      driver,
      popupUri,
    } = await setupBrowser());
  });
  afterAll(async () => {
    await driver.quit();
  });
  test('create account and login', async () => {
    expect.assertions(4);

    // open popup
    await driver.get(popupUri);
    expect(await isPageCreateAccount())
      .toBeTruthy();

    // input password for new account
    await driver.findElement(By.id('password-new'))
      .sendKeys(password);
    await driver.findElement(By.id('password-new-confirm'))
      .sendKeys(password);
    // create account button
    await driver.findElement(By.id('btn-create-acc'))
      .click();

    // check if account was created
    const encrypted = await getStoreDataByKey(STORE_KEY_VAULT);
    const decrypted = CryptoJS.AES.decrypt(encrypted, password)
      .toString(CryptoJS.enc.Utf8);
    expect(decrypted)
      .toBe('{}');

    expect(await isPageUser())
      .toBeTruthy();
    // default tab is tx tab
    expect(await isTabTransactions())
      .toBeTruthy();
  });

  test('import key', async () => {
    expect.assertions(6);

    // switch to settings tab
    await driver.findElement(By.xpath('//button[@value="tab-settings"]'))
      .click();
    expect(await isPageUser())
      .toBeTruthy();
    expect(await isTabSettings())
      .toBeTruthy();

    // input secret key
    await driver.findElement(By.id('imp-key-sk'))
      .sendKeys(secretKey);
    // input public key
    await driver.findElement(By.id('imp-key-pk'))
      .sendKeys(publicKey);
    // input signature
    await driver.findElement(By.id('imp-key-sg'))
      .sendKeys(signature);
    // input password
    await driver.findElement(By.id('imp-key-password'))
      .sendKeys(password);
    // import key button
    await driver.findElement(By.id('btn-imp-key'))
      .click();

    // check if form.js fields are empty - key was imported
    expect(await driver.findElement(By.id('imp-key-sk'))
      .getAttribute('value'))
      .toBe('');
    expect(await driver.findElement(By.id('imp-key-pk'))
      .getAttribute('value'))
      .toBe('');
    expect(await driver.findElement(By.id('imp-key-sg'))
      .getAttribute('value'))
      .toBe('');
    expect(await driver.findElement(By.id('imp-key-password'))
      .getAttribute('value'))
      .toBe('');
  });

  test('log out', async () => {
    expect.assertions(3);

    // switch to settings tab
    await driver.findElement(By.xpath('//button[@value="tab-settings"]'))
      .click();
    expect(await isPageUser())
      .toBeTruthy();
    expect(await isTabSettings())
      .toBeTruthy();

    // log out button
    await driver.findElement(By.id('btn-logout'))
      .click();
    expect(await isPageLogin())
      .toBeTruthy();
  });

  test('add transaction', async () => {
    expect.assertions(1);

    // open test page
    await driver.get(`file:///${__dirname}/../index.html`);
    // add transaction
    await driver.findElement(By.id('btn-add-tx'))
      .click();

    // check if there are console errors
    const consoleErrorArray = await driver.manage()
      .logs()
      .get(logging.Type.BROWSER);
    console.log(consoleErrorArray);
    const errorCount = consoleErrorArray.length;
    expect(errorCount)
      .toBe(0);
  });

  test('log in', async () => {
    expect.assertions(2);

    // open popup
    await driver.get(popupUri);
    expect(await isPageLogin())
      .toBeTruthy();

    // input password
    await driver.findElement(By.id('password'))
      .sendKeys(password);
    // log in button
    await driver.findElement(By.id('btn-login'))
      .click();
    expect(await isPageUser())
      .toBeTruthy();
  });

  test('sign transaction', async () => {
    expect.assertions(3);

    // switch to transaction tab
    await driver.findElement(By.xpath('//button[@value="tab-tx"]'))
      .click();
    expect(await isTabTransactions())
      .toBeTruthy();
    expect(await getPendingTxCount())
      .toBe(1);

    // sign button
    await driver.findElement(By.className('btn-accept'))
      .click();
    expect(await getPendingTxCount())
      .toBe(0);
  });
});
