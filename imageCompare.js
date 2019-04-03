var imageComparison = {};
const compareImages = require("resemblejs/compareImages");
const fs = require("mz/fs");
var base64ToImage = require('base64-to-image');
 
imageComparison.getDiff = async (img1, img2) => {

    // await base64ToImage('./img1.png', img1, 'base64'); 
    // await base64ToImage('./img2.png', img2, 'base64'); 

    await fs.writeFile('./img1.png', img1, 'base64');
    await fs.writeFile('./img2.png', img2, 'base64');
    const options = {
        output: {
            errorColor: {
                red: 255,
                green: 0,
                blue: 255
},
            errorType: "movement",
            transparency: 0.3,
            largeImageThreshold: 1200,
            useCrossOrigin: false,
            outputDiff: true
},
        scaleToSameSize: true,
        ignore: "antialiasing"
};
 
    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    const data = await compareImages(
        './img1.png',
        './img2.png',
        options
);
return data;
}

module.exports = imageComparison;
 