var config = require('./config.js');
require('shelljs/global');
var path = require('path');

// STRUCT

function Email(params){
	if(!params) params = {};

	this.imageCount = 0;
	this.body = { attributes: [], sections: [], translations: [] };

	if(params.backgroundColor)
		this.body.attributes.push('background-color="' + params.backgroundColor + '"');
	if(params.fontSize)
		this.body.attributes.push('font-size="' + params.fontSize + '"');

	if(isFinite(params.padding))
		this.body.attributes.push('padding="' + params.padding + '"');
	else if(params.padding) {
		if(params.padding.top !== undefined)
			this.body.attributes.push('padding-top="' + params.padding.top + '"');
		if(params.padding.bottom !== undefined)
			this.body.attributes.push('padding-bottom="' + params.padding.bottom + '"');
		if(params.padding.left !== undefined)
			this.body.attributes.push('padding-left="' + params.padding.left + '"');
		if(params.padding.right !== undefined)
			this.body.attributes.push('padding-right="' + params.padding.right + '"');
	}
}

Email.prototype.addRow = function(params){
	if(!params) params = {};
	var sect = {attributes: [], columns: []};
	var prefix = config.PROJECT_PREFIX ? (config.PROJECT_PREFIX + '-') : '';
	if(params.backgroundColor)
		sect.attributes.push('background-color="' + params.backgroundColor + '"');
	if(params.backgroundImage) {
		var imgName;
		if(params.backgroundImage.match(/.jpg$/i) || params.backgroundImage.match(/.jpeg$/i))
			imgName = prefix + "img-" + this.imageCount + ".jpg";
		else if(params.backgroundImage.match(/.gif$/i))
			imgName = prefix + "img-" + this.imageCount + ".gif";
		else
			imgName = prefix + "img-" + this.imageCount + ".png";
		this.imageCount++;

		if(params.backgroundCrop) {
			if(params.backgroundCrop.top !== undefined && params.backgroundCrop.left !== undefined &&
			( (params.backgroundCrop.width !== undefined && params.backgroundCrop.height !== undefined) ||
			  (params.backgroundCrop.right !== undefined && params.backgroundCrop.bottom !== undefined) ) )
			{
				cropImage(path.resolve(params.backgroundImage), config.TARGET_FOLDER + '/template/' + imgName, params.backgroundCrop);
			}
			else {
				console.error("Warning: Not all the fields of 'backgroundCrop' are defined. Copying the whole image.");
				copyImage(path.resolve(params.backgroundImage), config.TARGET_FOLDER + '/template/' + imgName);
			}
		}
		else {
			copyImage(path.resolve(params.backgroundImage), config.TARGET_FOLDER + '/template/' + imgName);
		}

		sect.attributes.push('background-url="' + imgName + '"');

		if(params.backgroundCover)
			sect.attributes.push('background-size="cover"');
	}
	if(params.align) { // center/right/left
		if(['center', 'left', 'right'].indexOf(params.align) == -1) throw new Error("The 'align' parameter of a row must be 'center', 'left' or 'right'");
		sect.attributes.push('align="' + params.align + '"');
	}

	if(isFinite(params.padding))
		sect.attributes.push('padding="' + params.padding + '"');
	else if(params.padding) {
		if(params.padding.top !== undefined)
			sect.attributes.push('padding-top="' + params.padding.top + '"');
		if(params.padding.bottom !== undefined)
			sect.attributes.push('padding-bottom="' + params.padding.bottom + '"');
		if(params.padding.left !== undefined)
			sect.attributes.push('padding-left="' + params.padding.left + '"');
		if(params.padding.right !== undefined)
			sect.attributes.push('padding-right="' + params.padding.right + '"');
	}

	if(isFinite(params.margin))
		sect.attributes.push('margin="' + params.margin + '"');
	else if(params.margin) {
		if(params.margin.top !== undefined)
			sect.attributes.push('margin-top="' + params.margin.top + '"');
		if(params.margin.bottom !== undefined)
			sect.attributes.push('margin-bottom="' + params.margin.bottom + '"');
		if(params.margin.left !== undefined)
			sect.attributes.push('margin-left="' + params.margin.left + '"');
		if(params.margin.right !== undefined)
			sect.attributes.push('margin-right="' + params.margin.right + '"');
	}

	this.body.sections.push(sect);
};

