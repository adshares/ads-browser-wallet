const {By} = require('selenium-webdriver');
const {setupBrowser} = require('./setup');

let driver, extensionId, popupUri;

beforeAll(async function () {
    const result = await setupBrowser();
    driver = result.driver;
    extensionId = result.extensionId;
    popupUri = result.popupUri;
});

describe('positive path test', () => {

    const password = 'asdf';
    const secretKey = 'FF767FC8FAF9CFA8D2C3BD193663E8B8CAC85005AD56E085FAB179B52BD88DD6';
    const publicKey = 'D69BCCF69C2D0F6CED025A05FA7F3BA687D1603AC1C8D9752209AC2BBF2C4D17';
    const signature = '7A1CA8AF3246222C2E06D2ADE525A693FD81A2683B8A8788C32B7763DF6037A5' +
        'DF3105B92FEF398AF1CDE0B92F18FE68DEF301E4BF7DB0ABC0AEA6BE24969006';

    async function isPage(pageId) {
        return await driver.findElement(By.id(pageId)).isDisplayed();
    }

    async function isPageCreateAccount() {
        return await isPage('create-acc-page');
    }

    async function isPageLogin() {
        return await isPage('login-page');
    }

    async function isPageUser() {
        return await isPage('user-page');
    }

    test('create account and login', async function () {
        expect.assertions(2);

        // open popup
        await driver.get(popupUri);
        expect(await isPageCreateAccount()).toBeTruthy();

        // input password for new account
        await driver.findElement(By.id('password-new')).sendKeys(password);
        await driver.findElement(By.id('password-new-confirm')).sendKeys(password);
        // create account button
        await driver.findElement(By.id('btn-create-acc')).click();
        expect(await isPageUser()).toBeTruthy();
    });

    test('import key', async function () {
        expect.assertions(1);

        // switch to settings tab
        await driver.findElement(By.xpath('//button[@value="tab-settings"]')).click();
        expect(await isPageUser()).toBeTruthy();

        // input secret key
        await driver.findElement(By.id('imp-key-sk')).sendKeys(secretKey);
        // input public key
        await driver.findElement(By.id('imp-key-pk')).sendKeys(publicKey);
        // input signature
        await driver.findElement(By.id('imp-key-sg')).sendKeys(signature);
        // input password
        await driver.findElement(By.id('imp-key-password')).sendKeys(password);
        // import key button
        await driver.findElement(By.id('btn-imp-key')).click();
    });

    test('log out', async function () {
        expect.assertions(2);

        // switch to settings tab
        await driver.findElement(By.xpath('//button[@value="tab-settings"]')).click();
        expect(await isPageUser()).toBeTruthy();

        // log out button
        await driver.findElement(By.id('btn-logout')).click();
        expect(await isPageLogin()).toBeTruthy();
    });

    test('add transaction', async function () {
        // open test page
        await driver.get(`file:///${__dirname}/index.html`);
        // add transaction
        await driver.findElement(By.id('btn-add-tx')).click();
    });

    test('log in', async function () {
        expect.assertions(2);

        // open popup
        await driver.get(popupUri);
        expect(await isPageLogin()).toBeTruthy();

        // input password
        await driver.findElement(By.id('password')).sendKeys(password);
        // log in button
        await driver.findElement(By.id('btn-login')).click();
        expect(await isPageUser()).toBeTruthy();
    });

    test('sign transaction', async function () {
        // switch to transaction tab
        await driver.findElement(By.xpath('//button[@value="tab-tx"]')).click();
        // sign button
        await driver.findElement(By.className('btn-accept')).click();
    });
});

afterAll(async function () {
    await driver.quit();
});

