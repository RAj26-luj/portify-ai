import {
  cleanupExpiredTokens,
  cleanupOldViews,
} from "./cleanup";

export async function runJobs() {
  await cleanupExpiredTokens();

  await cleanupOldViews();

  return true;
}