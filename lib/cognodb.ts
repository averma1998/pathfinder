import neo4j, { Driver } from "neo4j-driver";

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri) {
  throw new Error("COGNODB_URI is not configured");
}

if (!username) {
  throw new Error("COGNODB_USERNAME is not configured");
}

if (!password) {
  throw new Error("COGNODB_PASSWORD is not configured");
}

declare global {
  // eslint-disable-next-line no-var
  var cognodbDriver: Driver | undefined;
}

export const driver =
  global.cognodbDriver ??
  neo4j.driver(
    uri,
    neo4j.auth.basic(username, password)
  );

if (process.env.NODE_ENV !== "production") {
  global.cognodbDriver = driver;
}