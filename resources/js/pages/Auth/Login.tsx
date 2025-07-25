import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle, MailCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { RiFileTextLine, RiMailLine, RiKeyLine } from 'react-icons/ri';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LoginTabs,
  LoginTabsList,
  LoginTabsTrigger,
  LoginTabsContent,
} from '@/components/ui/login-tabs';
import AuthLayout from '@/layouts/auth-layout';
import Webpass from '@laragear/webpass';
import { toast } from 'sonner';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

type EmailForm = {
  email: string;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const { data, setData, post, processing, errors, reset } = useForm<
    Required<LoginForm>
  >({
    email: '',
    password: '',
    remember: false,
  });

  const {
    data: emailData,
    setData: setEmailData,
    post: postEmail,
    processing: emailProcessing,
    errors: emailErrors,
    reset: resetEmail,
  } = useForm<Required<EmailForm>>({
    email: '',
  });

  const submit: FormEventHandler = e => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

    const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();

    postEmail(route('magic-link.send'), {
      onSuccess: () => {
        setSentEmail(emailData.email);
        setMagicLinkSent(true);
      },
      onFinish: () => resetEmail('email'),
    });
  };

  const handlePasskeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success, data, error, user } = await Webpass.assert({path: route('webauthn.login.options'), findCsrfToken: true}, {path: route('webauthn.login'), findCsrfToken: true})

    if (success) {
      router.visit(route('dashboard'));
    }
    if (error) {
      toast.error(<>
        <p>Unable to login with passkey, please try again.</p>
        <p>If problem persists, try other login methods or contact support.</p>
      </>);
    }
    // TODO: Implement passkey login logic
  };

  return (
    <AuthLayout
      title="Log in to your account"
      description="Choose your preferred login method"
    >
      <Head title="Log in" />

      <LoginTabs defaultValue="form" className="w-full">
        <LoginTabsList className="grid w-full grid-cols-3 h-full">
          <LoginTabsTrigger value="form" className="flex flex-col gap-1 h-12">
            <RiFileTextLine className="h-4 w-4" />
            <span className="text-xs">Form</span>
          </LoginTabsTrigger>
          <LoginTabsTrigger value="email" className="flex flex-col gap-1 h-12">
            <RiMailLine className="h-4 w-4" />
            <span className="text-xs">Email</span>
          </LoginTabsTrigger>
          <LoginTabsTrigger
            value="passkey"
            className="flex flex-col gap-1 h-12"
          >
            <RiKeyLine className="h-4 w-4" />
            <span className="text-xs">Passkey</span>
          </LoginTabsTrigger>
        </LoginTabsList>

        <LoginTabsContent value="form" className="mt-6">
          <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  placeholder="email@example.com"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {canResetPassword && (
                    <TextLink
                      href={route('password.request')}
                      className="ml-auto text-sm"
                      tabIndex={5}
                    >
                      Forgot password?
                    </TextLink>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  placeholder="Password"
                />
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={data.remember}
                  onClick={() => setData('remember', !data.remember)}
                  tabIndex={3}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              <Button
                type="submit"
                className="mt-4 w-full"
                tabIndex={4}
                disabled={processing}
              >
                {processing && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                Log in
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <TextLink href={route('register')} tabIndex={5}>
                Sign up
              </TextLink>
            </div>
          </form>
        </LoginTabsContent>

                <LoginTabsContent value="email" className="mt-6">
          {!magicLinkSent ? (
            <form className="flex flex-col gap-6" onSubmit={handleEmailLogin}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email-only">Email address</Label>
                  <Input
                    id="email-only"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="email@example.com"
                    value={emailData.email}
                    onChange={e => setEmailData('email', e.target.value)}
                  />
                  <InputError message={emailErrors.email} />
                </div>

                <Button
                  type="submit"
                  className="mt-4 w-full"
                  disabled={emailProcessing}
                >
                  {emailProcessing && (
                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                  )}
                  <RiMailLine className="h-4 w-4 mr-2" />
                  Send Magic Link
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                We'll send you a secure login link via email
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <MailCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Email sent successfully
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If an account with <strong>{sentEmail}</strong> exists, we've sent you a magic link.
                  Check your email and click the link to log in.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  The link will expire in 15 minutes.
                  Make sure to check your spam folder if you don't see the email.
                </p>

                <Button
                  variant="outline"
                  onClick={() => {
                    setMagicLinkSent(false);
                    setSentEmail('');
                    resetEmail('email');
                  }}
                  className="w-full"
                >
                  ← Send another magic link
                </Button>
              </div>
            </div>
          )}
        </LoginTabsContent>

        <LoginTabsContent value="passkey" className="mt-6">
          <form className="flex flex-col gap-6" onSubmit={handlePasskeyLogin}>
            <div className="grid gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mt-2">
                  Sign in securely with your fingerprint, face, or screen lock
                </p>
                <Button type="submit" className="mt-4 w-full">
                  <RiKeyLine className="h-4 w-4 mr-2" />
                  Use Passkey
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Make sure your device supports passkeys
            </div>
          </form>
        </LoginTabsContent>
      </LoginTabs>

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}
    </AuthLayout>
  );
}
