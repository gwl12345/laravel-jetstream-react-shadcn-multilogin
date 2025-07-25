<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Magic Link - {{ $appName }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; line-height: 1.5; color: #09090b;">

    <!-- Main Container -->
    <div style="width: 100%; background-color: #fafafa; padding: 48px 16px;">

        <!-- Email Container -->
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e4e4e7; overflow: hidden;">

            <!-- Header -->
            <div style="background-color: #09090b; padding: 32px 32px 24px 32px; text-align: center;">
                <div style="background-color: #ffffff; width: 48px; height: 48px; border-radius: 6px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                    <img src="https://laravel.com/img/notification-logo.png" style="width: 48px; height: 48px;" class="logo" alt="Laravel Logo">
                </div>
                <h1 style="color: #fafafa; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">
                    {{ $appName }}
                </h1>
                <p style="color: #a1a1aa; margin: 8px 0 0; font-size: 14px; font-weight: 400;">
                    Email Login
                </p>
            </div>

            <!-- Content Body -->
            <div style="padding: 32px;">

                <!-- Greeting -->
                <div style="margin-bottom: 24px;">
                    <h2 style="color: #09090b; margin: 0 0 8px; font-size: 18px; font-weight: 600;">
                        Hello {{ $userName }},
                    </h2>
                    <p style="color: #71717a; margin: 0; font-size: 14px; line-height: 1.5;">
                        You requested a login link for your account. Click the button below to access your account.
                    </p>
                </div>

                <!-- Magic Link Button -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 32px 0;">
                  <tr>
                    <td align="center">
                      <a href="{{ $magicLink }}"
                         style="display: inline-block; background-color: #09090b; color: #fafafa; text-decoration: none; font-weight: 500; font-size: 14px; padding: 12px 24px; border-radius: 6px; border: 1px solid #09090b; transition: all 0.2s ease;">
                        Access Your Account
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Security Information -->
                <div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 6px; padding: 16px; margin: 24px 0;">
                    <h3 style="color: #09090b; margin: 0 0 8px; font-size: 14px; font-weight: 600;">
                        Security Information
                    </h3>
                    <ul style="color: #71717a; margin: 0; padding: 0 0 0 16px; font-size: 13px; line-height: 1.4;">
                        <li style="margin-bottom: 4px;">This link will expire in 15 minutes</li>
                        <li style="margin-bottom: 4px;">Link can only be used once</li>
                        <li>Valid for any device or browser</li>
                    </ul>
                </div>

                <!-- Alternative Access -->
                <div style="margin: 24px 0;">
                    <p style="color: #71717a; margin: 0 0 8px; font-size: 13px; font-weight: 500;">
                        Alternative access:
                    </p>
                    <div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 4px; padding: 12px; word-break: break-all; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, monospace; font-size: 11px; color: #52525b;">
                        {{ $magicLink }}
                    </div>
                </div>

                <!-- Help Information -->
                <div style="border-top: 1px solid #e4e4e7; padding-top: 24px; margin-top: 32px;">
                    <p style="color: #71717a; margin: 0; font-size: 13px; line-height: 1.4;">
                        If you did not request this login link, please disregard this email. Your account security has not been compromised.
                    </p>
                </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #f4f4f5; padding: 24px 32px; border-top: 1px solid #e4e4e7;">
                <p style="color: #71717a; margin: 0; font-size: 12px; text-align: center;">
                    This message was sent by {{ $appName }}
                </p>
                <p style="color: #a1a1aa; margin: 4px 0 0; font-size: 11px; text-align: center;">
                    This is an automated message. Please do not reply.
                </p>
            </div>

        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 24px;">
            <p style="color: #a1a1aa; margin: 0; font-size: 11px;">
                © {{ date('Y') }} {{ $appName }}. All rights reserved.
            </p>
        </div>

    </div>

</body>
</html>
