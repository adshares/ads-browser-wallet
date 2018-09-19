const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

/**
 * Path to packed extension (crx file)
 * @type {string}
 */
const EXTENSION = './dist.crx';
const WINDOW_WIDTH = 1920;
const WINDOW_HEIGHT = 1080;

function encodeBase64(file) {
    let stream = fs.readFileSync(file);
    return new Buffer(stream).toString('base64');
}

/**
 * Returns extension id.
 *
 * @param driver
 * @returns {Promise<void>}
 */
async function getExtensionId(driver) {
    // extension id is read from extensions page
    await driver.get('chrome://extensions/');
    // selector 'extensions-item:first-child' is used, because extension is first on extension list
    return await driver.executeScript(
        'return document.querySelector("extensions-manager").shadowRoot' +
        '.querySelector("extensions-view-manager extensions-item-list").shadowRoot' +
        '.querySelector("extensions-item:first-child").getAttribute("id")'
    );
}

/**
 * Creates web driver and returns extension id.
 * @returns {Promise<{driver: !ThenableWebDriver, extensionId: void, popupUri: string}>}
 */
async function setupBrowser() {
    let driver = new Builder().forBrowser('chrome')
        .setChromeOptions(
            new chrome.Options()
                .addExtensions([encodeBase64(EXTENSION)])
                // .headless() chrome does not allow to use extension in headless mode
                .windowSize({width: WINDOW_WIDTH, height: WINDOW_HEIGHT})
        )
        .build();
    let extensionId = await getExtensionId(driver);
    let popupUri = `chrome-extension://${extensionId}/popup.html`;

    return {driver, extensionId, popupUri};
}

module.exports = {setupBrowser};

