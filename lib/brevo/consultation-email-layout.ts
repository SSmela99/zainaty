import { escapeHtml } from "./escape-html";
import { emailLogoImgHtml } from "./email-logo";

export function buildConsultationEmailHtml(input: {
  title: string;
  preheader: string;
  bodyHtml: string;
}): string {
  const title = escapeHtml(input.title);
  const preheader = escapeHtml(input.preheader);

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a1628;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${preheader}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#0a1628;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:480px;background-color:#151414;border-radius:20px;overflow:hidden;">
          <tr>
            <td align="center" bgcolor="#0033ff" style="background-color:#0033ff;padding:18px 24px;">
              ${emailLogoImgHtml()}
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 8px;color:#ffffff;">
              <h1 style="margin:0 0 20px;font-size:24px;line-height:1.25;font-weight:800;color:#ffffff;text-align:center;">
                ${title}
              </h1>
              ${input.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid #2a2a2a;padding-top:18px;font-size:12px;line-height:1.4;color:#a1a1aa;text-align:center;">
                    © Z AI na Ty -
                    <a href="https://zainaty.pl" style="color:#daff02;text-decoration:none;">zainaty.pl</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function consultationDetailLine(label: string, value: string): string {
  return `<p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#ffffff;">
  • <strong>${escapeHtml(label)}:</strong> ${value}
</p>`;
}

export function consultationParagraph(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#ffffff;">
  ${escapeHtml(text)}
</p>`;
}

export function consultationMeetSection(meetUrl: string): string {
  const safeUrl = escapeHtml(meetUrl);

  return `
    <h2 style="margin:24px 0 12px;font-size:18px;line-height:1.3;font-weight:800;color:#ffffff;">
      Jak dołączyć do spotkania?
    </h2>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#ffffff;">
      W godzinie spotkania kliknij poniższy link, aby dołączyć do rozmowy:
    </p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.5;word-break:break-all;">
      <a href="${safeUrl}" target="_blank" style="color:#daff02;text-decoration:underline;">${safeUrl}</a>
    </p>
  `;
}
