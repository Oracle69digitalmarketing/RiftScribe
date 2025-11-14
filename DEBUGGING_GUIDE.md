# Frontend-Backend Communication Debugging Guide

## Issues Found & Fixed:

### 1. **Missing /generate-saga Route**
**Problem:** The API Gateway template only had a root method (ANY on `/`), but the frontend tries to POST to `/generate-saga`.
**Fix:** Added proper resource and POST method for `/generate-saga` path.

### 2. **Missing CORS Preflight (OPTIONS) Method**
**Problem:** Browsers require an OPTIONS method for CORS preflight requests before making POST requests.
**Fix:** Added OPTIONS method with proper CORS headers on the `/generate-saga` resource.

### 3. **Wrong API Endpoint in .env**
**Problem:** `.env` pointed to old endpoint: `https://l8vqribcql.execute-api.eu-central-1.amazonaws.com/Prod/generate-saga/`
**Fix:** Updated to placeholder: `https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/production/generate-saga/`

### 4. **Region Mismatch**
**Problem:** Old endpoint was in `eu-central-1`, new template uses `us-east-1`.
**Fix:** Corrected region in .env file.

### 5. **Stage Name Mismatch**
**Problem:** Old endpoint used `/Prod/` stage, new template uses `/production/`.
**Fix:** Updated stage name in .env.

## How to Deploy and Update Endpoint:

### Step 1: Build the SAM application
```bash
cd /workspaces/RiftScribe/aws
sam build
```

### Step 2: Deploy the stack
```bash
sam deploy \
  --template-file template.yaml \
  --stack-name RiftScribe-backend \
  --parameter-overrides \
    MatchDataBucketName=rift-rewind-match-history-dataset-2025 \
    GeneratedImagesBucketName=rift-scribe-generated-images-2025 \
    SagaCacheTableName=RiftScribeSagaCache \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

### Step 3: Get the actual API endpoint
```bash
aws cloudformation describe-stacks \
  --stack-name RiftScribe-backend \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`RiftScribeApiEndpoint`].OutputValue' \
  --output text
```

### Step 4: Update .env with the actual endpoint
Replace the placeholder in `.env` with the actual API endpoint from Step 3:
```
VITE_API_ENDPOINT=https://<ACTUAL_API_ID>.execute-api.us-east-1.amazonaws.com/production/generate-saga/
```

### Or use the provided script:
```bash
cd /workspaces/RiftScribe
bash UPDATE_ENV.sh
```

## How Frontend-Backend Communication Works:

1. **Frontend (App.tsx)** → Calls `generateSaga(summonerName, selectedPersona)`
2. **API Client (server/api.ts)** → Makes POST request to `VITE_API_ENDPOINT`
3. **API Gateway** → Routes POST `/generate-saga` to Lambda function
4. **Lambda Handler (handler.ts)** → 
   - Parses summonerName and persona
   - Fetches player data
   - Calls Bedrock to generate saga
   - Returns saga and insights
5. **Response** → Sent back to frontend as JSON

## Testing the Connection:

### Test with curl:
```bash
curl -X POST https://<API_ENDPOINT>/production/generate-saga/ \
  -H "Content-Type: application/json" \
  -d '{"summonerName": "PlayerOne", "persona": {"name": "Ionian Scholar", "prompt": "..."}}'
```

### Check CloudWatch Logs:
```bash
aws logs tail /aws/lambda/RiftScribeFunction --follow --region us-east-1
```

## Common Issues:

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Wrong endpoint path | Check `.env` matches API Gateway path |
| CORS Error | Missing OPTIONS method | Ensure OPTIONS method is deployed |
| 500 Error | Lambda execution error | Check CloudWatch logs |
| Missing env vars | Not passing to Lambda | Verify Environment Variables in template |
| Wrong region | Stack deployed in different region | Update `.env` region |

## Files Modified:
- `/workspaces/RiftScribe/aws/template.yaml` - Added `/generate-saga` resource and OPTIONS method
- `/workspaces/RiftScribe/.env` - Updated endpoint URL format
- `/workspaces/RiftScribe/UPDATE_ENV.sh` - Script to auto-update endpoint after deployment
