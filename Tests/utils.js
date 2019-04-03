var utils = {};


utils.elementByAccessibilityId = async (driver, id) => {
     await driver.waitForElementByAccessibilityId(id, 20000)
    return await driver.elementByAccessibilityId(id)
}

utils.createImageFile = async(base64Code) => {

}
module.exports = utils;

// Incorrect username or password.