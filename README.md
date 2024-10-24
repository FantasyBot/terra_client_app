# Vite + React Client App

### [Terraform Project](https://github.com/FantasyBot/terra_infrastructure_app)

This is a simple client-side React application built using Vite. The app fetches data from an Express backend and displays a list of items. The app is deployed to AWS S3 and uses AWS CloudFront as a CDN for fast and secure delivery.

## Prerequisites

- **Node.js**: v18.20.2 or higher
- **AWS S3 Bucket**: For hosting the built app
- **AWS CloudFront**: For serving the app via CDN

## Deployment

### This project uses GitHub Actions to automate deployments to an AWS S3 bucket and CloudFront for CDN distribution.

### Deployment Workflow

The deploy.yml workflow is triggered on pushes to the main branch. It performs the following tasks:

1. Checkout Code: Clones the repository.
2. Set up Node.js: Installs Node.js version 18.20.2.
3. Install Dependencies: Installs project dependencies.
4. Build the Project: Compiles the React app.
5. Sync with S3: Uploads the built files to the S3 bucket.
6. Invalidate CloudFront Cache: Clears the CloudFront cache to serve the latest version of the app.

## GitHub Actions Workflow (deploy.yml)

```
name: Deploy React App

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18.20.2"

      - name: Install dependencies
        run: npm ci

      - name: Build the app
        run: |
          echo "VITE_API_URL=${{ secrets.VITE_API_URL }}" > .env
          npm run build

      - uses: shinyinc/action-aws-cli@v1.2
      - run: aws s3 sync dist s3://mycompany-name-client-app-bucket
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: eu-central-1

      - name: Invalidate CloudFront...
        uses: chetan/invalidate-cloudfront-action@v2
        env:
          DISTRIBUTION: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
          PATHS: "/"
          AWS_REGION: "eu-central-1"
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Secrets Configuration

#### In your GitHub repository settings, add the following secrets for deployment:

1. `VITE_API_URL` - URL of the backend API
2. `AWS_ACCESS_KEY_ID` - AWS access key for the S3 and CloudFront actions
3. `AWS_SECRET_ACCESS_KEY	` - AWS secret key for the S3 and CloudFront actions
4. `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID for invalidation

### You need to create an IAM User in AWS to generate the required `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` for deployment. Attach the following policies to the IAM user:

- #### AmazonS3FullAccess
- #### CloudFrontFullAccess

#
