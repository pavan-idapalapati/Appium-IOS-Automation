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
	let originalImage;
	let uploadedImage;
	let registrationElements = [
		{
			name: "register",
			type: "button"
		}, {
			name: "name",
			type: "textfield",
			placeholder: "Name",
			value: config.newUserDetails.name,
			registeredValue: config.alreadyRegisteredDetails.name,
			nonRegisteredValue: config.newRegistrationUser.name
		}, {
			name: "email",
			type: "textfield",
			placeholder: "Email",
			value: config.newUserDetails.email,
			registeredValue: config.alreadyRegisteredDetails.email,
			nonRegisteredValue: config.newRegistrationUser.email
		}, {
			name: "phone_number",
			type: "textfield",
			placeholder: "+1",
			value: config.newUserDetails.phone,
			registeredValue: config.alreadyRegisteredDetails.phone,
			nonRegisteredValue: config.newRegistrationUser.phone
		}, {
			name: "password",
			type: "textfield",
			placeholder: "Password",
			value: config.newUserDetails.password,
			registeredValue: config.alreadyRegisteredDetails.password,
			nonRegisteredValue: config.newRegistrationUser.password
		}
	];

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


	it('To verify the look and feel of the Register screen ', async function () {
		await driver.setImplicitWaitTimeout(10000);

		this.timeout(3000000)

		//Accept Popup
		await driver.execute('mobile:alert', { action: 'accept' });

		// UI Elements config for registeration page
		for (let i = 0; i < registrationElements.length; i++) {
			let element = registrationElements[i];
			utils.elementByAccessibilityId(driver, element.name)
		}
	});



	it('Check for all the fields and their placeholders in the register screen.', async function () {
		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(1000);

		for (let i = 0; i < registrationElements.length; i++) {
			let element = registrationElements[i];
			if (element.type === "textfield") {
				//Element exists
				let ele = await utils.elementByAccessibilityId(driver, element.name);
				let placeholder = await ele.text();
				assert.equal(placeholder, element.placeholder);
			} else if (element.type === "button") {
				utils.elementByAccessibilityId(driver, element.name);
			}
		}
	})


	/** TODO Check this Testcase */
	it('To verify error messages are displayed for all the fields when are left blank and submit button is clicked by user', async function () {

		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);

		//Send Verification Code button exists
		let sendVerificationCodeButton = await utils.elementByAccessibilityId(driver, "signup_submit");
		await sendVerificationCodeButton.click();
		// await driver.setImplicitWaitTimeout(1000);
		let errorMessageElement = await driver.element("name", "Password should be minimum 8 characters.");
		const errorMessage = await errorMessageElement.text();
		assert.equal(errorMessage, `Password should be minimum 8 characters.`);
		// await driver.setImplicitWaitTimeout(1000);
		// Close the popup
		let close = await utils.elementByAccessibilityId(driver, "OK");
		await close.click();

	});


	it('To verify error message when user tries to register with already registered email id ', async function () {

		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);
		for (let i = 0; i < registrationElements.length; i++) {
			let el = registrationElements[i];
			if (el.type == "textfield") {
				let element = await driver.waitForElementByAccessibilityId(el.name);
				await element.clear();
				await element.sendKeys(el.value);
			}

		}

		let sendVerificationCodeButton = await driver.waitForElementByAccessibilityId("signup_submit");
		await sendVerificationCodeButton.click();

		let alertTitleElement = await driver.element("name", "Error!");
		let alertTitle = await alertTitleElement.text();
		await assert.equal(alertTitle, `Error!`);

		let alertMessageElement = await driver.element("name", "User already exists. Would you like to reset your password?");
		let alertMessage = await alertMessageElement.text();
		await assert.equal(alertMessage, `User already exists. Would you like to reset your password?`);

		let close = await driver.waitForElementByAccessibilityId("Cancel");
		await close.click();

	});

	it('it should move to registraion page second step and enter dummy verification code  and show error popup and should come back to registration page', async function () {

		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);
		for (let i = 0; i < registrationElements.length; i++) {
			let el = registrationElements[i];
			if (el.type == "textfield") {
				// console.log(el, "element@");
				let element = await driver.waitForElementByAccessibilityId(el.name);
				await element.clear();
				await element.sendKeys(el.nonRegisteredValue);
			}

		}

		let sendVerificationCodeButton = await driver.waitForElementByAccessibilityId("signup_submit");
		await sendVerificationCodeButton.click();

		let el1 = await utils.elementByAccessibilityId(driver, "verificationcode");
		await el1.sendKeys(config.constants.registrationVerificationCode);
		let el2 = await utils.elementByAccessibilityId(driver, "verify");
		await el2.click();
		let el3 = await utils.elementByAccessibilityId(driver, "Please enter the correct verification code.");
		await el3.click();
		let el4 = await utils.elementByAccessibilityId(driver, "OK");
		await el4.click();
		let el5 = await utils.elementByAccessibilityId(driver, "back");
		await el5.click();
	})

	it('To verify error message is displayed when user tries to login non registered email id.', async function () {

		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);


		//Click on login
		let login = await utils.elementByAccessibilityId(driver, "login");
		await login.click();

		// entering email and password
		for (let i = 0; i < loginElements.length; i++) {
			let element = loginElements[i];
			let ele = await utils.elementByAccessibilityId(driver, element.name);
			let placeholder = await ele.text();
			await assert.equal(placeholder, element.placeholder);
			await ele.sendKeys(element.nonRegisteredValue);
		}

		//Click Login
		let loginButton = await driver.waitForElementByAccessibilityId("submit");
		await loginButton.click();

		let alertTitleElement = await driver.element("name", "Error!");
		let alertTitle = await alertTitleElement.text();
		await assert.equal(alertTitle, `Error!`);

		let alertMessageElement = await driver.element("name", "User does not exist.");
		let alertMessage = await alertMessageElement.text();
		await assert.equal(alertMessage, `User does not exist.`);

		let close = await driver.waitForElementByAccessibilityId("OK");
		await close.click();

	});

	it('To verify error pop up is displayed when user enters wrong mail id or password and clicks on login button.', async function () {

		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);

		for (let i = 0; i < loginElements.length; i++) {
			let element = loginElements[i];
			let ele = await utils.elementByAccessibilityId(driver, element.name);
			await ele.clear();
			await ele.sendKeys(element.invalidValue);
		}

		//Click Login
		let loginButton = await utils.elementByAccessibilityId(driver, "submit");
		await loginButton.click();

		let alertTitleElement = await driver.element("name", "Error!");
		let alertTitle = await alertTitleElement.text();
		await assert.equal(alertTitle, `Error!`);

		let alertMessageElement = await driver.element("name", "Incorrect username or password.");
		let alertMessage = await alertMessageElement.text();
		await assert.equal(alertMessage, `Incorrect username or password.`);

		let close = await utils.elementByAccessibilityId(driver, "OK");
		await close.click();

	});



	it('Test  for email Field Visibility', async function () {

		this.timeout(30000)
		await driver.setImplicitWaitTimeout(10000);


		await driver.setPageLoadTimeout(10000);

		//Click on Forgot Password
		let forgotPwd = await driver.waitForElementByAccessibilityId("forgotPassword");
		await forgotPwd.click();
		let email;
		// console.log("before get the email element");

		email = await utils.elementByAccessibilityId(driver, "email");

		// console.log("After email element", email);
		// await email.click();


		try {
			await email.sendKeys("someone1@duke.com")
		} catch (e) {
			// console.log(e);
		}
		// console.log("After sending keys");
		await email.clear();

	});

	it('Navigate to Forgot Password, enter unregistered email.', async function () {

		this.timeout(30000)
		await driver.setImplicitWaitTimeout(100000);


		let email = await utils.elementByAccessibilityId(driver, "email");
		// console.log("emal2", email);

		await email.sendKeys("abcdea@abc.com");


		//Click Login
		let sendVerificationButton = await utils.elementByAccessibilityId(driver, "sendVerificationCode");
		await sendVerificationButton.click();

		//Check alert Title
		let alertTitleElement = await driver.element("name", "Error!");

		// Check the text
		const alertTitle = await alertTitleElement.text();

		await assert.equal(alertTitle, `Error!`);
		let alertmessageElement = await driver.element("name", "This email is not registered with us. Would you like to register?");


		// Check the text
		const alertmessage = await alertmessageElement.text();


		await assert.equal(alertmessage, `This email is not registered with us. Would you like to register?`);


		//Click Close
		let closeButton = await utils.elementByAccessibilityId(driver, "Close");
		await closeButton.click();

	});

	it('To verify error message pop is displayed when user tries to reset password by entering the email id of non verified but registered ', async function () {

		this.timeout(3000000)
		await driver.setPageLoadTimeout(5000);
		await driver.setImplicitWaitTimeout(10000);


		//Enter Email
		let email = await utils.elementByAccessibilityId(driver, "email");
		await email.clear();
		await email.sendKeys(config.constants.nonVerifiedButRegisteredEmail);

		//Click send verfification code
		let sendVerificationButton = await utils.elementByAccessibilityId(driver, "sendVerificationCode");
		await sendVerificationButton.click();

		//Check alert Title
		let alertTitleElement = await driver.element("name", "Error!");

		// Check the text
		const alertTitle = await alertTitleElement.text();
		await assert.equal(alertTitle, `Error!`);

		//Alert message Element
		let alertmessageElement = await driver.element("name", "Cannot reset password for the user as there is no registered/verified email or phone_number");

		// Check the text
		const alertmessage = await alertmessageElement.text();
		await assert.equal(alertmessage, `Cannot reset password for the user as there is no registered/verified email or phone_number`);


		//Click Close
		let ok = await utils.elementByAccessibilityId(driver, "OK");
		await ok.click();

		//Click Login
		let loginButton = await utils.elementByAccessibilityId(driver, "REMEMBER ? GO BACK TO LOGIN");
		await loginButton.click();

	});


	it('To verify  user is navigated to Home screen if email and password are valid', async function () {

		// await driver.setPageLoadTimeout(5000);
		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);

		// entering username and password
		for (let i = 0; i < loginElements.length; i++) {
			let element = loginElements[i];
			let ele = await utils.elementByAccessibilityId(driver, element.name);
			await ele.clear();
			await ele.sendKeys(element.registeredValue);
		}


		//Click Login
		let loginButton = await utils.elementByAccessibilityId(driver, "submit");
		await loginButton.click();
		// await driver.setPageLoadTimeout(5000);
		//wait for element to appear
		let uploadDocument = await utils.elementByAccessibilityId(driver, "uploadDocument");

	});

	it("it should check the change phone number functionality", async function () {
		await driver.setPageLoadTimeout(10000);
		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(100000);


		let profile = await utils.elementByAccessibilityId(driver, "profile");
		await profile.click();


		let el1 = await utils.elementByAccessibilityId(driver, "change-phonenumber");
		await el1.click();
		let el2 = await utils.elementByAccessibilityId(driver, "password");
		await el2.sendKeys("Divami@4");
		let el3 = await utils.elementByAccessibilityId(driver, "done");
		await el3.click();
		let el4 = await utils.elementByAccessibilityId(driver, "phone_number");
		await el4.clear();
		await el4.sendKeys("+7731834175");
		let el5 = await utils.elementByAccessibilityId(driver, "done");
		await el5.click();
		// let el6 = await driver.elementByXPath("//XCUIElementTypeStaticText[@name=\"Success!\"]");


		// await el6.click();

		let alertTitleElement = await driver.element("name", "Success!");
		let alertTitle = await alertTitleElement.text();
		await assert.equal(alertTitle, `Success!`);


		let msg = await driver.element("name", "Your phone number has changed successfully.");
		let msgText = await msg.text();
		await assert.equal(msgText, `Your phone number has changed successfully.`)
		let el8 = await driver.elementByAccessibilityId("OK");
		await el8.click();
	})

	it('it should show error popup when user trying to enter to change the password  using wrong old password', async function () {

		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);


		let el2 = await utils.elementByAccessibilityId(driver, "change-password");

		await el2.click();

		let el3 = await utils.elementByAccessibilityId(driver, "oldPassword");
		await el3.sendKeys("WrongPassword@123");
		let el4 = await utils.elementByAccessibilityId(driver, "newPassword");
		await el4.sendKeys("WrongPassword@123");
		let el5 = await utils.elementByAccessibilityId(driver, "done");
		await el5.click();
		let el6 = await utils.elementByAccessibilityId(driver, "Incorrect username or password.");
		await el6.click();
		let el7 = await utils.elementByAccessibilityId(driver, "OK");
		await el7.click();
	});



	it('it should give success  message, when user trying to change the password with correct login information', async function () {
		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);
		let el1 = await utils.elementByAccessibilityId(driver, "oldPassword");
		await el1.sendKeys(config.registeredLoginDetails.password);
		let el2 = await utils.elementByAccessibilityId(driver, "newPassword");
		await el2.sendKeys(config.constants.futurePassword);
		let el3 = await utils.elementByAccessibilityId(driver, "done");
		await el3.click();
		let el4 = await driver.element("name", "Success!");
		let text = await el4.text();

		await assert.equal(text, 'Success!')
		let el5 = await driver.element("name", "Your password has changed successfully, Please relogin.");
		text = await el5.text();
		await assert.equal(text, 'Your password has changed successfully, Please relogin.')
		let el6 = await utils.elementByAccessibilityId(driver, "OK");
		await el6.click();
		let el7 = await utils.elementByAccessibilityId(driver, "LOGIN");
		await el7.click();
	});

	it('it should check logout functionality', async function () {
		//Click on login

		await driver.setPageLoadTimeout(5000);
		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);


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
		await driver.setPageLoadTimeout(5000);
		let el1 = await utils.elementByAccessibilityId(driver, "profile");

		await el1.click();
		let el2 = await driver.elementByXPath("//XCUIElementTypeApplication[@name=\"DUKE\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeTable/XCUIElementTypeCell[5]/XCUIElementTypeButton");
		await el2.click();
		let el3 = await driver.elementByAccessibilityId("LOGIN");
		await el3.click();
	})

	it('Should upload Doc', async function () {
		await driver.setPageLoadTimeout(5000);
		this.timeout(3000000)

		await driver.setImplicitWaitTimeout(20000);

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

		let loginButton = await utils.elementByAccessibilityId(driver, "submit");
		await loginButton.click();

		await driver.setPageLoadTimeout(5000);
		//wait for element to appear
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

		originalImage = await driver.takeScreenshot();
		let upload = await utils.elementByAccessibilityId(driver, "upload");
		await driver.setImplicitWaitTimeout(500000);
		await upload.click();
		await driver.setPageLoadTimeout(5000);

		let nextPageTitle = await driver.element("name", "title");

	});

	it('Checking document upload status', async function () {
		await driver.setPageLoadTimeout(5000);
		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);
		let nextPageTitle = await driver.element("name", "title");
		// Check the text
		const vcTitle = await nextPageTitle.text();

		await driver.setPageLoadTimeout(2000);
		let addAnother = await utils.elementByAccessibilityId(driver, "addAnother");
		await addAnother.click();
		await driver.setPageLoadTimeout(2000);

		let gallery;
		try {
			gallery = await utils.elementByAccessibilityId(driver, "Gallery");
		} catch (err) {
			gallery = await utils.elementByAccessibilityId(driver, "Gallery");

		} finally {
			let cancel = await utils.elementByAccessibilityId(driver, "Cancel");
			await cancel.click();
			let el3 = await utils.elementByAccessibilityId(driver, "goBackHome");
			await el3.click();
		}
		let el4 = await utils.elementByAccessibilityId(driver, "HOME");

	});

	it('it should check image comparision functionality', async function () {
		//Click on login

		await driver.setPageLoadTimeout(5000);
		this.timeout(3000000)
		await driver.setImplicitWaitTimeout(10000);


		let el9 = await utils.elementByAccessibilityId(driver, "viewDocument");
		await el9.click();
		let el10 = await utils.elementByAccessibilityId(driver, "inProcess");
		await driver.setPageLoadTimeout(5000);
		await el10.click();
		let el11 = await driver.elementByXPath("//XCUIElementTypeApplication[@name=\"DUKE\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeCollectionView/XCUIElementTypeCell[1]/XCUIElementTypeOther/XCUIElementTypeOther");
		await el11.click();


		let uImage = await driver.waitForElementByXPath("//XCUIElementTypeApplication[@name=\"DUKE\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[1]/XCUIElementTypeCollectionView/XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeImage/XCUIElementTypeImage");
		await uImage.click();

		uploadedImage = await driver.takeScreenshot();
		let diff = await imageCompare.getDiff(originalImage, uploadedImage);
		console.log(diff);
		if (diff.misMatchPercentage > 60) {
			assert.fail("image mismached")
		}
	})
});