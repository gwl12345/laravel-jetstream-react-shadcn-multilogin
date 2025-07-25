import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface TwoFactorForm {
  code: string;
  recovery_code: string;
}

export default function TwoFactorChallenge() {
  const [recovery, setRecovery] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm<Required<TwoFactorForm>>({
    code: '',
    recovery_code: '',
  });
  const recoveryCodeRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  const toggleRecovery = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const isRecovery = !recovery;
    setRecovery(isRecovery);
    setTimeout(() => {
      if (isRecovery) {
        recoveryCodeRef.current?.focus();
        setData('code', '');
      } else {
        codeRef.current?.focus();
        setData('recovery_code', '');
      }
    }, 100);
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('two-factor.login'));
  };

  return (
    <AuthLayout
      title="Two-factor authentication"
      description={
        recovery
          ? 'Please confirm access to your account by entering one of your emergency recovery codes.'
          : 'Please confirm access to your account by entering the authentication code provided by your authenticator application.'
      }
    >
      <Head title="Two-Factor Confirmation" />
      <form className="flex flex-col gap-6" onSubmit={submit}>
        <div className="grid gap-6">
          {recovery ? (
            <div className="grid gap-2">
              <Label htmlFor="recovery_code">Recovery code</Label>
              <Input
                id="recovery_code"
                type="text"
                autoComplete="one-time-code"
                value={data.recovery_code}
                onChange={e => setData('recovery_code', e.target.value)}
                ref={recoveryCodeRef}
                placeholder="Enter your recovery code"
                autoFocus
              />
              <InputError message={errors.recovery_code} className="mt-2" />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="code">Authentication code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={data.code}
                onChange={e => setData('code', e.target.value)}
                ref={codeRef}
                placeholder="Enter your authentication code"
                autoFocus
              />
              <InputError message={errors.code} className="mt-2" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <a
            className="text-sm text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500 cursor-pointer"
            onClick={toggleRecovery}
            tabIndex={5}
          >
            {recovery ? 'Use an authentication code' : 'Use a recovery code'}
          </a>
          <Button type="submit" className="ml-4 w-32" disabled={processing} tabIndex={4}>
            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Log in
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
