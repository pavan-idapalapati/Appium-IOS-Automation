/**In this flow we will test the registration screen's basic functionalities, 
 * login screen's functionalities */

const wd = require('wd');
const chai = require('chai');
const config = require('../config');
const utils = require('./utils')
const imageCompare = require('../imageCompare')
const { assert } = chai;



describe('Testing Duke UI functionalities', function () {

	let driver;

	let loginElements = [
		{
			name: "email",
			type: "textfield",
			value: "",
			nonRegisteredValue: config.nonRegisteredLoginDetails.email,
			placeholder: "Email",
			invalidValue: config.invalidPassordDetails.email,
			registeredValue: config.registeredLoginDetails.email
		}, {
			name: "password",
			type: "text",
			value: "",
			nonRegisteredValue: config.nonRegisteredLoginDetails.password,
			placeholder: "Password",
			invalidValue: config.invalidPassordDetails.email,
			registeredValue: config.registeredLoginDetails.password

		}
	]

	before(async function () {
		// Connect to Appium server
		driver = await wd.promiseChainRemote(config.serverConfig);
		this.timeout(1200000);
		// Start the session
		await driver.init({
			...config.iosCaps
		});
	});

	after(async function () {
		await driver.quit();
	});



	it('it should check image comparision functionality', async function () {
		//Click on login

		await driver.setPageLoadTimeout(5000);
		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);

		await driver.execute('mobile:alert', { action: 'accept' });


		let login = await utils.elementByAccessibilityId(driver, "login");
		await login.click();

		// entering email and password
		for (let i = 0; i < loginElements.length; i++) {
			let element = loginElements[i];
			let ele = await utils.elementByAccessibilityId(driver, element.name);
			let placeholder = await ele.text();
			await assert.equal(placeholder, element.placeholder);
			let value;
			if (element.placeholder == 'Password') {
				value = config.constants.futurePassword;
			} else {
				value = element.registeredValue
			}
			await ele.sendKeys(value);
		}

		//Click Login
		let loginButton = await utils.elementByAccessibilityId(driver, "submit");
		await loginButton.click();
		// await driver.setPageLoadTimeout(10000);

		// let el1 = await utils.elementByAccessibilityId(driver, "profile");

		let uploadDocument = await utils.elementByAccessibilityId(driver, "uploadDocument");
		await uploadDocument.click();
		await driver.setPageLoadTimeout(5000);


		let gallery;
		try {
			gallery = await utils.elementByAccessibilityId(driver, "Gallery");
		} catch (err) {
			await uploadDocument.click();
			gallery = await utils.elementByAccessibilityId(driver, "Gallery");
		} finally {
			await gallery.click();
		}

		let imagesElement = await utils.elementByAccessibilityId(driver, "Camera Roll");
		await imagesElement.click();

		let imageCell = await utils.elementByAccessibilityId(driver, config.constants.documentName);
		await imageCell.click();

		
		let submit = await utils.elementByAccessibilityId(driver, "submit");
		await submit.click();
		let imageElement = await driver.waitForElementByXPath("//XCUIElementTypeApplication[@name=\"DUKE\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeImage", 2000);
		await imageElement.click();

		let originalImage = await driver.takeScreenshot();

		let upload = await utils.elementByAccessibilityId(driver, "upload");
		await driver.setImplicitWaitTimeout(500000);
		await upload.click();
		await driver.setPageLoadTimeout(5000);

		// let goBackHome = await utils.elementByAccessibilityId(driver, "goBackHome");
		// await goBackHome.click();

		// let el1 = await driver.elementByAccessibilityId("uploadDocument");
		// await el1.click();

		let el9 = await utils.elementByAccessibilityId(driver, "viewDocument");
		await el9.click();
		console.log(" before enter to process tab")
		// console.log("imageData", originalImage);
		let el10 = await utils.elementByAccessibilityId(driver, "inProcess");
		await driver.setPageLoadTimeout(5000);
		await el10.click();
		console.log(" After enter to process tab")
		let el11 = await driver.elementByXPath("//XCUIElementTypeApplication[@name=\"DUKE\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeCollectionView/XCUIElementTypeCell[1]/XCUIElementTypeOther/XCUIElementTypeOther");
		await el11.click();
		console.log(" After ")


		let uImage = await driver.waitForElementByXPath("//XCUIElementTypeApplication[@name=\"DUKE\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[1]/XCUIElementTypeCollectionView/XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeImage/XCUIElementTypeImage");
		await uImage.click();

		let uploadedImage = await driver.takeScreenshot();
		let diff = await imageCompare.getDiff(originalImage, uploadedImage);
		console.log(diff);
		if (diff.misMatchPercentage > 60) {
			assert.fail("image mismached")
		}
	})

});