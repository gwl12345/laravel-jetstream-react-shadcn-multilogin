import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import axios from 'axios';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface TwoFactorProps {
    requiresConfirmation: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Two-Factor Authentication',
        href: '/settings/two-factor-authentication',
    },
];

// Custom ConfirmsPassword component using shadcn
interface ConfirmsPasswordProps {
    title?: string;
    content?: string;
    button?: string;
    onConfirm: () => void;
    children: React.ReactNode;
}

function ConfirmsPassword({
    title = 'Confirm Password',
    content = 'For your security, please confirm your password to continue.',
    button = 'Confirm',
    onConfirm,
    children,
}: ConfirmsPasswordProps) {
    const [confirmingPassword, setConfirmingPassword] = useState(false);
    const [form, setForm] = useState({
        password: '',
        error: '',
        processing: false,
    });
    const passwordRef = useRef<HTMLInputElement>(null);

    function startConfirmingPassword() {
        axios.get(route('password.confirmation')).then(response => {
            if (response.data.confirmed) {
                onConfirm();
            } else {
                setConfirmingPassword(true);
                setTimeout(() => passwordRef.current?.focus(), 250);
            }
        }).catch(() => {
            // Fallback: directly show confirmation dialog if route doesn't exist
            setConfirmingPassword(true);
            setTimeout(() => passwordRef.current?.focus(), 250);
        });
    }

    function confirmPassword() {
        setForm({ ...form, processing: true });

        axios
            .post(route('password.confirm'), {
                password: form.password,
            })
            .then(() => {
                closeModal();
                setTimeout(() => onConfirm(), 250);
            })
            .catch(error => {
                setForm({
                    ...form,
                    processing: false,
                    error: error.response.data.errors.password[0],
                });
                passwordRef.current?.focus();
            });
    }

    function closeModal() {
        setConfirmingPassword(false);
        setForm({ processing: false, password: '', error: '' });
    }

    return (
        <>
            <span onClick={startConfirmingPassword} className="cursor-pointer">
                {children}
            </span>

            <Dialog open={confirmingPassword} onOpenChange={setConfirmingPassword}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{content}</p>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                ref={passwordRef}
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        confirmPassword();
                                    }
                                }}
                                className="mt-1 block w-full"
                            />
                            <InputError message={form.error} />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmPassword}
                            disabled={form.processing}
                        >
                            {button}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function TwoFactorAuthenticationForm({ requiresConfirmation }: TwoFactorProps) {
    const { auth } = usePage<SharedData>().props;
    const [enabling, setEnabling] = useState(false);
    const [disabling, setDisabling] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [confirming, setConfirming] = useState(false);
    const [setupKey, setSetupKey] = useState<string | null>(null);

    const confirmationForm = useForm({
        code: '',
    });

    const twoFactorEnabled = !enabling && auth.user.two_factor_enabled;

    function enableTwoFactorAuthentication() {
        setEnabling(true);

        router.post(
            '/user/two-factor-authentication',
            {},
            {
                preserveScroll: true,
                onSuccess() {
                    return Promise.all([
                        showQrCode(),
                        showSetupKey(),
                        showRecoveryCodes(),
                    ]);
                },
                onFinish() {
                    setEnabling(false);
                    setConfirming(requiresConfirmation);
                },
            },
        );
    }

    function showSetupKey() {
        return axios.get('/user/two-factor-secret-key').then(response => {
            setSetupKey(response.data.secretKey);
        });
    }

    function confirmTwoFactorAuthentication() {
        confirmationForm.post('/user/confirmed-two-factor-authentication', {
            preserveScroll: true,
            preserveState: true,
            errorBag: 'confirmTwoFactorAuthentication',
            onSuccess: () => {
                setConfirming(false);
                setQrCode(null);
                setSetupKey(null);
            },
        });
    }

    function showQrCode() {
        return axios.get('/user/two-factor-qr-code').then(response => {
            setQrCode(response.data.svg);
        });
    }

    function showRecoveryCodes() {
        return axios.get('/user/two-factor-recovery-codes').then(response => {
            setRecoveryCodes(response.data);
        });
    }

    function regenerateRecoveryCodes() {
        axios.post('/user/two-factor-recovery-codes').then(() => {
            showRecoveryCodes();
        });
    }

    function disableTwoFactorAuthentication() {
        setDisabling(true);

        router.delete('/user/two-factor-authentication', {
            preserveScroll: true,
            onSuccess() {
                setDisabling(false);
                setConfirming(false);
            },
        });
    }

    const handleConfirmationSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        confirmTwoFactorAuthentication();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Two-Factor Authentication" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Two-Factor Authentication"
                        description="Add additional security to your account using two factor authentication."
                    />

                    {/* Status Information */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium">Status:</h3>
                                <Badge
                                    variant={'secondary'}
                                    className={twoFactorEnabled ? 'text-green-600' : 'text-muted-foreground'}
                                >
                                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {twoFactorEnabled && !confirming
                                    ? 'Two-factor authentication is currently enabled for your account.'
                                    : confirming
                                    ? 'Complete the setup process below to enable two-factor authentication.'
                                    : 'Two-factor authentication is not enabled. Enable it to add an extra layer of security to your account.'}
                            </p>
                        </div>

                        {/* QR Code and Setup Section */}
                        {(twoFactorEnabled || confirming) && qrCode && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-base font-medium">
                                        {confirming ? 'Setup Authentication App' : 'QR Code'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {confirming
                                            ? 'Scan the QR code below with your authenticator app, or manually enter the setup key.'
                                            : 'Use this QR code to set up your authenticator app.'}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start space-y-4">
                                    <div
                                        className="border rounded-lg p-4 bg-white inline-block"
                                        dangerouslySetInnerHTML={{ __html: qrCode || '' }}
                                    />

                                    {setupKey && (
                                        <div>
                                            <Label className="text-sm font-medium">Setup Key</Label>
                                            <code className="text-xs bg-muted px-2 py-1 rounded block mt-1 font-mono">
                                                {setupKey}
                                            </code>
                                        </div>
                                    )}
                                </div>

                                {/* Confirmation Code Input */}
                                {confirming && (
                                    <form onSubmit={handleConfirmationSubmit} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="code">Authentication Code</Label>
                                            <Input
                                                id="code"
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete="one-time-code"
                                                placeholder="Enter 6-digit code from your app"
                                                value={confirmationForm.data.code}
                                                onChange={e => confirmationForm.setData('code', e.target.value)}
                                                className="mt-1 block w-full max-w-xs"
                                                autoFocus
                                            />
                                            <InputError message={confirmationForm.errors.code} />
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Recovery Codes Section */}
                        {recoveryCodes.length > 0 && !confirming && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-base font-medium">Recovery Codes</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two-factor authentication device is lost.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 max-w-md p-4 bg-muted rounded-lg font-mono text-sm">
                                    {recoveryCodes.map(code => (
                                        <div key={code} className="text-center py-1">
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            {twoFactorEnabled || confirming ? (
                                <>
                                    {confirming && (
                                        <ConfirmsPassword onConfirm={confirmTwoFactorAuthentication}>
                                            <Button disabled={enabling || confirmationForm.processing}>
                                                Confirm
                                            </Button>
                                        </ConfirmsPassword>
                                    )}

                                    {recoveryCodes.length > 0 && !confirming && (
                                        <ConfirmsPassword onConfirm={regenerateRecoveryCodes}>
                                            <Button variant="outline">
                                                Regenerate Recovery Codes
                                            </Button>
                                        </ConfirmsPassword>
                                    )}

                                    {recoveryCodes.length === 0 && !confirming && (
                                        <ConfirmsPassword onConfirm={showRecoveryCodes}>
                                            <Button variant="outline">
                                                Show Recovery Codes
                                            </Button>
                                        </ConfirmsPassword>
                                    )}

                                    <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                                        <Button
                                            variant={confirming ? "outline" : "destructive"}
                                            disabled={disabling}
                                        >
                                            {confirming ? 'Cancel' : 'Disable'}
                                        </Button>
                                    </ConfirmsPassword>
                                </>
                            ) : (
                                <ConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
                                    <Button disabled={enabling}>
                                        Enable
                                    </Button>
                                </ConfirmsPassword>
                            )}

                            <Transition
                                show={confirmationForm.recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Two-factor authentication configured successfully!</p>
                            </Transition>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
