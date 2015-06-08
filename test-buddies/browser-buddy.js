var browserBuddy = {};

browserBuddy.createBrowser = function(webdriver, implicitWaitTime) {
  if(implicitWaitTime === undefined) {
    implicitWaitTime = 45000;
  }
  var browser = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();
  implicitWaitTime = implicitWaitTime || 45000;
  browser.manage().timeouts().implicitlyWait(implicitWaitTime);
  return browser;
};

module.exports = browserBuddy;
