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

Make sure to replace `{code}` with the actual code generated for the shortened URL.

## Testing

To run the tests for the URL Shortener Service, use the following command:
- `npm test` (Hardcode the apiEndpoint. RMB to change it to your endPoints)