var behaviorBuddy = {};
var arraysIdentical = function(a, b) {
  var i = a.length;
  if (i != b.length) return false;
  while (i--) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

behaviorBuddy.ITEM_CLASS_NAME = "name";
behaviorBuddy.CAMPAIGNS = "Campaigns";
behaviorBuddy.EVENT_PIXELS = "Event Pixels";
behaviorBuddy.CLICK = "Click";
behaviorBuddy.IMPRESSION = "Impression";


behaviorBuddy.initialize = function(browser, webdriver) {
  behaviorBuddy.browser = browser;
  behaviorBuddy.webdriver = webdriver;
};

behaviorBuddy.selectItem = function(stringToSelect) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var promise = new Promise(function(resolve, reject) {
    browser.findElements(webdriver.By.className("name")).then(function(elements) {
      setTimeout(function() {
        var asyncCatcher = 0;
        for(var i = 0; i < elements.length; i++) {
          elements[i].getText().then(function(text) {
            if(text == stringToSelect) {
              elements[asyncCatcher].click().then(function() {
                resolve(true);
              }, function(err) {
                reject(err);
              });
            }
            asyncCatcher++;
          });
        }
      }, 1500);
    });
  });
  return promise;
};

behaviorBuddy.selectItems = function(arrayOfStringsToBeSelected) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var promise = new Promise(function(resolve, reject) {
    browser.findElements(webdriver.By.className(behaviorBuddy.ITEM_CLASS_NAME)).then(function(elements) {
      setTimeout(function () {
        var asyncCatcher = 0;
        for(var i = 0; i < elements.length; i++) {
          elements[i].getText().then(function(text) {
            if(arrayOfStringsToBeSelected.indexOf(text)>=0) {
              elements[asyncCatcher].click();
            }
            asyncCatcher++;
            if(asyncCatcher == elements.length){
              resolve(true);
            }
          });
        }
      }, 1500);
    });
  });
  return promise;
};

behaviorBuddy.allBehaviorsAdded = function(arrayOfExpectedBehaviors, elements) {
  var DEFAULT_BLANKS = 2;
  var segmentBehaviors = [];
  var promise = new Promise(function(resolve, reject) {
    for(var i = 0; i < elements.length - DEFAULT_BLANKS; i++) {
      elements[i].getText().then(function(text) {
        var index = text.indexOf("\n");
        var pixelNameSubstring = text.substring(index+1);
        segmentBehaviors.push(pixelNameSubstring);
      });
    }
    setTimeout(function() {
      if(arraysIdentical(segmentBehaviors, arrayOfExpectedBehaviors)) {
        resolve(true);
      } else {
        reject(new Error("Not all behaviors added"));
      }
    }, 1000);
  });
  return promise;
};

behaviorBuddy.editBehavior = function(behaviorToEdit) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var asyncCatcher = 0;
  var promise = new Promise(function(resolve, reject) {
    browser.findElements(webdriver.By.className("segment-element")).then(function(elements) {
      for(var i = 0; i < elements.length; i++) {
        elements[i].getAttribute("title").then(function(title) {
          if(title.indexOf(behaviorToEdit)>=0) {
            elements[asyncCatcher].findElement(webdriver.By.className("edit-control")).click().then(function() {
              resolve(true);
            });
          }
          asyncCatcher++;
        });
      }
    });
  });
  return promise;
};

behaviorBuddy.selectFromDropdown = function (dropdown, stringToSelect) {
  var webdriver = behaviorBuddy.webdriver;
  var promise = new Promise(function(resolve, reject) {
    dropdown.click().then(dropdown.findElements(webdriver.By.css(" * "))).then(function(elements) {
      var asyncCatcher = 0;
      for(var i = 0;i < elements.length; i++) {
        elements[i].getText().then(function(text) {
          if(text == stringToSelect){
            elements[asyncCatcher].click().then(function() {
              resolve(true);
            });
          }
          asyncCatcher++;
          if(asyncCatcher == elements.length) {
            reject(new Error("Not found in list"));
          }
        });
      }
    });
  });
  return promise;
};

behaviorBuddy.addBehavior = function() {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var promise = new Promise(function(resolve, reject) {
    behaviorBuddy.browser.findElement(webdriver.By.className("add-behavior-text")).click();
    console.log("third");
    resolve(true);
    });
  return promise;
};

