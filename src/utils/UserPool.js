import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "ap-south-1_UGS66VEyd",
    ClientId: "5vhhid5ak9k9ul7uqg42clfehv",
}

export default new CognitoUserPool(poolData);