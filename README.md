<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo">
  </a>
</p>

<h1 align="center">Laravel Jetstream React Shadcn Multi-Login</h1>

<p align="center">
  <strong>A modern Laravel starter kit with multiple authentication methods</strong>
</p>

## 🚀 About

This project extends the excellent [Laravel Jetstream React Shadcn](https://github.com/gwl12345/laravel-jetstream-react-shadcn) starter kit by adding **multiple authentication methods** for enhanced user experience and security.

### 🔐 Authentication Methods

- **🔑 Traditional Form Login** - Classic email/password authentication
- **✨ Magic Link Login** - Passwordless authentication via email
- **🔒 Passkey Authentication** - Modern WebAuthn with biometrics, patterns, and security keys

## ✨ Features

### 🎨 **Modern Tech Stack**
- **[Laravel 12](https://laravel.com/)** - Robust PHP backend framework
- **[Laravel Jetstream](https://jetstream.laravel.com/)** - Application scaffolding with teams support
- **[React](https://react.dev/)** - Modern frontend library with TypeScript
- **[Inertia.js](https://inertiajs.com/)** - Modern monolith approach
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible UI components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### 🔐 **Advanced Authentication**
- **[Laragear WebAuthn](https://github.com/Laragear/WebAuthn)** - Passkey authentication (fingerprints, Face ID, security keys)
- **Magic Link Authentication** - Secure, passwordless login via email
- **Two-Factor Authentication** - Built-in 2FA support via Jetstream
- **Session Management** - View and manage active browser sessions
- **Account Security** - Password updates, account deletion

### 🎯 **User Experience**
- **Tabbed Login Interface** - Clean, organized authentication options
- **Responsive Design** - Works perfectly on all devices
- **Dark/Light Mode** - Theme switching with system preference detection
- **Toast Notifications** - Real-time feedback using Sonner
- **Loading States** - Smooth interactions with loading indicators

### 🛡️ **Security Features**
- **Rate Limiting** - Protection against brute force attacks
- **CSRF Protection** - Built-in security tokens
- **Encrypted Credentials** - WebAuthn public keys encrypted in database
- **Session Security** - Secure session management
- **Email Verification** - Verified email requirement option

## 🔐 Authentication Setup

### Magic Link Configuration

Magic link authentication is ready to use out of the box. Just ensure your mail configuration is set up correctly in your `.env` file.

**Features:**
- Rate limiting (3 attempts per email/5 minutes)
- Secure, time-limited tokens
- Clean email templates
- Automatic login on link click

### WebAuthn/Passkey Setup

Passkeys work with HTTPS in production. For local development:

1. **Use Laravel Valet with TLS** (recommended for macOS)
   ```bash
   valet secure your-app-name
   ```

2. **Use `localhost` with appropriate browser flags**

3. **Or use Laravel Herd with secure site enabled (SSL)** (For Windows/macOS)

**Supported Authenticators:**
- 📱 Face ID / Touch ID (iOS/macOS)
- 🔒 Windows Hello
- 📱 Android Biometrics
- 🔑 Hardware Security Keys (YubiKey, etc.)
- 📱 Platform Authenticators

### Adding More Authentication Methods

The tabbed login interface makes it easy to add more authentication methods:

1. Add a new tab in `resources/js/pages/Auth/Login.tsx`
2. Create the corresponding controller
3. Add routes in `routes/web.php`
4. Implement the frontend logic

## 📁 Project Structure

```
├── app/
│   ├── Http/Controllers/
│   │   ├── MagicLinkController.php      # Magic link authentication
│   │   ├── PasskeyController.php        # Passkey management
│   │   └── WebAuthn/                    # WebAuthn controllers
│   ├── Models/
│   │   └── User.php                     # Extended user model
│   └── Notifications/
│       └── MagicLinkNotification.php    # Magic link emails
├── resources/js/
│   ├── components/ui/
│   │   └── login-tabs.tsx               # Custom login tabs
│   ├── pages/Auth/
│   │   └── Login.tsx                    # Multi-method login page
│   └── pages/Profile/
│       └── Passkey.tsx                  # Passkey management
└── database/migrations/
    └── *_create_webauthn_credentials.php # WebAuthn database schema
```

## 🙏 Acknowledgments

- **[gwl12345/laravel-jetstream-react-shadcn](https://github.com/gwl12345/laravel-jetstream-react-shadcn)** - Base starter kit
- **[Laragear/WebAuthn](https://github.com/Laragear/WebAuthn)** - WebAuthn implementation for Laravel
- **Laravel Team** - For the amazing framework and Jetstream
- **shadcn** - For the beautiful UI components
- **Vercel** - For the React ecosystem

## 📚 Documentation

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Jetstream](https://jetstream.laravel.com)
- [React Documentation](https://react.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Laragear WebAuthn](https://laragear.github.io/WebAuthn/)
- [WebAuthn Guide](https://webauthn.guide/)
