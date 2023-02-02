import { FII_ID_REGEX } from "@federation-interservices-d-informatique/fiibot-common";

/**
 * Check if an FII ID is present in the message
 */
export const checkFIIID = (content: string): boolean =>
    FII_ID_REGEX.test(content);