Email.prototype.addColumn = function(params){
	if(!params) params = {};
	if(!this.body.sections.length) throw new Error("No row to add the column to");
	if(this.body.sections[this.body.sections.length-1].columns.length >= 4) throw new Error("Only 4 columns are allowed per row");

	var col = {attributes: [], children: []};
	if(params.width)
		col.attributes.push('width="' + params.width + '"');
	if(params.align) {
		if(['middle', 'top', 'bottom'].indexOf(params.align) == -1) throw new Error("The 'align' parameter of a column must be 'top', 'middle' or 'bottom'");
		col.attributes.push('vertical-align="' + params.align + '"');
	}

	if(isFinite(params.padding))
		col.attributes.push('padding="' + params.padding + '"');
	else if(params.padding) {
		if(params.padding.top !== undefined)
			col.attributes.push('padding-top="' + params.padding.top + '"');
		if(params.padding.bottom !== undefined)
			col.attributes.push('padding-bottom="' + params.padding.bottom + '"');
		if(params.padding.left !== undefined)
			col.attributes.push('padding-left="' + params.padding.left + '"');
		if(params.padding.right !== undefined)
			col.attributes.push('padding-right="' + params.padding.right + '"');
	}

	this.body.sections[this.body.sections.length-1].columns.push(col);
};

Email.prototype.addRawHTML = function(html){
	if(!html) throw new Error("No html to add");
	if(!this.body.sections.length) throw new Error("No row to add the html into");
	if(!this.body.sections[this.body.sections.length-1].columns.length) throw new Error("No column to add the html into");

	var node = {type: 'html', html: 'EMAIL_TRANSLATION_TOKEN_' + this.body.translations.length};
	this.body.translations.push({
		token: node.html,
		original: html,
		translated: html
	});
	this.body.sections[this.body.sections.length-1].columns[ this.body.sections[this.body.sections.length-1].columns.length-1 ].children.push(node);
};

Email.prototype.addText = function(text, params){
	if(!params) params = {};
	if(!text) throw new Error("No text to add");
	if(!this.body.sections.length) throw new Error("No row to add the text to");
	if(!this.body.sections[this.body.sections.length-1].columns.length) throw new Error("No column to add the text to");

	var txt = {type: 'text', text: 'EMAIL_TRANSLATION_TOKEN_' + this.body.translations.length, attributes: []};
	this.body.translations.push({
		token: txt.text,
		original: text,
		translated: text
	});
	if(params.href)
		txt.text = '<a href="' + params.href + '" style="text-decoration: none; color: ' + (params.color || '#333') +';">' + txt.text + '</a>';

	if(params.color)
		txt.attributes.push('color="' + params.color + '"');
	if(params.align) {
		if(['center', 'left', 'right'].indexOf(params.align) == -1) throw new Error("The 'align' parameter of a text must be 'center', 'left' or 'right'");
		txt.attributes.push('align="' + params.align + '"');
	}

	if(params.fontFamily)
		txt.attributes.push('font-family="' + params.fontFamily + '"');
	if(params.fontSize)
		txt.attributes.push('font-size="' + params.fontSize + '"');
	if(params.fontStyle)
		txt.attributes.push('font-style="' + params.fontStyle + '"');
	if(params.fontWeight)
		txt.attributes.push('font-weight="' + params.fontWeight + '"');
	if(params.lineHeight)
		txt.attributes.push('line-height="' + params.lineHeight + '"');
	if(params.textDecoration)
		txt.attributes.push('text-decoration="' + params.textDecoration + '"');

	if(isFinite(params.padding))
		txt.attributes.push('padding="' + params.padding + '"');
	else if(params.padding) {
		if(params.padding.top !== undefined)
			txt.attributes.push('padding-top="' + params.padding.top + '"');
		if(params.padding.bottom !== undefined)
			txt.attributes.push('padding-bottom="' + params.padding.bottom + '"');
		if(params.padding.left !== undefined)
			txt.attributes.push('padding-left="' + params.padding.left + '"');
		if(params.padding.right !== undefined)
			txt.attributes.push('padding-right="' + params.padding.right + '"');
	}

	this.body.sections[this.body.sections.length-1].columns[ this.body.sections[this.body.sections.length-1].columns.length-1 ].children.push(txt);
};

