const wd = require('wd');
const chai = require('chai');

const {assert} = chai;

const serverConfig = {
  host: 'localhost',
  port: 4723
};

const iosCaps = {
  platformName: "ios",
  deviceName: "iPhone XR (12.1)",
  udid:"D3C150F4-B07E-4191-BB50-81BBF7F00F4C",
  app: "/Users/shibo/Documents/testipa/DUKE.ipa",
  automationName: "XCUITest"
};

describe('Basic interactions - POC', function () {

  let driver;

  beforeEach(async function () {
    // Connect to Appium server
    driver = await wd.promiseChainRemote(serverConfig);
    this.timeout(1200000);
    // Start the session
    await driver.init({
      ...iosCaps
    });
  });

  afterEach(async function () {
    await driver.quit();
  });

  it('should Register', async function () {

    this.timeout(99999999999);

    //Accept Popup
    await driver.execute('mobile:alert', { action: 'accept' });

    //Enter Name
    let name = await driver.waitForElementByAccessibilityId("name");
    await name.sendKeys('Shibobrota');

    //Enter Email
    let email = await driver.waitForElementByAccessibilityId("email");
    await email.sendKeys('das7@divami.com');

    //Enter Phone Number
    let phone = await driver.waitForElementByAccessibilityId("phone_number");
    await phone.clear();
    await phone.sendKeys('+917008244473');

    //Enter Password
    let Password = await driver.waitForElementByAccessibilityId("password");
    await Password.sendKeys('Divami@123');

    //Click Send Verification Code
    let button = await driver.waitForElementByAccessibilityId("signup_submit");
    await button.click();

    //Enter code
    let verificationCode = await driver.waitForElementByAccessibilityId("verificationcode");
    await verificationCode.sendKeys('1234sdv123');

    //Click Send Verification Code
    let verifyButton = await driver.waitForElementByAccessibilityId("verify");
    await verifyButton.click();

  });


  it('Should Login', async function () {

    this.timeout(999999999);

    //Accept Popup
    await driver.execute('mobile:alert', { action: 'accept' });

    //Click on login
    const login = await driver.waitForElementByAccessibilityId("login");
    await login.click();

    //Enter Email
    let email = await driver.waitForElementByAccessibilityId("email");
    await email.sendKeys('divami@docs.duke-ai.com');

    //Enter Password
    let Password = await driver.waitForElementByAccessibilityId("password");
    await Password.sendKeys('Divami@3');

    //Click Login
    let loginButton = await driver.waitForElementByAccessibilityId("submit");
    await loginButton.click();
   

  });

  it('Should click forgot password and return.', async function () {

    this.timeout(99999999);

    //Accept Popup
    await driver.execute('mobile:alert', { action: 'accept' });

    //Click on login
    const login = await driver.waitForElementByAccessibilityId("login");
    await login.click();

    //Click on Forgot Password
    const forgotPwd = await driver.waitForElementByAccessibilityId("forgotPassword");
    await forgotPwd.click();

    //Click Login
    let loginButton = await driver.waitForElementByAccessibilityId("REMEMBER ? GO BACK TO LOGIN");
    await loginButton.click();


  });

  it('Should click forgot password and enter wrong email to check popup.', async function () {

    this.timeout(99999999999);

    //Accept Popup
    await driver.execute('mobile:alert', { action: 'accept' });

    //Click on login
    const login = await driver.waitForElementByAccessibilityId("login");
    await login.click();

    //Click on Forgot Password
    const forgotPwd = await driver.waitForElementByAccessibilityId("forgotPassword");
    await forgotPwd.click();

    await driver.setImplicitWaitTimeout(50);

    //Enter Email
    let email = await driver.waitForElementByAccessibilityId("email");
    await email.sendKeys('das@divami.com');

    //Click Login
    let sendVerificationButton = await driver.waitForElementByAccessibilityId("sendVerificationCode");
    await sendVerificationButton.click();

    await driver.setImplicitWaitTimeout(500);

    //Check alert Title
    let alertTitleElement = await driver.elements("xpath","//XCUIElementTypeStaticText[@name=\"Error!\"]");

    // Check the text
    const alertTitle = await alertTitleElement.text();
    assert.equal(alertTitle, `Error!`);

    //Check alert message
    let alertmessageElement = await driver.waitForElementByAccessibilityId("This email is not registered with us. Would you like to register\?");

    // Check the text
    const alertmessage = await alertmessageElement.text();
    assert.equal(alertmessage, `This email is not registered with us. Would you like to register?`);

    //Click Close
    let closeButton = await driver.waitForElementByAccessibilityId("Close");
    await closeButton.click();

  });

});