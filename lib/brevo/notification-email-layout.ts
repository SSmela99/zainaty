import { escapeHtml } from "./escape-html";

export type NotificationEmailField = {
  label: string;
  value: string;
  href?: string;
};

type BuildNotificationEmailInput = {
  title: string;
  preheader: string;
  intro: string;
  badge?: string;
  highlight?: {
    label: string;
    value: string;
  };
  fields?: NotificationEmailField[];
  messageLabel?: string;
  message?: string;
  footerNote?: string;
};

function renderFieldRow(field: NotificationEmailField): string {
  const safeValue = escapeHtml(field.value);
  const valueCell = field.href
    ? `<a href="${escapeHtml(field.href)}" style="color:#0033ff;text-decoration:none;">${safeValue}</a>`
    : safeValue;

  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ececec;font-size:13px;font-weight:700;color:#71717a;width:140px;vertical-align:top;">
        ${escapeHtml(field.label)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #ececec;font-size:14px;line-height:1.5;color:#151414;vertical-align:top;">
        ${valueCell}
      </td>
    </tr>
  `.trim();
}

export function buildNotificationEmailHtml(
  input: BuildNotificationEmailInput,
): string {
  const fieldsHtml = (input.fields ?? []).map(renderFieldRow).join("");
  const highlightBlock = input.highlight
    ? `
        <div style="margin:0 0 24px;padding:20px;border-radius:16px;background:#fff4f0;border:1px solid #ffd0bc;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f24a00;">
            ${escapeHtml(input.highlight.label)}
          </p>
          <p style="margin:0;font-size:22px;font-weight:800;line-height:1.3;color:#151414;letter-spacing:-0.02em;">
            ${escapeHtml(input.highlight.value)}
          </p>
        </div>
      `.trim()
    : "";
  const messageBlock =
    input.message != null
      ? `
        <p style="margin:24px 0 8px;font-size:13px;font-weight:700;color:#71717a;">
          ${escapeHtml(input.messageLabel ?? "Wiadomość")}
        </p>
        <div style="padding:16px;border-radius:12px;background:#f8f7f4;border:1px solid #ececec;font-size:14px;line-height:1.6;color:#3f3f46;white-space:pre-wrap;">
          ${escapeHtml(input.message).replaceAll("\n", "<br />")}
        </div>
      `.trim()
      : "";

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1eee5;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(input.preheader)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1eee5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#f24a00;padding:24px 28px;text-align:center;">
              <p style="margin:0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">
                Z AI na Ty
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#0033ff;">
                ${escapeHtml(input.badge ?? "Powiadomienie")}
              </p>
              <h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#151414;letter-spacing:-0.02em;">
                ${escapeHtml(input.title)}
              </h1>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#52525b;">
                ${escapeHtml(input.intro)}
              </p>
              ${highlightBlock}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                ${fieldsHtml}
              </table>
              ${messageBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#fafafa;border-top:1px solid #ececec;text-align:center;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#a1a1aa;">
                ${escapeHtml(
                  input.footerNote ??
                    "Wiadomość wygenerowana automatycznie przez formularz na stronie zainaty.pl",
                )}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