Email.prototype.addImage = function(src, params){
	if(!params) params = {};
	if(!src) throw new Error("No source image to add");
	if(!this.body.sections.length) throw new Error("No row to add the image to");
	if(!this.body.sections[this.body.sections.length-1].columns.length) throw new Error("No column to add the image to");

	var img = {type: 'image', attributes: []};
	var prefix = config.PROJECT_PREFIX ? (config.PROJECT_PREFIX + '-') : '';
	var imgName;
	if(src.match(/.jpg$/i) || src.match(/.jpeg$/i))
		imgName = prefix + "img-" + this.imageCount + ".jpg";
	else if(src.match(/.gif$/i)) {
		imgName = prefix + "img-" + this.imageCount + ".gif";
	}
	else
		imgName = prefix + "img-" + this.imageCount + ".png";
	this.imageCount++;

	if(params.crop) {
		if(params.crop.top !== undefined && params.crop.left !== undefined &&
			( (params.crop.width !== undefined && params.crop.height !== undefined) ||
			  (params.crop.right !== undefined && params.crop.bottom !== undefined) ) )
		{
			cropImage(src, config.TARGET_FOLDER + '/template/' + imgName, params.crop);
		}
		else {
			console.error("Warning: Not all the fields of 'crop' are defined");
			copyImage(src, config.TARGET_FOLDER + '/template/' + imgName);
		}
	}
	else {
		copyImage(src, config.TARGET_FOLDER + '/template/' + imgName);
	}
	img.attributes.push('src="' + imgName + '"');

	if(params.href)
		img.attributes.push('href="' + params.href + '"');
	if(params.align) {
		if(['center', 'left', 'right'].indexOf(params.align) == -1) throw new Error("The 'align' parameter of an image must be 'center', 'left' or 'right'");
		img.attributes.push('align="' + params.align + '"');
	}

	if(params.width)
		img.attributes.push('width="' + params.width + '"');
	if(params.border)
		img.attributes.push('border="' + params.border + '"');
	if(params.imageDescription) {
		img.attributes.push('alt="' + 'EMAIL_TRANSLATION_TOKEN_' + this.body.translations.length + '"');
		this.body.translations.push({
			token: 'EMAIL_TRANSLATION_TOKEN_' + this.body.translations.length,
			original: params.imageDescription,
			translated: params.imageDescription
		});
	}

	if(isFinite(params.padding))
		img.attributes.push('padding="' + params.padding + '"');
	else if(params.padding) {
		if(params.padding.top !== undefined)
			img.attributes.push('padding-top="' + params.padding.top + '"');
		if(params.padding.bottom !== undefined)
			img.attributes.push('padding-bottom="' + params.padding.bottom + '"');
		if(params.padding.left !== undefined)
			img.attributes.push('padding-left="' + params.padding.left + '"');
		if(params.padding.right !== undefined)
			img.attributes.push('padding-right="' + params.padding.right + '"');
	}

	if(isFinite(params.margin))
		img.attributes.push('margin="' + params.margin + '"');
	else if(params.margin) {
		if(params.margin.top !== undefined)
			img.attributes.push('margin-top="' + params.margin.top + '"');
		if(params.margin.bottom !== undefined)
			img.attributes.push('margin-bottom="' + params.margin.bottom + '"');
		if(params.margin.left !== undefined)
			img.attributes.push('margin-left="' + params.margin.left + '"');
		if(params.margin.right !== undefined)
			img.attributes.push('margin-right="' + params.margin.right + '"');
	}

	this.body.sections[this.body.sections.length-1].columns[ this.body.sections[this.body.sections.length-1].columns.length-1 ].children.push(img);
};

