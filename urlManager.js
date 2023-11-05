"use strict";

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto");

const TABLE_NAME = process.env.urlTableName;

/**
 * Generates a unique code of the specified length.
 * @param {number} length - The length of the code.
 * @returns {string} - The generated code.
 * @throws {Error} - If the length is lower than 6.
 */
const generateUniqueCode = (length) => {
  // Check if the length is lower than 6
  if (length < 6) {
    throw new Error("Length can't not be lower than 6");
  }
  const bytes = Math.ceil(length / 2);
  const buffer = crypto.randomBytes(bytes).toString("hex");
  return buffer.slice(0, length);
}

/**
 * Creates a unique URL ID of the specified length.
 * @param {number} length - The length of the URL ID.
 * @returns {string} - The generated URL ID.
 */
module.exports.createUrlID = (length) => {
  // Generate a unique code of the specified length
  const shortCode = generateUniqueCode(length);
  return shortCode;
};

/**
 * Saves the URL to the database.
 * @param {string} urlID - The URL ID.
 * @param {string} longUrl - The long URL.
 * @param {string} userID - The user ID.
 * @returns {Promise<{ success: boolean, item: object }>} - The result of the save operation.
 * @throws {Error} - If there is an error saving the URL to the database.
 */
module.exports.saveUrl = async (urlID, longUrl, userID) => {
  const urlItem = {
    urlID: urlID,
    longUrl: longUrl,
    userID: userID,
    createAt: new Date().toISOString(),
  };
  const params = {
    TableName: TABLE_NAME,
    Item: urlItem,
  };
  try {
    await dynamo.put(params).promise();
    return { success: true, item: urlItem };
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves the URLs associated with the specified user ID.
 * @param {string} userID - The user ID.
 * @returns {Promise<Array>} - The URLs associated with the user ID.
 * @throws {Error} - If there is an error retrieving the URLs.
 */
module.exports.getUrls = async (userID) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "UserIndex",
    KeyConditionExpression: "userID = :userID",
    ExpressionAttributeValues: {
      ":userID": userID,
    },
  };

  try {
    const result = await dynamo.query(params).promise();
    return result.Items;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves the original URL associated with the specified URL ID.
 * @param {string} urlID - The URL ID.
 * @returns {Promise<string | null>} - The original URL associated with the URL ID, or null if not found.
 * @throws {Error} - If there is an error fetching the original URL.
 */
module.exports.getOriginalUrl = async (urlID) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      urlID: urlID,
    },
  };
  try {
    const url = await dynamo.get(params).promise();
    if (!url.Item) {
      throw new Error("URL not found");
    }
    return url.Item.longUrl;
  } catch (error) {
    throw error;
  }
};
