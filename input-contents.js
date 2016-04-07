var Email = require('./email.js');
var config = require('./config.js');

// DEFINITION

// sRGB

var sansSerifFont = "Helvetica, Arial, sans-serif";
var serifFont = "Georgia, serif, Times";
// var templateWidth = 600;
// var scaleRatio = 600 / templateWidth;

var mail = new Email({padding: 0});
exports.email = mail;

/////////////////////

mail.addRow({
	padding: {top: 0, left: 0, right: 0}
});
mail.addColumn({
	padding: {top: 0, left: 0, right: 0}
});
mail.addImage(config.SOURCE_IMAGE, {  // you can use any image
	padding: {top: 0, left: 0, right: 0},
	crop: {top: 0, left: 0, right: 600, bottom: 100},
	imageDescription: "Tvrbo Mail image alternate text"
});

/////////////////////

mail.addRow({
	align: 'center',
	padding: {top: 0, bottom: 7}
});
mail.addColumn();
mail.addText("Main title", {
	align: 'center',
	padding: {top: 0, bottom: 7},
	fontWeight: 'bold',
	fontSize: '17'
});

/////////////////////

mail.addRow({
	align: 'center',
	padding: {top: 10, bottom: 0}
});
mail.addColumn();
mail.addImage(config.SOURCE_IMAGE, {
	href: 'http://website.io/',
	padding: {top: 10, bottom: 15},
	crop: {top: 80, left: 50, right: 285, bottom: 300},
	imageDescription: "Tvrbo Mail image alternate text"
});

mail.addColumn();
mail.addImage(config.SOURCE_IMAGE, {
	href: 'http://website.io/',
	padding: {top: 10, bottom: 15},
	crop: {top: 80, left: 313, right: 549, bottom: 300},
	imageDescription: "Tvrbo Mail image alternate text"
});

/////////////////////

mail.addRow({
	padding: {top: 0, bottom: 0}
});
mail.addColumn();
mail.addDivider({ borderWidth: '2px' });

/////////////////////

mail.addRow({
	align: 'center',
	padding: {top: 0}
});
mail.addColumn();
mail.addText("Second title", {
	align: 'center',
	padding: {top: 0},
	fontWeight: 'bold',
	fontFamily: sansSerifFont,
	fontSize: '17'
});

/////////////////////

mail.addRow({
	align: 'center',
	padding: {top: 0}
});
mail.addColumn();
mail.addImage(config.SOURCE_IMAGE, {
	// href: 'http://website.io/',
	padding: {top: 0},
	crop: {top: 300, left: 77, right: 522, bottom: 500},
	imageDescription: "Tvrbo Mail image alternate text"
});

/////////////////////

// mail.addRow();
// mail.addColumn();
// mail.addDivider({ borderWidth: '2px' });

/////////////////////

mail.addRow({
	align: 'center',
	padding: {top: 0}
});
mail.addColumn();
mail.addText("Featured content", {
	align: 'center',
	padding: {top: 0},
	fontWeight: 'bold',
	fontFamily: sansSerifFont,
	fontSize: '17'
});

/////////////////////

mail.addRow({
	align: 'center',
	padding: {top: 0, bottom: 0}
});
mail.addColumn({
	align: 'top'
});
mail.addImage(config.SOURCE_IMAGE, {
	href: 'http://website.io/',
	padding: {top: 0, bottom: 0},
	crop: {top: 50, left: 96, right: 265, bottom: 312},
	imageDescription: "Tvrbo Mail image alternate text"
});
mail.addText("<a href=\"http://website.io/\" style=\"text-decoration: none; color: black;\">Product #1 <br><span style=\"font-family: " + sansSerifFont + "; font-weight: bold;\">15,95€</span></a>", {
	align: 'center',
	padding: {bottom: 20},
	fontSize: '16',
	fontFamily: serifFont
});

mail.addColumn({
	align: 'top'
});
mail.addImage(config.SOURCE_IMAGE, {
	href: 'http://website.io/',
	padding: {top: 0, bottom: 0},
	crop: {top: 50, left: 335, right: 504, bottom: 312},
	imageDescription: "Tvrbo Mail image alternate text"
});
mail.addText("<a href=\"http://website.io/\" style=\"text-decoration: none; color: black;\">Product #2 <br><span style=\"font-family: " + sansSerifFont + "; font-weight: bold;\">15,95€</span></a>", {
	align: 'center',
	padding: {bottom: 20},
	fontSize: '16',
	fontFamily: serifFont
});

/////////////////////

mail.addRow({
	align: 'center',
	padding: {top: 0, bottom: 0}
});
mail.addColumn();
mail.addImage(config.SOURCE_IMAGE, {
	href: 'http://website.io/',
	padding: {top: 10},
	crop: {top: 50, left: 335, right: 504, bottom: 312},
	imageDescription: "Tvrbo Mail image alternate text"
});
mail.addText("<a href=\"http://website.io/\" style=\"text-decoration: none; color: black;\">Product #3 <br><span style=\"font-family: " + sansSerifFont + "; font-weight: bold;\">15,95€</span></a>", {
	align: 'center',
	padding: {bottom: 20},
	fontSize: '16',
	fontFamily: serifFont
});


mail.addColumn();
mail.addImage(config.SOURCE_IMAGE, {
	href: 'http://website.io/',
	padding: {top: 10},
	crop: {top: 50, left: 335, right: 504, bottom: 312},
	imageDescription: "Tvrbo Mail image alternate text"
});
mail.addText("<a href=\"http://website.io/\" style=\"text-decoration: none; color: black;\">Product #4 <br><span style=\"font-family: " + sansSerifFont + "; font-weight: bold;\">15,95€</span></a>", {
	align: 'center',
	padding: {bottom: 20},
	fontSize: '16',
	fontFamily: serifFont
});

/////////////////////

mail.addRow();
mail.addColumn();
mail.addDivider({ borderWidth: '2px' });

/////////////////////

mail.addRow({
	align: 'center',
	padding: {top: 0}
});
mail.addColumn();
mail.addText("Social Title", {
	align: 'center',
	padding: {top: 0},
	fontWeight: 'bold',
	fontFamily: sansSerifFont,
	fontSize: '17'
});

/////////////////////

mail.addRow({
	align: 'center',
	padding: {top: 0}
});
mail.addColumn();
mail.addText("<a href=\"#\" style=\"text-decoration: none; color: black;\">Facebook</a> &nbsp; " +
	"<a href=\"#\" style=\"text-decoration: none; color: black;\">Twitter</a> &nbsp; " +
	"<a href=\"#\" style=\"text-decoration: none; color: black;\">Instagram</a> &nbsp; " +
	"<a href=\"#\" style=\"text-decoration: none; color: black;\">Pinterest</a> &nbsp; " +
	"<a href=\"#\" style=\"text-decoration: none; color: black;\">Youtube</a> &nbsp; ", {
	align: 'center',
	padding: {top: 0},
	fontWeight: 'bold',
	fontFamily: sansSerifFont,
	fontSize: '17'
});

/////////////////////

mail.addRow();
mail.addColumn();
mail.addDivider({ borderWidth: '2px' });

/////////////////////

mail.addRow({
	align: 'center',
	padding: {top: 0}
});
mail.addColumn();
mail.addText("About your company <br/>" +
	"Legal notice and anti-spam disclaimer <br/>" +
	"<a href=\"#\" style=\"text-decoration: none; color: #9B9B9B;\">Unsubscribe</a>", {
	align: 'center',
	padding: {top: 0},
	color: '#9B9B9B',
	fontFamily: sansSerifFont,
	fontSize: '13'
});

/////////////////////