Email.prototype.addButton = function(text, params){
	if(!params) params = {};
	if(!text) throw new Error("No text for the button");
	if(!this.body.sections.length) throw new Error("No row to add the button to");
	if(!this.body.sections[this.body.sections.length-1].columns.length) throw new Error("No column to add the button to");

	var btn = {type: 'button', text: 'EMAIL_TRANSLATION_TOKEN_' + this.body.translations.length, attributes: []};
	this.body.translations.push({
		token: btn.text,
		original: text,
		translated: text
	});
	if(params.fontFamily)
		btn.text = "<span style='font-family: " + params.fontFamily + " !important;'>" + btn.text + "</span>";

	if(params.href)
		btn.attributes.push('href="' + params.href + '"');
	if(params.color)
		btn.attributes.push('color="' + params.color + '"');
	if(params.backgroundColor)
		btn.attributes.push('background-color="' + params.backgroundColor + '"');
	if(params.align) {
		if(['center', 'left', 'right'].indexOf(params.align) == -1) throw new Error("The 'align' parameter of a button must be 'center', 'left' or 'right'");
		btn.attributes.push('align="' + params.align + '"');
	}
	if(params.verticalAlign) {
		if(['middle', 'top', 'bottom'].indexOf(params.align) == -1) throw new Error("The 'verticalAlign' parameter of a button must be 'top', 'middle' or 'bottom'");
		btn.attributes.push('vertical-align="' + params.verticalAlign + '"');
	}

	if(params.border)
		btn.attributes.push('border="' + params.border + '"');
	if(params.borderRadius)
		btn.attributes.push('border-radius="' + params.borderRadius + '"');

	if(params.fontSize)
		btn.attributes.push('font-size="' + params.fontSize + '"');
	if(params.fontStyle)
		btn.attributes.push('font-style="' + params.fontStyle + '"');
	if(params.fontWeight)
		btn.attributes.push('font-weight="' + params.fontWeight + '"');
	if(params.textDecoration)
		btn.attributes.push('text-decoration="' + params.textDecoration + '"');

	if(isFinite(params.padding))
		btn.attributes.push('padding="' + params.padding + '"');
	else if(params.padding) {
		if(params.padding.top !== undefined)
			btn.attributes.push('padding-top="' + params.padding.top + '"');
		if(params.padding.bottom !== undefined)
			btn.attributes.push('padding-bottom="' + params.padding.bottom + '"');
		if(params.padding.left !== undefined)
			btn.attributes.push('padding-left="' + params.padding.left + '"');
		if(params.padding.right !== undefined)
			btn.attributes.push('padding-right="' + params.padding.right + '"');
	}

	this.body.sections[this.body.sections.length-1].columns[ this.body.sections[this.body.sections.length-1].columns.length-1 ].children.push(btn);
};


Email.prototype.addDivider = function(params){
	if(!params) params = {};
	if(!this.body.sections.length) throw new Error("No row to add the divider to");
	if(!this.body.sections[this.body.sections.length-1].columns.length) throw new Error("No column to add the divider to");

	var div = {type: 'divider', attributes: []};

	if(params.color)
		div.attributes.push('border-color="' + params.color + '"');
	if(params.borderWidth)
		div.attributes.push('border-width="' + params.borderWidth + '"');
	if(params.borderStyle) {
		if(['solid', 'dashed', 'dotted'].indexOf(params.borderStyle) == -1) throw new Error("The 'borderStyle' parameter of a divider must be 'solid', 'dashed' or 'dotted'");
		div.attributes.push('border-style="' + params.borderStyle + '"');
	}
	if(params.verticalSpacing)
		div.attributes.push('vertical-spacing="' + params.verticalSpacing + '"');
	if(params.horizontalSpacing)
		div.attributes.push('horizontal-spacing="' + params.horizontalSpacing + '"');

	if(isFinite(params.padding))
		div.attributes.push('padding="' + params.padding + '"');
	else if(params.padding) {
		if(params.padding.top !== undefined)
			div.attributes.push('padding-top="' + params.padding.top + '"');
		if(params.padding.bottom !== undefined)
			div.attributes.push('padding-bottom="' + params.padding.bottom + '"');
		if(params.padding.left !== undefined)
			div.attributes.push('padding-left="' + params.padding.left + '"');
		if(params.padding.right !== undefined)
			div.attributes.push('padding-right="' + params.padding.right + '"');
	}
	this.body.sections[this.body.sections.length-1].columns[ this.body.sections[this.body.sections.length-1].columns.length-1 ].children.push(div);
};

