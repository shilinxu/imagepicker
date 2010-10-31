//      Common (global) variables
var EXPORTED_SYMBOLS = [ "ImagePicker" ];

const Cc = Components.classes;
const Ci = Components.interfaces;

/**
 * ImagePicker namespace.
 */
if ("undefined" == typeof (ImagePicker)) {
    ImagePicker = {
        guid: (new Date()).getTime(),
        fileProtocolHandler: Cc["@mozilla.org/network/protocol;1?name=file"].createInstance(Ci.nsIFileProtocolHandler),
        httpCacheSession :  Cc["@mozilla.org/network/cache-service;1"].getService(Ci.nsICacheService).createSession("HTTP", Ci.nsICache.STORE_ANYWHERE, true)
    };
};

/**
 * Provides the log utilities used by the ImagePicker
 *
 * @class ImagePicker.Logger
 */
ImagePicker.Logger = {
    /**
     * Object reference to nsIConsoleService
     *
     * @property consoleService
     * @private
     * @type nsIConsoleService
     */
    consoleService : Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService),

    /**
     * Log the given message to console.
     *
     * @method log
     * @param {String}
     *            msg the message to log
     */
    log : function(msg) {
        this.consoleService.logStringMessage("ImagePicker: " + msg);
    },

    /**
     * Log the given debug message to console.
     *
     * @method debug
     * @param {String}
     *            msg the message to log
     */
    debug : function(msg) {
        this.log("[DEBUG] " + msg);
    },

    /**
     * Log the given information level message to console.
     *
     * @method info
     * @param {String}
     *            msg the message to log
     */
    info : function(msg) {
        this.log("[INFO] " + msg);
    },

    /**
     * Log the given warning message to console.
     *
     * @method warn
     * @param {String}
     *            msg the message to log
     */
    warn : function(msg, e) {
        if (e != null) {
            msg = msg + ", exception = " + e;
        }
        this.log("[WARN] " + msg);
    },

    /**
     * Log the given error message to console.
     *
     * @method error
     * @param {String}
     *            msg the message to log
     */
    error : function(msg, e) {
        if (e != null) {
            msg = msg + ", exception = " + e;

            // report error
            Components.utils.reportError(e);
        }
        this.log("[ERROR] " + msg);
    }
};
