var nconf = require( 'nconf' );
var path = require('path');

nconf.env();

var defaults = {
    PROJECT_PREFIX: 'project',  // i.e. project short name
    EMAIL_USER: 'your.account@gmail.com',
    EMAIL_PASSWORD: '__YOUR_PASSWORD_HERE__',

    SOURCE_FOLDER: path.join(__dirname, "input"),
    SOURCE_PSD: path.join(__dirname, "input", "template.psd"),  // CONVERTED TO THE PNG FILE BELOW
    SOURCE_IMAGE: path.join(__dirname, "input", "template.png"),
    TARGET_FOLDER: path.join(__dirname, "output"),

    // Images that are not added via addImage(...) can be declared here
    // so they will be copied to the output folder right away
    EXTRA_IMAGE_PATHS: [],

    // Translations
    LANGUAGE_LIST: ['en', 'fr', 'es', 'it', 'de', 'ca'],
    ORIGINAL_LANGUAGE: 'en',

    VERBOSE: false,
    DISPLAY_TEMPLATE: false,
	  INCLUDE_BUTTON_TEXT: false     // Include button's text in the raw text email
};

nconf.defaults(defaults);

for(var k in defaults) {
    if(defaults.hasOwnProperty(k)) {
        exports[k] = nconf.get(k);
    }
}
