#!/bin/bash
# Script to update .env with the actual API endpoint after deployment
# NOTE: Set AWS credentials via environment variables before running this script

STACK_NAME="RiftScribe-backend"
REGION="eu-central-1"

echo "Fetching API endpoint from CloudFormation stack..."
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`RiftScribeApiEndpoint`].OutputValue' \
  --output text)

if [ -z "$API_ENDPOINT" ]; then
  echo "Error: Could not retrieve API endpoint. Make sure the stack is deployed."
  exit 1
fi

echo "API Endpoint: $API_ENDPOINT"

# Update .env file
sed -i "s|VITE_API_ENDPOINT=.*|VITE_API_ENDPOINT=$API_ENDPOINT|g" .env

echo "Updated .env with API endpoint: $API_ENDPOINT"
