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
  var selectItemPromise = new Promise(function(resolveSelectItem, rejectSelectItem) {
    setTimeout(function() {
      browser.findElements(webdriver.By.className("name")).then(function(elements) {
        var asyncCatcher = 0;
        for(var i = 0; i < elements.length; i++) {
          elements[i].getText().then(function(text) {
            if(text == stringToSelect) {
              elements[asyncCatcher].click().then(function() {
                resolveSelectItem(true);
              }, function(err) {
                rejectSelectItem(err);
              });
            } else if(asyncCatcher == elements.length) {
              rejectSelectItem(new Error("Item not found"));
            }
            asyncCatcher++;
          });
        }
      });
    }, 1500);
  });
  return selectItemPromise;
};

behaviorBuddy.selectItems = function(arrayOfStringsToBeSelected) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var selectItemsPromise = new Promise(function(resolveSelectItems, rejectSelectItems) {
    setTimeout(function() {
      browser.findElements(webdriver.By.className(behaviorBuddy.ITEM_CLASS_NAME)).then(function(elements) {
        var asyncCatcher = 0;
        for(var i = 0; i < elements.length; i++) {
          elements[i].getText().then(function(text) {
            if(arrayOfStringsToBeSelected.indexOf(text)>=0) {
              elements[asyncCatcher].click();
            }
            asyncCatcher++;
            if(asyncCatcher == elements.length){
              resolveSelectItems(true);
            }
          });
        }
      });
    }, 1500);
  });
  return selectItemsPromise;
};

behaviorBuddy.allBehaviorsAdded = function(arrayOfExpectedBehaviors) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var DEFAULT_BLANKS = 2;
  var segmentBehaviors = [];
  var allBehaviorsAddedPromise = new Promise(function(resolveAllBehaviorsAdded, rejectAllBehaviorsAdded) {
    browser.findElements(webdriver.By.className("segment-element")).then(function(elements) {
    for(var i = 0; i < elements.length - DEFAULT_BLANKS; i++) {
      elements[i].getText().then(function(text) {
        var indexNewlineRaw = text.indexOf("\n");
        var segmentElementText = text.substring(indexNewlineRaw+1);
        var indexNewlineText = segmentElementText.indexOf("\n");
        var pixelNameSubstring = segmentElementText.substring(indexNewlineText+1);
        if(arrayOfExpectedBehaviors.indexOf(pixelNameSubstring)>=0){
          segmentBehaviors.push(pixelNameSubstring);
        }
      });
    }
    setTimeout(function() {
      if(arraysIdentical(segmentBehaviors, arrayOfExpectedBehaviors)) {
        resolveAllBehaviorsAdded(true);
      } else {
        rejectAllBehaviorsAdded(new Error("Not all behaviors added"));
      }
    }, 1000);
  });
  });
  return allBehaviorsAddedPromise;
};

behaviorBuddy.editBehavior = function(behaviorToEdit) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var asyncCatcher = 0;
  var editBehaviorPromise = new Promise(function(resolveEditBehavior, rejectEditBehavior) {
    browser.findElements(webdriver.By.className("segment-element")).then(function(elements) {
      for(var i = 0; i < elements.length; i++) {
        elements[i].getAttribute("title").then(function(title) {
          if(title.indexOf(behaviorToEdit)>=0) {
            elements[asyncCatcher].findElement(webdriver.By.className("edit-control")).click().then(function() {
              resolveEditBehavior(true);
            });
          }
          asyncCatcher++;
          if(asyncCatcher == elements.length) {
            rejectEditBehavior(new Error("Something went wrong :("));
          }
        });
      }
    });
  });
  return editBehaviorPromise;
};

behaviorBuddy.selectFromDropdown = function (dropdown, stringToSelect) {
  var webdriver = behaviorBuddy.webdriver;
  var selectDropdownPromise = new Promise(function(resolveSelect, rejectSelect) {
    dropdown.click().
      then(function() {
        var findElementsPromise = new Promise(function(resolveFindElements, rejectFindElements) {
          setTimeout(function() {
            dropdown.findElements(webdriver.By.css(" * ")).then(function(elements) {
              resolveFindElements(elements);
            });
          }, 1500);
        });
        return findElementsPromise;
      }).
    then(function(elements) {
      var asyncCatcher = 0;
      for(var i = 0;i < elements.length; i++) {
        elements[i].getText().then(function(text) {
          if(text == stringToSelect){
            elements[asyncCatcher].click().then(function() {
              resolveSelect(true);
            });
          }
          asyncCatcher++;
          if(asyncCatcher == elements.length) {
            rejectSelect(new Error("Not found in list"));
          }
        });
      }
    });
  });
  return selectDropdownPromise;
};

behaviorBuddy.addBehavior = function() {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var addBehaviorPromise = new Promise(function(resolveAddBehavior, rejectAddBehavior) {
    setTimeout(function() {
      browser.findElement(webdriver.By.className("add-behavior-text")).click().then(function() {
        resolveAddBehavior(true);
      }, function(err) {
        console.log(err);
        rejectAddBehavior(err);
      });
    }, 1500);
  });
  return addBehaviorPromise;
};

behaviorBuddy.addEventPixel = function(pixelToAdd, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var addEventPixelPromise = new Promise(function(resolveAddEventPixel, rejectAddEventPixel) {
    console.log("In addEventPixel");
    behaviorBuddy.addBehavior().then(function() {
      return behaviorBuddy.selectItem(advertiserName);
    }).
    then(function() {
      return behaviorBuddy.selectItem(behaviorBuddy.EVENT_PIXELS);
    }).
    then(function() {
      console.log("Look for pixel");
      return behaviorBuddy.selectItem(pixelToAdd);
    }).
    then(function() {
      return behaviorBuddy.saveBehavior();
    }).
    then(function() {
      resolveAddEventPixel(true);
    }, function(err) {
      rejectAddEventPixel(err);
    });
  });
  return addEventPixelPromise;
};