// GENERATION

Email.prototype.compileHTML = function(){
	if(!this.body || !this.body.sections) return "";
	return "<mj-body " + this.body.attributes.join(' ') + ">\n" + compileRows(this.body.sections) + "\n</mj-body>";
};

function compileRows(rows){
	if(!rows) return "";
	return rows.map(function(row){
		return "\t<mj-section " + row.attributes.join(' ') + ">\n" + compileColumns(row.columns) + "\n\t</mj-section>";
	}).join("\n");
}

function compileColumns(columns){
	if(!columns) return "";
	return columns.map(function(col){
		return "\t\t<mj-column " + col.attributes.join(' ') + ">\n" + compileChildren(col.children) + "\n\t\t</mj-column>";
	}).join("\n");
}

function compileChildren(nodes){
	if(!nodes) return "";
	return nodes.map(function(node){
		if(node.type == "text") return compileTextNode(node);
		else if(node.type == "image") return compileImageNode(node);
		else if(node.type == "button") return compileButtonNode(node);
		else if(node.type == "divider") return compileDividerNode(node);
		else if(node.type == "html") return node.html;
		else return "";
	}).join("\n");
}

function compileTextNode(text){
	if(!text) return "";
	return "\t\t\t<mj-text " + text.attributes.join(' ') + ">" + text.text + "\n\t\t\t</mj-text>\n";
}

function compileImageNode(image){
	if(!image) return "";
	return "\t\t\t<mj-image " + image.attributes.join(' ') + "/>\n";
}

function compileButtonNode(button){
	if(!button) return "";
	return "\t\t\t<mj-button " + button.attributes.join(' ') + ">" + button.text + "\n\t\t\t</mj-button>";
}

function compileDividerNode(divider){
	if(!divider) return "";
	return "\t\t\t<mj-divider " + divider.attributes.join(' ') + "></mj-divider>";
}

// TRANSLATIONS

Email.prototype.getTranslationTemplate = function(){
	return this.body.translations;
};

// TEXT

Email.prototype.compileText = function(){
	return this.body.sections.map(function(section){
		return section.columns.map(function(column){
			return column.children.map(function(node){
				if(node.type == 'text') return node.text;
				else if(node.type == 'button' && config.INCLUDE_BUTTON_TEXT) return node.text;
				else return node.imageDescription || "";
			}).join("\n");
		}).join('\n');
	}).join("\n").replace(/\n+/g, "\n");
};

function cropImage(src, dest, params) {
	// convert -crop 500x5000+0+0 src.png cropped.png

	if(!params || params.top === undefined || params.left === undefined) throw new Error("Invalid params for cropImage");
	if(!src || !dest) throw new Error("Invalid params for cropImage");

	if(params.bottom !== undefined && params.right !== undefined) {
		exec('convert -crop ' + (params.right-params.left) + 'x' + (params.bottom-params.top) + '+' + params.left + '+' + params.top + ' ' + src + ' ' + dest, function(status, output) {
		  if(config.VERBOSE) console.log("Converted", dest);
		});
	}
	else if(params.height !== undefined && params.width !== undefined) {
		exec('convert -crop ' + params.width + 'x' + params.height + '+' + params.left + '+' + params.top + ' ' + src + ' ' + dest, function(status, output) {
		  if(config.VERBOSE) console.log("Converted", dest);
		});
	}
	else
		throw new Error("Invalid params for cropImage");
}

function copyImage(src, dest) {
	// convert src.png cropped.png
	if(!src || !dest) throw new Error("Invalid params for copyImage");

	// exec('convert +profile "*" ' + src + ' ' + dest, function(status, output) {
	exec('convert -strip ' + src + ' ' + dest, function(status, output) {
	  if(config.VERBOSE) console.log("Copied", dest);
	});
}


// INIT

module.exports = Email;
