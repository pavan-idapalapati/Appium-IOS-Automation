Appium Project Location
——> /Users/shibo/Documents/Appium tests

Appium is basically based Client server architecture. We write the test cases, which are sent to Appium server.


1.Please open the folder in VS Code.
2.To run the test cases run the following command in terminal:
	> mocha test.js
3.The app(DUKE.ipa) file is located in the folder
	>/Users/shibo/Documents/testipa

Test reports will be generated after integrating plugins with mocha-chai.

Note:

1. Run appium and start server.
2. Open VS code and run > mocha test.js. DONE!

If the email and password is not getting typed on the app, click on the simulator -> click Hardware -> Keyboard -> Connect Hardware keyboard. If already checked, uncheck it. Else check it and then uncheck it.

About the Appium Automation Testing:(Already Done)

To get the ipa file of the app:(If there is any change in app)

	First we need to build the Duke app in Xcode.(Selected device should be the target device/simulator. In our case, 	we will be testing It in iPhone XR (12.1))

	Then we need to take the Duke.app file, which is build by XCODE. Put the .app file into a folder “payload”. Zip it 	and rename it to DUKE.ipa.

We will put the ipa file in testipa folder.(This path is provided in iOS capabilities.)


TODO before running test:
> Change the sendKeys('das4@divami.com')
		Change the email in should Register test case => just increment the number to 5 or 6. Eg. das7@divami.com, else app will show already exists and test case will fail.