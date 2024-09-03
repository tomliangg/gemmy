import { GenerateContentResult } from "@google/generative-ai";

// modified from: https://stackoverflow.com/a/51332115
export function retry(
  fn: () => Promise<GenerateContentResult>,
  retries = 3,
  err?: Error
): Promise<string> {
  if (retries < 0) {
    return Promise.reject(err);
  }
  return fn()
    .then((result) => {
      // for genAI.getGenerativeModel() api call, we can't tell if it gets "RECITATION" error until we parse the text
      return result.response.text();
    })
    .catch((err) => {
      console.warn("failed! Remaining retries:", retries);
      console.error("Error is:", err);
      return retry(fn, retries - 1, err);
    });
}