behaviorBuddy.addEventPixel = function(pixelToAdd, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  behaviorBuddy.addBehavior();
  behaviorBuddy.selectItem(advertiserName);
  setTimeout(function() {
    behaviorBuddy.selectItem(behaviorBuddy.EVENT_PIXELS);
  }, 2500);
  setTimeout(function() {
    behaviorBuddy.selectItem(pixelToAdd);
  }, 4500);
  setTimeout(function() {
    browserBuddy.saveBehavior();
  }, 7000);
};

behaviorBuddy.addEventPixels = function(arrayOfPixelsToAdd, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  behaviorBuddy.addBehavior();
  behaviorBuddy.selectItem(advertiserName);
  setTimeout(function() {
    behaviorBuddy.selectItem(behaviorBuddy.EVENT_PIXELS);
  }, 2500);
  setTimeout(function() {
    behaviorBuddy.selectItems(arrayOfPixelsToAdd);
  }, 4500);
  setTimeout(function() {
    behaviorBuddy.saveBehavior();
  }, 7000);
};

behaviorBuddy.addCampaignClick = function(campaignName, strategyName, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  behaviorBuddy.addBehavior();
  behaviorBuddy.selectItem(advertiserName);
  setTimeout(function() {
    behaviorBuddy.selectItem(behaviorBuddy.CAMPAIGNS);
  }, 2500);
  setTimeout(function() {
    behaviorBuddy.selectItem(campaignName);
  }, 4500);
  setTimeout(function() {
    behaviorBuddy.selectItem(strategyName);
  }, 6500);
  setTimeout(function() {
    behaviorBuddy.selectItem(behaviorBuddy.CLICK);
  }, 8500);
  setTimeout(function() {
    behaviorBuddy.saveBehavior();
  }, 10500);
};

behaviorBuddy.addCampaignImpression = function(campaignName, strategyName, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  behaviorBuddy.addBehavior();
  behaviorBuddy.selectItem(advertiserName);
  setTimeout(function() {
    behaviorBuddy.selectItem(behaviorBuddy.CAMPAIGNS);
  }, 2500);
  setTimeout(function() {
    behaviorBuddy.selectItem(campaignName);
  }, 4500);
  setTimeout(function() {
    behaviorBuddy.selectItem(strategyName);
  }, 6500);
  setTimeout(function() {
    behaviorBuddy.selectItem(behaviorBuddy.IMPRESSION);
  }, 8500);
  setTimeout(function() {
    behaviorBuddy.saveBehavior();
  }, 10500);
};

behaviorBuddy.addCampaignImpressions = function(arrayOfCampaignNames, arrayOfStrategyNames, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  behaviorBuddy.addBehavior();
  behaviorBuddy.selectItem(advertiserName);
  setTimeout(function() {
    behaviorBuddy.selectItem(behaviorBuddy.CAMPAIGNS);
  }, 2500);
  setTimeout(function() {
    behaviorBuddy.selectItems(arrayOfCampaignNames);
  }, 4500);
  setTimeout(function() {
    behaviorBuddy.selectItems(arrayOfStrategyNames);
  }, 7000);
  setTimeout(function () {
    behaviorBuddy.selectItems(behaviorBuddy.IMPRESSION);
  }, 9000);
  setTimeout(function() {
    behaviorBuddy.saveBehavior();
  }, 11500);
};

behaviorBuddy.addCampaignClicks = function(arrayOfCampaignNames, arrayOfStrategyNames, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  behaviorBuddy.addBehavior();
  behaviorBuddy.selectItem(advertiserName);
  setTimeout(function() {
    behaviorBuddy.selectItem(behaviorBuddy.CAMPAIGNS);
  }, 2500);
  setTimeout(function() {
    behaviorBuddy.selectItems(arrayOfCampaignNames);
  }, 4500);
  setTimeout(function() {
    behaviorBuddy.selectItems(arrayOfStrategyNames);
  }, 7000);
  setTimeout(function () {
    behaviorBuddy.selectItems(behaviorBuddy.CLICK);
  }, 9000);
  setTimeout(function() {
    behaviorBuddy.saveBehavior();
  }, 11500);
};


behaviorBuddy.saveBehavior = function() {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  browser.findElement(webdriver.By.id("add-button")).click();
};

module.exports = behaviorBuddy;
