/**
 * @type {import("prettier").Config}
 */
const config = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^(bun|path|os|sys|stream)",
    "<THIRD_PARTY_MODULES>",
    "^@/.*",
    "^../",
    "^./",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  quoteProps: "preserve",
};

export default config;
