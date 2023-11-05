const chai = require("chai");
const chaiHttp = require("chai-http");
require('dotenv').config();
const expect = chai.expect;

chai.use(chaiHttp);
const apiEndpoint = process.env.API_END_POINT;

let userID;
let userOneID;
let userTwoID;
let userThreeID;
let urlCode;

/**
 * Integration tests for the URL Shortener Service API.
 */
describe("URL Shortener Service API Integration Tests", function () {
  this.timeout(5000);
  /**
   * Test case: should register a new user with the tier 1.
   */
  it("should register a new user with the tier 1", function (done) {
    chai
      .request(apiEndpoint)
      .post("/register")
      .send({
        tier: 1,
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("tier").that.equals(1);
        userOneID = res.body.userID;
        done();
      });
  });

  /**
   * Test case: should register a new user with the tier 2.
   */
  it("should register a new user with the tier 2", function (done) {
    chai
      .request(apiEndpoint)
      .post("/register")
      .send({
        tier: 2,
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("createAt");
        expect(res.body).to.have.property("tier").that.equals(2);
        userTwoID = res.body.userID;
        done();
      });
  });
    /**
   * Test case: should register a new user with the tier 3.
   */
    it("should register a new user with the tier 3", function (done) {
      chai
        .request(apiEndpoint)
        .post("/register")
        .send({
          tier: 3,
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("createAt");
          expect(res.body).to.have.property("tier").that.equals(3);
          userThreeID = res.body.userID;
          done();
        });
    });
    
  
  /**
   * Test case: should register a new user without a tier with the default 1.
   */
  it("should register a new user without a tier with the default 3", function (done) {
    chai
      .request(apiEndpoint)
      .post("/register")
      .send({})
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("tier").that.equals(3);
        userID = res.body.userID;
        done();
      });
  });

  /**
   * Test case: should shorten a URL.
   */
  it("should shorten a URL", function (done) {
    chai
      .request(apiEndpoint)
      .post("/shorten")
      .send({
        userID: userID,
        url: "https://www.youtube.com/watch?v=FW0HIeP-maw&ab_channel=theRadBrad",
        urlLength: "7",
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message").that.equals("Success");
        expect(res.body).to.have.property("userID").that.equals(userID);
        expect(res.body).to.have.property("url");
        expect(res.body).to.have.property("urlID");
        urlCode = res.body.urlID;
        done();
      });
  });

  /**
   * Test case: should not shorten a URL with urlLength less than 6.
   */
  it("should not shorten a URL with urlLength less than 6", function (done) {
    chai
      .request(apiEndpoint)
      .post("/shorten")
      .send({
        userID: userID,
        url: "https://www.youtube.com/watch?v=FW0HIeP-maw&ab_channel=theRadBrad",
        urlLength: "5",
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property("message")
          .that.equals("Length can't not be lower than 6");
        done();
      });
  });

  /**
   * Test case: should not shorten a URL with an invalid userID.
   */
  it("should not shorten a URL with an invalid userID", function (done) {
    chai
      .request(apiEndpoint)
      .post("/shorten")
      .send({
        userID: "123",
        url: "https://www.example.com",
        urlLength: "6",
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property("message")
          .that.includes("Invalid userID");
        done();
      });
  });

  /**
   * Test case: should not shorten a URL without providing userID.
   */
  it("should not shorten a URL without a userID", function (done) {
    chai
      .request(apiEndpoint)
      .post("/shorten")
      .send({
        url: "https://www.example.com",
        urlLength: "6",
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property("message")
          .that.includes("Missing userID");
        done();
      });
  });

  /**
   * Test case: should redirect to the original URL when a short URL is accessed.
   */
  it("should redirect to the original URL when a short URL is accessed", function (done) {
    chai
      .request(apiEndpoint)
      .get(`/${urlCode}`)
      .redirects(0) // to avoid following the redirect
      .end(function (err, res) {
        expect(res).to.redirectTo(
          "https://www.youtube.com/watch?v=FW0HIeP-maw&ab_channel=theRadBrad"
        );
        done();
      });
  });
  tier1Limit = 20
  it(`should only allow a user with Tier 1 to make ${tier1Limit} requests`, async function() {
    this.timeout(10000); // Increase timeout for the test case since it involves multiple requests

    // Make the maximum number of allowed requests
    for (let i = 0; i <= tier1Limit; i++) {
      const res = await chai.request(apiEndpoint)
        .post('/shorten')
        .send({
          userID: userOneID,
          url: `http://example.com/${i}`,
          urlLength: 7
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('urlID');
    }

    // Attempt one more request that should fail due to exceeding the limit
    const resExceed = await chai.request(apiEndpoint)
      .post('/shorten')
      .send({
        userID: userOneID,
        url: "http://example.com/exceed",
        urlLength: 7
      });

    expect(resExceed).to.have.status(400);
    expect(resExceed.body).to.have.property('message').that.includes('Exceed Maximum Request');
  });

  tier2Limit = 10
  it(`should only allow a user with Tier 2 to make ${tier2Limit} requests`, async function() {
    this.timeout(10000); // Increase timeout for the test case since it involves multiple requests

    // Make the maximum number of allowed requests
    for (let i = 0; i <= tier2Limit; i++) {
      const res = await chai.request(apiEndpoint)
        .post('/shorten')
        .send({
          userID: userTwoID,
          url: `http://example.com/${i}`,
          urlLength: 7
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('urlID');
    }

    // Attempt one more request that should fail due to exceeding the limit
    const resExceed = await chai.request(apiEndpoint)
      .post('/shorten')
      .send({
        userID: userTwoID,
        url: "http://example.com/exceed",
        urlLength: 7
      });

    expect(resExceed).to.have.status(400);
    expect(resExceed.body).to.have.property('message').that.includes('Exceed Maximum Request');
  });

  tier3Limit = 5
  it(`should only allow a user with Tier 3 to make ${tier3Limit} requests`, async function() {
    this.timeout(10000); // Increase timeout for the test case since it involves multiple requests

    // Make the maximum number of allowed requests
    for (let i = 0; i <= tier3Limit; i++) {
      const res = await chai.request(apiEndpoint)
        .post('/shorten')
        .send({
          userID: userThreeID,
          url: `http://example.com/${i}`,
          urlLength: 7
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('urlID');
    }

    // Attempt one more request that should fail due to exceeding the limit
    const resExceed = await chai.request(apiEndpoint)
      .post('/shorten')
      .send({
        userID: userThreeID,
        url: "http://example.com/exceed",
        urlLength: 7
      });

    expect(resExceed).to.have.status(400);
    expect(resExceed.body).to.have.property('message').that.includes('Exceed Maximum Request');
  });

  // Add more tests 
});
