# AWS Services Integration API
This is a small ExpressJS app to test out AWS services.

# How to Run
```
Build `yarn run build`
Run on deloyment `yarn start`
Run locally `yarn run start:dev`
Run test `yarn test`
```

# Library Stack
```
AWS SDK - @aws-sdk
Simple IOC Provider - tsyringe
Logger - winston
Unit Testing/Code Coverage - jest/supertest

```

# Existing APIs (WIP for Swagger Docs)
```
GET /config - get latest AWS Appconfig featureflags (will get local file version if not existent)
PUT /config/refresh - force refresh cached featureflags

```
