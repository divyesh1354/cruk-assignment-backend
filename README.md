# CRUK Backend Assignment

## AWS CDK v2 Lambda Function Donation API

Technology Used: AWS CDK, Node.js, Typescript

Install node modules and AWS CLI 

```bash
npm install
```

For AWS CLI installation use this link [[HERE](https://awscli.amazonaws.com/AWSCLIV2.pkg)]

After Installation, configure your AWS Credentials using below command. This command will set your AWS ACCOUNT ID and REGION.

```bash
aws configure
```

Then create .env file and add this ENV Variables in it.

```bash
TABLE_NAME
```

## Generating CloudFormation templates with CDK Synth

Next, we are going to generate and print the CloudFormation equivalent of the CDK stack.

In other words, we're going to synthesize a CloudFormation template, based on the stack we've written in ``lib/recruitment-nodejs-test-stack.ts``

To do that we have to use the synth command.

```bash 
cdk synth
```


```bash 
cdk bootstrap
```


## Deploying our CloudFormation Stack

At this point our template has been generated and stored in the ``cdk.out`` directory. We're ready to deploy our CloudFormation stack.

Run the deploy command:

```bash 
cdk deploy
```

Now let's run our API.

```bash
URL: https://97v0ogsu8g.execute-api.eu-west-2.amazonaws.com/prod/donations
Method: POST
Header: Content-Type: application/json
Parameter: 
{
  "email": "test@gmail.com",
  "name": "test",
  "mobile": "7878787878",
  "donationAmount": 10
}
```


## Test AWS CDK Lambda function (Unit Test)

I also implemented test cases for this assignments. I have used JEST for unit testing.

To run unit tests, use this command:

```bash
npm test
```

Thank you and I hope you will like it!
