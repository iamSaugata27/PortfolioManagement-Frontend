import { Buffer } from "buffer";

export function retrieveDataFromToken(token) {
  const payloadBase64 = token.split(".")[1];
  const decodedJson = Buffer.from(payloadBase64, "base64").toString();
  const decoded = JSON.parse(decodedJson);
  const expiryTime = decoded.exp;
  const portfolioId = decoded.unique_name;
  console.log(portfolioId);
  console.log(expiryTime);
  localStorage.setItem(
    "tokenDetails",
    JSON.stringify({ portfolioId, expiryTime })
  );
  //   return { portfolioId, expiryTime };
}