behaviorBuddy.addEventPixels = function(arrayOfPixelsToAdd, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var addPixelsPromise = new Promise(function(resolveAddPixels, rejectAddPixels) {
    behaviorBuddy.addBehavior().then(function() {
      return behaviorBuddy.selectItem(advertiserName);
    }).
    then(function() {
      return behaviorBuddy.selectItem(behaviorBuddy.EVENT_PIXELS);
    }).
    then(function() {
      return behaviorBuddy.selectItems(arrayOfPixelsToAdd);
    }).
    then(function() {
      return behaviorBuddy.saveBehavior();
    }).
    then(function() {
      resolveAddPixels(true);
    }, function(err) {
      rejectAddPixels(err);
    });
  });
  return addPixelsPromise;
};

behaviorBuddy.addCampaignClick = function(campaignName, strategyName, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var addClickPromise = new Promise(function(resolveAddClick, rejectAddClick) {
    behaviorBuddy.addBehavior().
      then(function() {
        return behaviorBuddy.selectItem(advertiserName);
      }).
    then(function() {
      return behaviorBuddy.selectItem(behaviorBuddy.CAMPAIGNS);
    }).
    then(function() {
      return behaviorBuddy.selectItem(campaignName);
    }).
    then(function() {
      behaviorBuddy.selectItem(strategyName);
    }).
    then(function() {
      return behaviorBuddy.selectItem(behaviorBuddy.CLICK);
    }).
    then(function() {
      return behaviorBuddy.saveBehavior();
    }).
    then(function() {
      resolveAddClick(true);
    }, function(err) {
      rejectAddClick(err);
    });
  });
  return addClickPromise;
};

behaviorBuddy.addCampaignImpression = function(campaignName, strategyName, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var addImpressionPromise = new Promise(function(resolveAddImpression, rejectAddImpression) {
    behaviorBuddy.addBehavior().
      then(function() {
        return behaviorBuddy.selectItem(advertiserName);
      }).
    then(function() {
      return behaviorBuddy.selectItem(behaviorBuddy.CAMPAIGNS);
    }).
    then(function() {
      return behaviorBuddy.selectItem(campaignName);
    }).
    then(function() {
      behaviorBuddy.selectItem(strategyName);
    }).
    then(function() {
      return behaviorBuddy.selectItem(behaviorBuddy.IMPRESSION);
    }).
    then(function() {
      return behaviorBuddy.saveBehavior();
    }).
    then(function() {
      console.log("Resolving addCampaignImpression");
      resolveAddImpression(true);
    }, function(err) {
      console.log("Rejecting addCampaignImpression");
      rejectAddImpression(err);
    });
  });
  return addImpressionPromise;
};

behaviorBuddy.addCampaignImpressions = function(arrayOfCampaignNames, arrayOfStrategyNames, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var addImpressionsPromise = new Promise(function(resolveAddImpressions, rejectAddImpressions) {
    behaviorBuddy.addBehavior().
      then(function() {
        return behaviorBuddy.selectItem(advertiserName);
      }).
    then(function() {
      return behaviorBuddy.selectItem(behaviorBuddy.CAMPAIGNS);
    }).
    then(function() {
      return behaviorBuddy.selectItems(arrayOfCampaignNames);
    }).
    then(function() {
      return behaviorBuddy.selectItems(arrayOfStrategyNames);
    }).
    then(function() {
      return behaviorBuddy.selectItems(behaviorBuddy.IMPRESSION);
    }).
    then(function() {
      return behaviorBuddy.saveBehavior();
    }).
    then(function() {
      resolveAddImpressions(true);
    }, function(err) {
      rejectAddImpressions(true);
    });
  });
  return addImpressionsPromise;
};

behaviorBuddy.addCampaignClicks = function(arrayOfCampaignNames, arrayOfStrategyNames, advertiserName) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var addClicksPromise = new Promise(function(resolveAddClicks, rejectAddClicks) {
    behaviorBuddy.addBehavior().
      then(function() {
        return behaviorBuddy.selectItem(advertiserName);
      }).
    then(function() {
      return behaviorBuddy.selectItem(behaviorBuddy.CAMPAIGNS);
    }).
    then(function() {
      return behaviorBuddy.selectItems(arrayOfCampaignNames);
    }).
    then(function() {
      return behaviorBuddy.selectItems(arrayOfStrategyNames);
    }).
    then(function() {
      return behaviorBuddy.selectItems(behaviorBuddy.CLICK);
    }).then(function() {
      return behaviorBuddy.saveBehavior();
    }).then(function() {
      resolveAddClicks(true);
    }, function(err) {
      rejectAddClicks(err);
    });
  });
  return addClicksPromise;
};


behaviorBuddy.saveBehavior = function() {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var saveBehaviorPromise = new Promise(function(resolveSaveBehavior, rejectSaveBehavior) {
    setTimeout(function() {
      browser.findElement(webdriver.By.id("add-button")).click().then(function() {
        resolveSaveBehavior(true);
      }, function(err) {
        rejectSaveBehavior(err);
      });
    }, 1000);
  });
  return saveBehaviorPromise;
};

module.exports = behaviorBuddy;
