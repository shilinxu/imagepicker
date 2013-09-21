/** **************** DownloadSession Class ******************** */
var EXPORTED_SYMBOLS = [];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://imagepicker/common.js");
Cu.import("resource://imagepicker/sequence.js");
Cu.import("resource://imagepicker/settings.js");
Cu.import("resource://imagepicker/fileUtils.js");
Cu.import("resource://gre/modules/PopupNotifications.jsm");

/**
 * DownloadSession class is used to download multiple files
 *
 * @namespace ImagePicker
 * @class ImagePicker.DownloadSession
 * @constructor
 */
ImagePicker.DownloadSession = function(images, destDir, destFile, privacyInfo, oldDownloadProgressListener,
        newDownloadProgressListener, postSavedListeners, stringsBundle, batchMode) {

    this.images = images;
    this.destDir = destDir;
    this.destFile = destFile;
    this.privacyContext = privacyInfo.privacyContext;
    this.inPrivateBrowsingMode = privacyInfo.inPrivateBrowsing;

    this.oldDownloadProgressListener = oldDownloadProgressListener;
    this.newDownloadProgressListener = newDownloadProgressListener;
    this.postSavedListeners = postSavedListeners;
    this.stringsBundle = stringsBundle;



    this.ioService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
    this.mimeService = Cc["@mozilla.org/mime;1"].getService(Ci.nsIMIMEService);
    this.downloadManager = Cc["@mozilla.org/download-manager;1"].getService(Ci.nsIDownloadManager);

    //For Win7, Firefox have a bug https://bugzilla.mozilla.org/show_bug.cgi?id=844566
    //The nsITaskbarProgress.setProgressState() throw error when add multiple download items, so skip DownloadManager for win7
    if(ImagePicker.Settings.hasWinTaskbar()){
        this.downloadManager = null;
    }

    this.batchMode = batchMode;

    ImagePicker.Logger.info("Created DownloadSession[images=" + this.images.length + ", destDir=" + this.destDir.path
            + ", inPrivateBrowsingMode=" + this.inPrivateBrowsingMode + ", downloadManager=" + this.downloadManager + "]");
};

