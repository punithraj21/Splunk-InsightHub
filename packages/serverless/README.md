# Serverless Framework Node HTTP API on AWS

This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.

## Usage

### Deployment

```
$ serverless deploy
```

After deploying, you should see output similar to:

```bash
Deploying aws-node-http-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-http-api-project-dev (152s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  hello: aws-node-http-api-project-dev-hello (1.9 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [http event docs](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/).

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Which should result in response similar to the following (removed `input` content for brevity):

```json
{
  "message": "Go Serverless v2.0! Your function executed successfully!",
  "input": {
    ...
  }
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function hello
```

Which should result in response similar to the following:

```
{
  "statusCode": 200,
  "body": "{\n  \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n  \"input\": \"\"\n}"
}
```

Alternatively, it is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

To learn more about the capabilities of `serverless-offline`, please refer to its [GitHub repository](https://github.com/dherault/serverless-offline).

## Invoking Function with args in local

```
serverless invoke local --function listDashboards -d "{\"body\": \"{\\\"username\\\":\\\"username\\\",\\\"password\\\":\\\"password\\\"}\"}"

serverless invoke local --function listDashboards -p event.json
```

## All Available endpoints

```
  POST - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/dashboards
  POST - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/reports
  POST - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/fields
  POST - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/apps
  POST - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/storeAllDataToDB
  GET - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/list
  GET - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/overview
  GET - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/typeSenseIndexData
  GET - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/search
  POST - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/storeSearches
  POST - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/updateMetaLabel
  POST - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/updateClassification
  POST - https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev/login

```
