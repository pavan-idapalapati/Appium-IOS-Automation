// const wdio = require("webdriverio");

// const opts = {
//     port: 4723,
//     capabilities: {
//       platformName: "ios",
//       deviceName: "iPhone XR (12.1)",
//       udid:"D3C150F4-B07E-4191-BB50-81BBF7F00F4C",
//       app: "/Users/shibo/Documents/testipa/DUKE.ipa",
//       automationName: "XCUITest"
//     }
//   };
  
//   const client = wdio.remote(opts);

//   const login = client.findElement("accessibility id","login");
//   login.click();
//   const email = client.findElement("accessibility id","email");
//   client.elementSendKeys(email.ELEMENT, "divami@docs.duke-ai.com");
//   const password = client.findElement("accessibility id","password");
//   client.elementSendKeys(password.ELEMENT, "Divami@3");

const webdriverio = require('webdriverio');
const wd = require('wd');

const iosOptions = {
  port: 4723,
  capabilities: {
    platformName: "ios",
    deviceName: "iPhone XR (12.1)",
    udid:"D3C150F4-B07E-4191-BB50-81BBF7F00F4C",
    app: "/Users/shibo/Documents/testipa/DUKE.ipa",
    automationName: "XCUITest"
  }
};

describe('Duke Login', function () {
  let client;
  let driver;

  before(async function () {
    this.timeout(99999);
    client = await webdriverio.remote(iosOptions);
    driver = await wd.remote(iosOptions);
  });

  after(async function () {
    await client.deleteSession();
  });

  it('should navigate to login section, enter credentials and login', async function (done) {
    
    this.timeout(9999);

    await client.execute('mobile:alert', { action: 'accept' });
    
    const loginButton = await client.findElement("accessibility id","login");
    await loginButton.click();

    const email = await client.findElement("accessibility id","name");
    await client.elementSendKeys(email.ELEMENT, "divami@docs.duke-ai.com");

    const password = await client.findElement("accessibility id","password");
    await client.elementSendKeys(password.ELEMENT, "Divami@3");

    const submit = await client.findElement("accessibility id","signin_submit");
    await client.tapElement(submit);

    done();
  });
  
});
