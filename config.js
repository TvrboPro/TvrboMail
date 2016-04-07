var nconf = require( 'nconf' );
var path = require('path');

nconf.env();

var defaults = {
    PROJECT_PREFIX: 'example',  // i.e. project short name

    SOURCE_FOLDER: path.join(process.cwd(), "input"),
    SOURCE_PSD: path.join(process.cwd(), "input", "template.psd"),  // CONVERTED TO THE PNG FILE BELOW
    SOURCE_IMAGE: path.join(process.cwd(), "input", "template.png"),
    TARGET_FOLDER: path.join(process.cwd(), "output"),

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
