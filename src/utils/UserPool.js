import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID || "ap-south-1_UGS66VEyd",
    ClientId: process.env.REACT_APP_CLIENT_ID || "5vhhid5ak9k9ul7uqg42clfehv",
}

export default new CognitoUserPool(poolData);