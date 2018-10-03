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

// Tests initialization
beforeAll(async () => {
  const result = await setupBrowser();
  ({
    driver,
    popupUri,
  } = result);
});

describe('positive path test', () => {
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

    // check if form fields are empty - key was imported
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
    await driver.get(`file:///${__dirname}/index.html`);
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

afterAll(async () => {
  await driver.quit();
});