ImagePicker.DownloadSession.prototype = {

    /**
     * save images to local
     *
     * @method saveImages
     */
    saveImages : function() {

        var images = this.images;

        // Auto rename
        if (ImagePicker.Settings.isRenamingEnabled() && this.batchMode) {
            this._renameByMasks(images);
        }

        // Register progress listener
        if(this.downloadManager){
            if (this.oldDownloadProgressListener != null) {
                this.downloadManager.removeListener(this.oldDownloadProgressListener);
            }
            if (this.newDownloadProgressListener != null) {
                this.downloadManager.addListener(this.newDownloadProgressListener);
            }
        }

        this._preSaveImages(this.destDir, images, this.stringsBundle);

        // Handle each file
        var fileNames = new Array();
        for (var i = 0; i < images.length; i++) {
            var img = images[i];
            var fileNameExt = img.fileName + "." + (img.fileExt == null ? "jpg" : img.fileExt);
            var file = this.destFile;
            if(!file){
               file = ImagePicker.FileUtils.createUniqueFile(fileNameExt, this.destDir, fileNames);
            }
            try {
                this._saveImageToFile(img.url, file, this.downloadManager);
            } catch (ex) {
                ImagePicker.Logger.error("Cannot save image: " + img, ex);
            }
        }
        this._postSaveImages(this.destDir, images, this.postSavedListeners, this.stringsBundle);
    },

    _preSaveImages : function(savedFolder, images, stringsBundle) {
    },

    _postSaveImages : function(savedFolder, images, postSavedListeners, stringsBundle) {

        if (postSavedListeners) {
            postSavedListeners.forEach(function(listener) {
                ImagePicker.Logger.debug("Invoke PostSavedListener: " + listener);
                if (listener) {
                    try {
                        listener.afterSavedImages(savedFolder, images);
                    } catch (ex) {
                        ImagePicker.Logger.error("Occured Error " + ex + " when execute PostSaveImage Listener: "
                                + listener);
                    }
                }
            });
        }
    },

    _renameByMasks : function(images) {
        var masks = ImagePicker.Settings.getRenamingMask();
        ImagePicker.Logger.debug("Renaming masks: " + masks + ", images.length = " + images.length);
        if(masks == null || masks == ""){
            return;
        }

        var needRenameBySeq = /<seq_num>/.test(masks);
        var needRenameByDate = /<date>/.test(masks);
        var needRenameByDatetime = /<datetime>/.test(masks);
        var needRenameByTabTitle = /<tab_title>/.test(masks);
        var needRenameByOriginalName = /<name>/.test(masks);

        var maxDigits = images.length.toString().length;
        var seq = new ImagePicker.Sequence(0, maxDigits);

        var date = new Date();
        var dateStr = date.getFullYear() + "-" + (date.getMonth() +1) + "-" + date.getDate();
        var datetimeStr = dateStr + " " + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();

        for ( var i = 0; i < images.length; i++) {
            var img = images[i];
            var newName = masks;
            // Replace sequence number
            if(needRenameBySeq){
                newName = newName.replace(/<seq_num>/g, seq.next());
            }
            // Replace date
            if(needRenameByDate){
               newName = newName.replace(/<date>/g, dateStr);
            }
            // Replace datetime
            if(needRenameByDatetime){
               newName = newName.replace(/<datetime>/g, datetimeStr);
            }
            // Replace tab title
            if(needRenameByTabTitle){
               newName = newName.replace(/<tab_title>/g, img.tabTitle);
            }
            // Replace original name
            if(needRenameByOriginalName){
               newName = newName.replace(/<name>/g, img.fileName);
            }

            ImagePicker.Logger.debug("Renaming from " + img.fileName  + " to: " + newName);
            img.fileName = newName;
        }
    },


    /**
     * Chunk array
     */
    _chunk : function (arr, len) {

        var chunks = [], i = 0, n = arr.length;

        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        }

        return chunks;
    },


    /**
     * save image to local
     *
     * @method _saveImageToFile
     */
    _saveImageToFile : function(fromURL, toFile, downloadManager) {

        // Create URI from which we want to download file
        var fromURI = this.ioService.newURI(fromURL, null, null);

        // create cacheKey
        var cacheKey = Cc['@mozilla.org/supports-string;1'].createInstance(Ci.nsISupportsString);
        cacheKey.data = fromURL;

        // Set to where we want to save downloaded file
        var toURI = this.ioService.newFileURI(toFile);

        // Set up correct MIME type
        var mime;
        try {
            var type = this.mimeService.getTypeFromURI(fromURI);
            mime = this.mimeService.getFromTypeAndExtension(type, "");
        } catch (e) {
            ImagePicker.Logger.info("cannot get mine type, e = " + e);
        }

        // Observer for download
        var nsIWBP = Ci.nsIWebBrowserPersist;
        var persist = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(nsIWBP);
        persist.persistFlags = nsIWBP.PERSIST_FLAGS_REPLACE_EXISTING_FILES | nsIWBP.PERSIST_FLAGS_FROM_CACHE
                | nsIWBP.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;

        // Start download
        if (downloadManager) {
            var dl = downloadManager.addDownload(downloadManager.DOWNLOAD_TYPE_DOWNLOAD, fromURI, toURI,
                    toFile.leafName, mime, Math.round(Date.now() * 1000), null, persist, this.inPrivateBrowsingMode);
            persist.progressListener = dl.QueryInterface(Ci.nsIWebProgressListener);
            // persist.progressListener = dl;
        } else {
            persist.progressListener = this.newDownloadProgressListener;
        }

        persist.saveURI(fromURI, cacheKey, null, null, null, toURI, this.privacyContext);
    }
};
