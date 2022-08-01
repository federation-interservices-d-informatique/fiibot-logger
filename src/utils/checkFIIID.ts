import { ID_REGEX } from "../Constants.js";

/**
 * Check if an FII ID is present in the message
 */
export const checkFIIID = (content: string): boolean => ID_REGEX.test(content);
