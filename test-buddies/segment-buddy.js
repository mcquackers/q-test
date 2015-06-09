var Q = require("q");
segmentBuddy = {};

segmentBuddy.initialize = function(browser, webdriver) {
  segmentBuddy.browser = browser;
  segmentBuddy.webdriver = webdriver;
};

segmentBuddy.setSegmentName = function(segmentName) {
  var browser = segmentBuddy.browser;
  var webdriver = segmentBuddy.webdriver;
  var setSegmentNamePromise = new Promise(function(resolveSetSegmentName, rejectSetSegmentName) {
    var segmentNameInput;
    segmentNameInput = browser.findElement(webdriver.By.id("segment-name-wc"));
    segmentNameInput.click().
      then(function() {
        return segmentNameInput.sendKeys(segmentName);
      }).then(function() {
        resolveSetSegmentName(true);
      }, function(err) {
        rejectSetSegmentName(err);
      });
  });
  return setSegmentNamePromise;
};

segmentBuddy.setAdvertiser = function(advertiserName) {
  var browser = segmentBuddy.browser;
  var webdriver = segmentBuddy.webdriver;
  var elementHold;
  var setAdvertiserPromise = new Promise(function(resolveSetAdvertiser, rejectSetAdvertiser) {
    browser.findElement(webdriver.By.xpath("//*[@id='advertisers']")).
      then(function(element) {
        var openDropdownPromise = new Promise(function(resolveOpenDropdown, rejectOpenDropdown) {
          setTimeout(function() {
            element.click().then(function() {
              resolveOpenDropdown(true);
            }, function(err) {
              rejectOpenDropdown(err);
            });
          }, 1500);
        });
        return openDropdownPromise;
      }).then(function() {
        return browser.findElement(webdriver.By.xpath("//*[@id='advertisers']/mm-input"));
      }).
    then(function(element) {
      elementHold = element;
      return element.click();
    }).
    then(function() {
      var sendSearchKeyPromise = new Promise(function(resolveSendSearchKey, rejectSendSearchKey) {
        setTimeout(function() {
          elementHold.sendKeys(advertiserName).then(function() {
            resolveSendSearchKey(true);
          }, function(err) {
            rejectSendSearchKey(err);
          });
        }, 1000);
      });
      return sendSearchKeyPromise;
    }, function(err) {
      console.log(err);
    }).then(function() {
      setTimeout(function() {
        browser.findElements(webdriver.By.xpath("//*[@id='advertisers']/mm-list-item")).then(function(elements) {
          var asyncCatcher = 0;
          for(var i = 0; i < elements.length; i++) {
            elements[i].getText().then(function(text) {
              if(text == advertiserName) {
                elements[asyncCatcher].click();
                resolveSetAdvertiser(true);
              } else if(asyncCatcher == elements.length) {
                rejectSetAdvertiser(new Error("The advertiser Search key could not be found in the list"));
              } else {
                asyncCatcher++;
              }
            });
          }
        });
      }, 1000);
    });
  });
  return setAdvertiserPromise;
};

segmentBuddy.getSegmentSize = function () {
  var browser = segmentBuddy.browser;
  var webdriver = segmentBuddy.webdriver;
  var segmentSizePromise = new Promise(function(resolveSegmentSize, rejectSegmentSize) {
    browser.findElement(webdriver.By.id("refresh-button")).
      then(function(refreshButton) {
        return refreshButton.click();
      }).then(function() {
        setTimeout(function() {
          browser.findElement(webdriver.By.className("segment-size")).getText().then(function(text) {
            if(text != "--"){
              resolveSegmentSize(text);
            } else {
              rejectSegmentSize(new Error("Non-numerical Value.  Maybe give more time?"));
            }
          });
        }, 4500);
      });
  });
  return promise;
};

segmentBuddy.exitSegment = function() {
  var browser = segmentBuddy.browser;
  var webdriver = segmentBuddy.webdriver;
  var exitSegmentPromise = new Promise(function(resolveExitSegment, rejectExitSegment) {
    setTimeout(function() {
      browser.wait(function() {
        var saveButton = browser.findElement(webdriver.By.xpath("//*[@id='save-segment-button']"));
        return saveButton.isEnabled();
      }, 20000).then(function() {
        browser.findElement(webdriver.By.xpath("//*[@id='cancel-segment-button']")).click();
        browser.findElement(webdriver.By.xpath("//*[@id='unsaved-changes-continue-button']")).click().then(function() {
          resolveExitSegment(true);
        }, function(err) {
          rejectExitSegment(err);
        });
      });
    }, 5000);
  });
  return exitSegmentPromise;
};

segmentBuddy.saveSegment = function() {
  var browser = segmentBuddy.browser;
  var webdriver = segmentBuddy.webdriver;
  var saveSegmentPromise = new Promise(function(resolveSaveSegment, rejectSaveSegment) {
    browser.findElement(webdriver.By.id("save-segment-button")).click().then(function() {
      resolveSaveSegment(true);
    }, function(err) {
      rejectSaveSegment(err);
    });
  });
  return saveSegmentPromise;
};

segmentBuddy.addSegment = function() {
  var browser = segmentBuddy.browser;
  var webdriver = segmentBuddy.webdriver;
  var addSegmentPromise = new Promise(function(resolveAddSegment, rejectAddSegment) {
    setTimeout(function() {
      browser.findElement(webdriver.By.id("add-segment")).click().then(function() {
        resolveAddSegment(true);
      }, function(err) {
        rejectAddSegment(err);
      });
    }, 1000);
  });
  return addSegmentPromise;
};

segmentBuddy.newTestSegment = function(advertiserName, segmentName) {
  var browser = segmentBuddy.browser;
  var webdriver = segmentBuddy.webdriver;
  var newSegmentPromise = new Promise(function(resolveNewSegment, rejectNewSegment) {
    segmentBuddy.addSegment().then(function() {
      return segmentBuddy.setSegmentName(segmentName);
    }).
    then(function() {
      return segmentBuddy.setAdvertiser(advertiserName);
    }).
    then(function() {
      resolveNewSegment(true);
    }, function(err) {
      rejectNewSegment(err);
    });
  });
  return newSegmentPromise;
};

module.exports = segmentBuddy;
