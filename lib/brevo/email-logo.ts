/** Publiczny PNG logo do maili (klienci poczty nie renderują SVG). */
export const EMAIL_LOGO_URL =
  "https://kalwgkqvqomezmtyaiwe.supabase.co/storage/v1/object/public/assets/zainaty-logo-big.svg";

export function emailLogoImgHtml(): string {
  return `<img src="${EMAIL_LOGO_URL}" width="160" height="73" alt="Z AI na Ty" style="display:block;margin:0 auto;width:160px;height:auto;border:0;outline:none;text-decoration:none;" />`;
}
