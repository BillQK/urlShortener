# Project Title

URL Shortener Service

## Project Description

The URL Shortener Service is a serverless application that allows users to shorten long URLs into shorter, more manageable links. It provides a simple and efficient way to share URLs while tracking usage statistics.

## Prerequisites

Before deploying the URL Shortener Service, make sure you have the following prerequisites:

- Node.js (version X.X.X or higher)
- Serverless Framework (version X.X.X or higher)
- AWS account with appropriate permissions

## Installation

To install and set up the URL Shortener Service locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/url-shortener.git`
2. Navigate to the project directory: `cd url-shortener`
3. Install dependencies: `npm install`

## Configuration

The URL Shortener Service can be configured using the `serverless.yml` file. The following configuration options are available:

- `apiEndpoint`: The API endpoint for the URL Shortener Service.
- `bucketName`: The name of the S3 bucket used for deployment.

Make sure to update these configuration options according to your requirements before deploying the service.

## Deployment

To deploy the URL Shortener Service, follow these steps:

1. Configure AWS credentials: `serverless config credentials --provider aws --key YOUR_AWS_ACCESS_KEY --secret YOUR_AWS_SECRET_KEY`
2. Deploy the service: `serverless deploy`

## Usage

Once the URL Shortener Service is deployed, you can use the following API endpoints:

- `POST /register`: Register a new user with the desired tier.
- `POST /shorten`: Shorten a URL for a specific user.
- `GET /shortened-url/{code}`: Retrieve the shortened URL for a specific code.

To use the URL Shortener Service, follow these steps:

1. Start the server: `npm start`
2. Access the service through the provided API endpoints.
3. Register a new user by making a POST request to `/register` with the desired tier (1, 2, or 3).
4. Shorten a URL by making a POST request to `/shorten` with the user ID and the URL to be shortened.
5. Retrieve the shortened URL by making a GET request to `/shortened-url/{code}`, where `{code}` is the code generated for the shortened URL.
6. Access the shortened URL and get redirected to the original URL.

Make sure to replace `{code}` with the actual code generated for the shortened URL.

## Testing

To run the tests for the URL Shortener Service, use the following command:
- `npm test` (!important Hardcoded the apiEndpoint for testing. Change it to your endPoints)

The tests are written using the Mocha testing framework and Chai assertion library.


## Project is Live 

1. Make a POST request to the endpoint https://uovktf6084.execute-api.us-east-1.amazonaws.com/dev/register to register for a userID and tier. If you don't provide a request body, your default tier will be set to 3.
2. Once registered, you can generate a shortened URL by making a POST request to the endpoint https://uovktf6084.execute-api.us-east-1.amazonaws.com/dev/shorten with the userID in the request body. You can also specify the desired length of the shortened URL, which must be greater than 6 characters. If you don't provide a length, the default will be set to 7.
3. The API will respond with a shortened link that you can use to redirect to the original link.

By following these steps, you can register for a userID and tier, generate a shortened URL using your userID, and use the shortened link to redirect to the original link.

Note: The generated link is still long due to AWS pre-generated API, this can be shorten by customize the domain.


//TODO : Add query userID history