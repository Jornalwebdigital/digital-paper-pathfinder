export type AdPlacement = "aboveSearch" | "belowSearch" | "belowContent";

export type AdUnit = {
  key: string;
  scriptSrc: string;
  width: number;
  height: number;
  params: Record<string, string>;
};

/*
 * MORE — CENTRAL DE ANÚNCIOS
 *
 * Este é o único arquivo que você precisa alterar para trocar os anúncios.
 * Cole a chave e o endereço do script de cada anúncio nos três espaços abaixo.
 * Você pode usar códigos diferentes em cada posição.
 */
export const AD_UNITS: Record<AdPlacement, AdUnit> = {
  aboveSearch: {
    key: "c2f484876794ac0d5180d900c7c12375",
    scriptSrc:
      "https://www.highrevenueformat.com/c2f484876794ac0d5180d900c7c12375/invoke.js",
    width: 790,
    height: 90,
    params: {},
  },
  belowSearch: {
    key: "c2f484876794ac0d5180d900c7c12375",
    scriptSrc:
      "https://www.highrevenueformat.com/c2f484876794ac0d5180d900c7c12375/invoke.js",
    width: 790,
    height: 90,
    params: {},
  },
  belowContent: {
    key: "c2f484876794ac0d5180d900c7c12375",
    scriptSrc:
      "https://www.highrevenueformat.com/c2f484876794ac0d5180d900c7c12375/invoke.js",
    width: 790,
    height: 90,
    params: {},
  },
};