var iosCaps = {};

iosCaps.iosCaps = {
    "platformName": "ios",
    "app": "/Users/divami/Documents/Duke.Ai - Appium/Test-ipa/DUKE.ipa",
    "deviceName": "iPhone X (11.4)",
    "udid": "892C234F-F443-44A3-B12F-F7C0B7543F45",
    "automationName": "XCUITest"
};

iosCaps.reporterOptions = {
allure: {
    outputDir: './reports'
}
}
iosCaps.mochawesome = {
outputDir: './mochaReports'
};
iosCaps.serverConfig = {
    host: 'localhost',
    port: 4723
};

iosCaps.newUserDetails = {
    name: "Shibobrota Das",
    email: "das@divami.com",
    phone: "+917008244473",
    password: "Asdf1234@7"
},

iosCaps.alreadyRegisteredDetails = {
    name: "divami",
    email: "divami@docs.duke-ai.com",
    phone: "+9170084473",
    password: "Divami@4"
}

iosCaps.registeredLoginDetails = {
    email: "divami@docs.duke-ai.com",
    password: "Divami@4"
}

iosCaps.invalidPassordDetails = {
    email: "divami@docs.duke-ai.com",
    password: "divami@3"
}

iosCaps.nonRegisteredLoginDetails = {
    email: "test1@divami.com",
    password: "Divami@4"
}

iosCaps.newRegistrationUser = {
    name: "das",
    email: "testing91226@gmail.com",
    phone: "+9170084473",
    password: "Divami@12345"
}

iosCaps.constants = {
    nonVerifiedButRegisteredEmail: "das2@divami.com",
    // implicitTimeout: 500000,
    // pageLoadTimeout: 999999999,
    registrationVerificationCode: 2222222,
    documentName: "Photo, Landscape, 3:32 PM",
    futurePassword: "Divami@4"
}
module.exports = iosCaps;

// Photo, Landscape, 3:32 PM
// Photo, Landscape, 3:33 PM

//mocha -R ./node_modules/mochawesome ./Tests/testCases.js
