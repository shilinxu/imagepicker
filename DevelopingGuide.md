## Setting up FireFox for developing ##

Install [FireFox](http://www.mozilla.com/en-US)

Install the following addons:
  * Console2 (enable log from "Chrome" on INFO level)
  * Extension Developer (enable Debugging Preferences)

> [Setting up an extension development environment](https://developer.mozilla.org/en/Setting_up_extension_development_environment#Development_extensions)

## Setting up Eclipse for developing ##
Install [Eclipse IDE for Java EE Developers](http://www.eclipse.org/downloads)

Install the following Eclipse pulgins:
  * xulbooster


## For development ##
  1. Configure "firefox.dir" in build.xml
  1. Configure "firefox.profile.path" in build.xml if need.
  1. Run "ant test"
### Note: ###
  1. Need restart FireFox if changed the "chrome.manifest" file
  1. Need touch "srcExtension" directory if changed the "install.rdf" file (Implemented in Ant task)

## For release ##
  1. Configure "extension.version" in build.xml
  1. Configure "em:version" in srcExtension/install.rdf.
  1. Run "ant package"