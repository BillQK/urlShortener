"user strict";

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.userTableName;

/**
 * Checks if a user ID exists in the user table.
 * @param {string} userID - The user ID.
 * @returns {Promise<boolean>} - True if the user ID exists, false otherwise.
 * @throws {Error} - If there is an error checking the user ID.
 */
module.exports.checkUserIDExist = async (userID) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userID: userID,
    },
  };
  try {
    const data = await dynamo.get(params).promise();
    if (!data.Item) {
      throw new Error("Invalid userID");
    }
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the request count for the specified user ID.
 * @param {string} userID - The user ID.
 * @returns {Promise} - A promise that resolves when the request count is updated.
 * @throws {Error} - If there is an error updating the request count.
 */
module.exports.updateRequestCount = async (userID) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userID: userID,
    },
    UpdateExpression: "SET requestCounter = requestCounter + :val",
    ExpressionAttributeValues: {
      ":val": 1,
    },
  };
  try {
    await dynamo.update(params).promise();
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves the user data associated with the specified user ID.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object>} - The user data object containing userTier and userRequestCount.
 * @throws {Error} - If the user with the specified user ID is not found.
 */
module.exports.getUserData = async (userId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { userID: userId },
  };
  try {
    const userData = await dynamo.get(params).promise();
    if (userData.Item) {
      return {
        userTier: userData.Item.tier,
        userRequestCount: userData.Item.requestCounter,
      };
    } else {
      throw new Error(`User with ${userId} not found.`);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a user object based on the provided body.
 * @param {Object} body - The body object containing user information.
 * @returns {Object} - The created user object.
 */
module.exports.createUser = (body) => {
  //TODO: create a user Object
  //With the tier list
  const user = {
    userID: uuidv4(),
    tier: body.tier ? body.tier : 3,
    requestCounter: 0,
    createAt: new Date().toISOString(),
  };

  return user;
};

/**
 * Saves a user object into the user table.
 * @param {Object} user - The user object to be saved.
 * @returns {Promise} - A promise that resolves when the user is saved.
 */
module.exports.saveUser = async (user) => {
  //TODO: save user into the user Table
  const params = {
    TableName: TABLE_NAME,
    Item: user,
  };

  return await dynamo.put(params).promise();
};
