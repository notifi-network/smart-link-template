import { parse } from "../../src/index.js";

console.log(
  "Tests Failing? Make sure you've run `npm run auth` && `npm run init-smart-link`"
);

describe("Expected Function Output From Action", () => {
  it("should return either SmartLinkActionResult or SmartLinkUserTxInteraction", () => {
    const result = parse();
    expect(result).toBeInstanceOf(Array);
    result.forEach((item) => {
      expect(item).toHaveProperty("successMessage");
      expect(item).toHaveProperty("failureMessage");

      if ("transactions" in item) {
        expect(item.transactions).toBeInstanceOf(Array);
        item.transactions.forEach((transaction) => {
          expect(transaction).toHaveProperty("blockchainType");
          expect(transaction).toHaveProperty("UnsignedTransaction");
        });
      }
    });
  });
});
