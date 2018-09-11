/**
 * Connection id between background and popup
 *
 * @type {string}
 */
const CONN_ID_POPUP = 'ads-popup';
/**
 * Connection id between background and proxy
 *
 * @type {string}
 */
const CONN_ID_PROXY = 'ads-proxy';
/**
 * Message id for delete account action, popup -> background
 *
 * @type {string}
 */
const MSG_DELETE_ACCOUNT = 'delete_account';
/**
 * Message id for key import action, popup -> background
 *
 * @type {string}
 */
const MSG_IMPORT_KEY_REQ = 'imp_key_req';
/**
 * Message id for key import response, background -> popup
 *
 * @type {string}
 */
const MSG_IMPORT_KEY_RES = 'imp_key_res';
/**
 * Message id for invalid format of new password, background -> popup
 *
 * @type {string}
 */
const MSG_INVALID_NEW_PASSWORD = 'invalid_new_password';
/**
 * Message id for invalid password during log in, background -> popup
 *
 * @type {string}
 */
const MSG_INVALID_PASSWORD = 'invalid_password';
/**
 * Message id for log out action, popup -> background
 *
 * @type {string}
 */
const MSG_LOG_OUT = 'log_out';
/**
 * Message id for log out action, popup -> background
 *
 * @type {string}
 */
const MSG_NEW_PASSWORD = 'new_password';
/**
 * Message id for sending password, log in action, popup -> background
 *
 * @type {string}
 */
const MSG_PASSWORD = 'password';

/**
 * Message id for refresh view action, background -> popup
 *
 * @type {string}
 */
const MSG_PAGE_SELECT = 'page_select';
/**
 * Message id for add transaction action, proxy -> background
 *
 * @type {string}
 */
const MSG_TRANSACTION_ADD = 'tx_add';
/**
 * Message id for transaction signed, background -> proxy
 *
 * @type {string}
 */
const MSG_TRANSACTION_SIGNED = 'tx_signed';
/**
 * Message id for transaction reject action, popup -> background
 *
 * @type {string}
 */
const MSG_TX_REJECT_REQ = 'tx_rej_req';
/**
 * Message id for transaction reject response, background -> popup
 *
 * @type {string}
 */
const MSG_TX_REJECT_RES = 'tx_rej_res';
/**
 * Message id for transaction sign action, popup -> background
 *
 * @type {string}
 */
const MSG_TX_SIGN_REQ = 'tx_sign_req';
/**
 * Message id for transaction sign response, background -> popup
 *
 * @type {string}
 */
const MSG_TX_SIGN_RES = 'tx_sign_res';
/**
 * Status for operation: success
 *
 * @type {string}
 */
const STATUS_SUCCESS = 'st_success';
/**
 * Status for operation: fail
 *
 * @type {string}
 */
const STATUS_FAIL = 'st_fail';
/**
 * Storage key for pending transaction
 *
 * @type {string}
 */
const STORE_KEY_TX = 'tx';
/**
 * Storage key for vault data (keys)
 *
 * @type {string}
 */
const STORE_KEY_VAULT = 'vault';

module.exports = {
    CONN_ID_POPUP,
    CONN_ID_PROXY,
    MSG_DELETE_ACCOUNT,
    MSG_IMPORT_KEY_REQ,
    MSG_IMPORT_KEY_RES,
    MSG_INVALID_NEW_PASSWORD,
    MSG_INVALID_PASSWORD,
    MSG_LOG_OUT,
    MSG_NEW_PASSWORD,
    MSG_PASSWORD,
    MSG_PAGE_SELECT,
    MSG_TRANSACTION_ADD,
    MSG_TRANSACTION_SIGNED,
    MSG_TX_REJECT_REQ,
    MSG_TX_REJECT_RES,
    MSG_TX_SIGN_REQ,
    MSG_TX_SIGN_RES,
    STATUS_SUCCESS,
    STATUS_FAIL,
    STORE_KEY_TX,
    STORE_KEY_VAULT
};