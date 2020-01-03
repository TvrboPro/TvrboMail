TvrboMail
===

TvrboMail is a NodeJS utility that helps developing rich HTML email templates on top of [MJML](https://mjml.io/).

It provides the tools to localize templates into several languages, import and crop images, create responsive content and test the end result by sending actual emails with the current state.

For Live Reaload, you need to install the extension for your browser.

## Defining the contents
Edit the `input-contents.js` file and define your structure and contents of the email.

The available building blocks and their respective parameters are listed below:

```javascript
var Email = require('./email.js');

// We create the body of a new email

var email = new Email({
	backgroundColor: undefined,   // '#f0f0f0'
	fontSize: undefined,          // 20
	padding: {top: undefined, left: undefined, right: undefined, bottom: undefined}
});

// We start a row
// Typically, background images/colors go here

email.addRow({
	backgroundColor: null,        // '#f0f0f0', 'rgb(255, 0, 0)'
	backgroundImage: null,        // file
	backgroundCrop: {top: undefined, left: undefined, width: undefined, height: undefined, right: undefined, bottom: undefined},  // by default, no cropping
	backgroundCover: true,        // true/false => cover/contain
	align: undefined,             // center/right/left
	padding: {top: undefined, left: undefined, right: undefined, bottom: undefined},
	margin: {top: undefined, left: undefined, right: undefined, bottom: undefined}
});

// We define a column inside a row
// The generator supports up to 4 columns per row

email.addColumn({
	width: undefined,
	align: undefined,              // middle/top/bottom
	padding: {top: undefined, left: undefined, right: undefined, bottom: undefined}
});

// We start to add content
// Here we add some text
	
email.addText("The text to print goes here", {
	color: undefined,               // '#333'
	fontFamily: undefined,          // 'Sans-serif'
	fontSize: undefined,            // 17
	fontStyle: undefined,           // normal/italic/oblique
	fontWeight: undefined, 			// 300, 400, 600
	lineHeight: undefined,			// 25
	textDecoration: undefined,		// underline/overline/none
	padding: {top: undefined, left: undefined, right: undefined, bottom: undefined},
	align: undefined                // left/right/center
});

// Here we add an image
	
email.addImage("./imageFile.png", { // The file will be copied (and optionally cropped)
	href: undefined,                // URL
	imageDescription: undefined,    // text
	border: undefined, 				// CSS border definition
	width: undefined,				// 200
	align: undefined,				// center/right/left
	padding: {top: undefined, left: undefined, right: undefined, bottom: undefined},
	margin: {top: undefined, left: undefined, right: undefined, bottom: undefined},
	crop: {top: undefined, left: undefined, width: undefined, height: undefined, right: undefined, bottom: undefined},  // by default, no cropping
});

// Here we add a button
	
email.addButton("Call to action", {
	href: undefined,                // URL
	color: null,                    // '#f0f0f0'
	backgroundColor: null,          // '#444'
	borderRadius: undefined,        // 3
	fontSize: undefined,            // 17
	fontStyle: undefined,           // normal/italic/oblique
	fontWeight: undefined, 			// 300, 400, 600
	border: undefined, 				// CSS border definition
	align: undefined,               // center/right/left
	verticalAlign: undefined,       // middle/top/bottom
	textDecoration: undefined,		// underline/overline/none
	padding: {top: undefined, left: undefined, right: undefined, bottom: undefined},
});

// Here we add some raw HTML, with no transformation at all

email.addRawHTML("<p>I am testing the tool</p>");

// Here we add a divider

email.addDivider({
	color: undefined,
	borderWidth: undefined,
	borderStyle: undefined,     // solid, dashed, dotted 
	verticalSpacing: undefined, 
	horizontalSpacing: undefined,
	padding: {top: undefined, left: undefined, right: undefined, bottom: undefined}
});
```

By default, parameters are left blank if they are not specified. In the following example, an invocation with no parameters will add a button without styling:

```javascript
email.addButton("Call to action");
email.addButton("Call to action", {});
```

However, an invocation like this will add a button with a blue text:

```javascript
email.addButton("Call to action", {
	color: "blue"
});
```

All the possible parameters are listed above as a reference. 

## Main operations

If you just run `gulp`, you will see a list of available actions:

	Available actions:
	
	   $ gulp dev                          Live development on localhost:8080
	   $ gulp make                         Compile onto '/Users/jordi/git/mailer-gen/output'
	   $ gulp make --translations          Compile and generate the translation folders
	   $ gulp translate                    Use every language's strings.json to translate the HTML file
	
	   $ gulp psd                          Convert the SOURCE_PSD file into PNG
	   $ gulp psd --file <filename.psd>    Convert <filename.psd> into PNG
	   $ gulp pdf --file <filename.pdf>


### Email compilation

When you are done defining the contents, open a terminal, go to the root of your project and run:

	$ gulp make

This will generate the email in the folder `output/template`. Open it and check the contents. 

`index.html` will contain the email with format. `email.txt` will contain the raw text. By default, the button's text is not included.

### Translations

If you run `gulp make --translations`, Gulp will create a folder for each language defined in `config.LANGUAGE_LIST` (`config.js`).

Each folder constains an `index.html` file with template strings and `strings.json`. This is where you need to translate the strings. 

	WARNING: If you have changed any of the strings.json file, it will be erased!

Once you're done translating the JSON files, run `gulp translate` and the HTML file of each language folder will be translated. 

### Live development

To monitor your changes to `input-contents.js` in real time:

	$ gulp dev
	
This will open a web browser and reload the preview every time the contents change.

### Image Utilities

Often, emails are implemented after a PSD of PDF design file. TvrboMail provides the tools to convert them into a PNG file that you can import and crop, using the `addImage(config.SOURCE_IMAGE, {...})` method. 

**NOTE:** Image manipulation and conversion depends on the **ImageMagick** library. To Install it on a mac, you can use [Homebrew](http://brewformulas.org/Imagemagick)

---
`by Tvrbo`
