ImagePicker integrates with Firefox to pick images while you browse.

This extension will be useful to users who want to choose (filter) images and save images from web page to local disk.

  * Download images from the cache first.
  * Batch/Bulk download
  * Easily choose (filter) images by width ,height, size and type.
  * Image thumbnails view
  * Auto detect image name and size.
  * Auto create sub folder from page title.
  * Auto rename by sequence (based on the appeared order of image).
  * Select images by mouse.
  * Pick images from current tab, all tabs, left/right tabs and some tabs by keywords.
  * Save image by double click image when browsing.
  * Save image by drag image when browsing.


http://imagepicker.googlecode.com/svn//wiki/img/ImagePicker-EN.PNG

NOTE： The latest source code are in https://github.com/wesley-chen/imagepicker/tree/1.x now.

### v1.8 ###
  * Support rename image by marks
  * Add options for the location when saving single image.
    1. Save to configured folder
    1. Always ask when saving.
    1. Ask when saving the first image in new tab.
  * Add option to show subfolder in ImagePicker dialog. When removing some texts from the subfolder textbox, these texts will be collected and removed automatically on the next time.
  * Add option for using Firefox build-in notification (Display in center)
  * Filter '0px width and 0px height' image.

### v1.6.3 ###

  * Support Firefox v22 and v23.

### v1.6.2 ###
  * Fixed notification error on Mac OS X when Growl is not available.
  * Use small size images for option dialog.
  * Detect file extension for sina blog.
  * Control "doubleclick to save image" and "drag to save image" settings in toolbar and context menu.

### v1.6 ###
  * Support customize ImagePicker buttons on toolbar and context menu.
  * Added "save image by double click" feature.
  * Added "save image by drag image" feature.

### v1.3 ###

  * Support Firefox v18.

### v1.2 ###

  * Added "Close tabs after saved images" feature.
  * Added "Pick images form right/left tabs" feature.
  * Added flat toolbar buttons for "Pick images from current tab", "Pick images from all tabs", and "Pick images from left/right tabs" features.
  * Enhanced context menu to support "Pick images from current tab", "Pick images from all tabs", and "Pick images from left/right tabs" features.
  * Show and save images by the appeared order (the absolute position to top).
  * Fixed subfolder order problem. Now ImagePiker sort subfolder by its last modified time.

### v1.0.0 ###
  * Support pick images from current tab, all tabs and some tabs by keywords.
  * Support "saved directory" history.
  * New option: "Show folder name confirmation popup".
  * Support zh\_TW, zh\_HK, zh\_MO locales.

### v0.9.7 ###
  * Fixed the "save" button is not display when the width of ImagePicker UI is too small.
  * Updated CSS for image shadow and highlight.
### v0.9.6 ###

  * Add "Select All", "Unselect All" and "Select similar" features (in context menu).
  * Add "Select by click thumbnail" feature.
  * Add two buttons to open "option" dialog and "about" dialog.
  * Add "Show All" button
  * Support "Close Image Picker dialog after saved"
  * Support "Custom remove text from title"
  * Support "Auto rename image by sequence number"
  * Refactor ImagePicker preferences and "option" dialog

### v0.9.2 ###

  * Create saved directory automatically if the user chooses a nonexistent directory to save.
  * Use the MIME service to detect image's file extension.
  * Fixed: Cannot create directory by title when saving images from Discuz forum.


### v0.9 ###

  * Localized plugin for English and Chinese
  * Tweak UI for Linux
  * Add option dialog for setting
  * Support Firefox v4.0
  * Fixed: Remove Ajax call for security
  * Fixed: Disable debug log after release
  * Fixed: Saving image problem from google.com


### v0.8.2 ###
  * Supported select images by mouse.
  * Updated addon icon.
  * Improved compatibility ("loose" variables and functions are wrapped within a JavaScript object).