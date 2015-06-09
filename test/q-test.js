"use strict";
var should = require("chai").should();
var webdriver = require("selenium-webdriver");
var test = require("selenium-webdriver/testing");
var advertiserSearchKey = "401_KenMaddy";
var segmentName = "blah";
var WAIT_TIME = 25000;
var browser;
var loginBuddy;
var behaviorBuddy;
var segmentBuddy;
// SET THESE VARIABLES BEFORE TESTING
var pixelsToSelect = ["donna_confirm", "donna_thankyou"];

test.describe("q-test", function() {
  test.before("Open browser and login", function(done) {
    browser = require("../test-buddies/browser-buddy.js").
      createBrowser(webdriver, WAIT_TIME);
    loginBuddy = require("../test-buddies/login-buddy.js");
    behaviorBuddy = require("../test-buddies/behavior-buddy.js");
    segmentBuddy = require("../test-buddies/segment-buddy.js");
    behaviorBuddy.initialize(browser, webdriver);
    segmentBuddy.initialize(browser,webdriver);
    loginBuddy.login(webdriver, browser, "", "");
    browser.findElement(webdriver.By.className("nav-icon-segments")).click();
    done();
  })

  test.it("begin test steps here", function(done) {
    segmentBuddy.newTestSegment(advertiserSearchKey, segmentName).
      then(function() {
        return behaviorBuddy.addEventPixels(pixelsToSelect, advertiserSearchKey);
      }).
    then(function() {
      return behaviorBuddy.allBehaviorsAdded(pixelsToSelect);
    }).
    then(function() {
      return behaviorBuddy.editBehavior("donna_thankyou");
    }).
    then(function() {
      return browser.findElement(webdriver.By.id("add-event-filter"));
    }).
    then(function(element) {
      var promise = new Promise(function(resolve, reject) {
        element.click().then(function() {
          resolve(true);
        });
      });
      return promise;
    }).
    then(function() {
      return browser.findElement(webdriver.By.className("attribute-options"));
    }).
    then(function(element) {
      return behaviorBuddy.selectFromDropdown(element, "Connection Speed");
    }).
    then(function() {
      console.log("done");
    }, function(err) {
      console.log(err);
    });
  })
});
