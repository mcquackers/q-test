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
var pixelsToSelect = [];

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
    segmentBuddy.addSegment().then(function() {
      return segmentBuddy.setSegmentName(segmentName);
    }).
    then(function() {
      return segmentBuddy.setAdvertiser(advertiserSearchKey);
    }).
    then(function() {
      return behaviorBuddy.addBehavior();
    }).
    then(function() {
      return behaviorBuddy.selectItem(advertiserSearchKey);
    }).
    then(function() {
      return behaviorBuddy.selectItem("Campaigns");
    }).
    then(function() {
      return behaviorBuddy.selectItems(["can i?", "Donna Test for eBay"]);
    }).
    then(function() {
      console.log("done");
    }, function(err) {
      console.log(err);
    });
  })
});
