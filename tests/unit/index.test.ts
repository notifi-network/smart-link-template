import { parse } from "../../src/index.js";

console.log(
  "Tests Failing? Make sure you've run `npm run auth` && `npm run init-smart-link`"
);

describe("Expected Function Output From Action", () => {
  it("should return either SmartLinkActionResult or SmartLinkUserTxInteraction", () => {
    const result = parse();
    expect(result).toHaveProperty("successMessage");
    expect(result).toHaveProperty("failureMessage");

    // Type guard to check if result is SmartLinkUserTxInteraction
    if ("transactions" in result) {
      expect(result.transactions).toBeInstanceOf(Array);
      result.transactions.forEach((transaction) => {
        expect(transaction).toHaveProperty("blockchainType");
        expect(transaction).toHaveProperty("UnsignedTransaction");
      });
    }
  });
});
