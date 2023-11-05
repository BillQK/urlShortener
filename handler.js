"use strict";

const userManager = require("./userManager");
const urlManager = require("./urlManager");

const BASE_URL = process.env.API_END_POINT;

/**
 * Registers a user.
 * @param {Object} event - The event object.
 * @returns {Object} - The response object.
 */
module.exports.registerUser = async (event) => {
  const body = JSON.parse(event.body);

  try {
    const user = userManager.createUser(body);
    await userManager.saveUser(user);
    return createResponse(200, user);
  } catch (error) {
    return createResponse(400, { message: error.message });
  }
};

/**
 * Shortens a URL.
 * @param {Object} event - The event object.
 * @returns {Object} - The response object.
 */
module.exports.shortenUrl = async (event) => {
  const body = JSON.parse(event.body);
  const userID = body.userID;
  const longUrl = body.url;
  const codeLength = body.urlLength;

  if (!userID) {
    return createResponse(400, { message: "Missing userID" });
  }

  try {
    const userExist = await userManager.checkUserIDExist(userID);
    if (userExist) {
      const { userTier, userRequestCount } = await userManager.getUserData(
        userID
      );
      let maxRequestCount;
      switch (userTier) {
        case 1:
          maxRequestCount = 20;
          break;
        case 2:
          maxRequestCount = 10;
          break;
        case 3:
          maxRequestCount = 5;
          break;
        default:
          return createResponse(400, { message: "Unknown Tier!" });
      }

      if (userRequestCount >= maxRequestCount) {
        throw new Error(`Exceed Maximum Request for Tier ${userTier}`);
      } else {
        return await processUrl(codeLength, longUrl, userID);
      }
    }
  } catch (error) {
    return createResponse(400, { message: error.message });
  }
};

/**
 * Processes the URL by generating a short URL ID, saving the URL to the database, updating the user's request count, and returning a response object.
 * @param {number} codeLength - The length of the short URL ID.
 * @param {string} longUrl - The long URL.
 * @param {string} userID - The user ID.
 * @returns {Object} - The response object.
 */
const processUrl = async (codeLength, longUrl, userID) => {
  try {
    const shortUrlID = urlManager.createUrlID(codeLength);
    await urlManager.saveUrl(shortUrlID, longUrl, userID);
    await userManager.updateRequestCount(userID);
    return createResponse(200, {
      message: `Success`,
      userID: userID,
      urlID: shortUrlID,
      url: `${BASE_URL}/${shortUrlID}`,
    });
  } catch (error) {
    throw error;
  }
};
/**
 * Handles the getHistory request by retrieving the user's URL history and returning a response object.
 * @param {Object} event - The event object.
 * @returns {Object} - The response object.
 */
module.exports.getHistory = async (event) => {
  const userID = event.pathParameters.userID;

  if (!userID) {
    return createResponse(400, { message: "Missing userID" });
  }

  try {
    const userExist = await userManager.checkUserIDExist(userID);
    if (userExist) {
      const userUrls = await urlManager.getUrls(userID);

      return createResponse(200, {
        message: `Success`,
        userID: userID,
        urls: userUrls,
      });
    }
  } catch (error) {
    return createResponse(400, { message: error.message });
  }
};

/**
 * Redirects to the original URL.
 * @param {Object} event - The event object.
 * @returns {Object} - The response object.
 */
module.exports.redirectUrl = async (event) => {
  const shortUrlCode = event.pathParameters.shortUrl;
  try {
    const originalUrl = await urlManager.getOriginalUrl(shortUrlCode);
    if (!originalUrl) {
      return createResponse(404, { error: "Url Not Found." });
    }

    return {
      statusCode: 301,
      headers: {
        Location: originalUrl,
      },
    };
  } catch (error) {
    return createResponse(500, { message: error.message });
  }
};

/**
 * Creates a response object.
 * @param {number} statusCode - The status code.
 * @param {Object} message - The response message.
 * @returns {Object} - The response object.
 */
const createResponse = (statusCode, message) => {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };

  return response;
};
