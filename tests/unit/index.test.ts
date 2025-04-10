import { parse } from "../../src/index.js";

console.log("Tests Failing? Make sure you've run `npm run init-smart-link`");

describe("parse function", () => {
  it("should return SmartLinkActionResult when no transactions are present", () => {
    const result = parse();
    expect(result).toHaveProperty("successMessage");
    expect(result).toHaveProperty("failureMessage");
    expect(result).not.toHaveProperty("transactions");
  });

  it("should return SmartLinkUserTxInteraction when transactions are present", () => {
    const input = {
      transactions: [
        { blockchainType: "ARBITRUM", UnsignedTransaction: "0x123" },
      ],
    };
    const result = parse(input);
    expect(result).toHaveProperty("successMessage");
    expect(result).toHaveProperty("failureMessage");
    expect(result).toHaveProperty("transactions");
  });
});
