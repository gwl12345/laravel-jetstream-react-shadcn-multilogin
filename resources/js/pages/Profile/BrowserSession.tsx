import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type Session } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Monitor, Smartphone, AlertTriangle } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Browser sessions',
        href: '/settings/browser-sessions',
    },
];

interface Props {
    sessions: Session[];
}

export default function BrowserSession({ sessions }: Props) {
    const [confirmingLogout, setConfirmingLogout] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { data, setData, errors, delete: deleteRequest, reset, processing, recentlySuccessful } = useForm({
        password: '',
    });

    const confirmLogout = () => {
        setConfirmingLogout(true);
        setTimeout(() => passwordRef.current?.focus(), 250);
    };

    const logoutOtherBrowserSessions: FormEventHandler = (e) => {
        e.preventDefault();

        deleteRequest(route('other-browser-sessions.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordRef.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingLogout(false);
        reset();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Browser sessions" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Browser sessions"
                        description="Manage and log out your active sessions on other browsers and devices."
                    />

                    <div className="max-w-xl text-sm text-muted-foreground">
                        If necessary, you may log out of all of your other browser sessions
                        across all of your devices. Some of your recent sessions are listed
                        below; however, this list may not be exhaustive. If you feel your
                        account has been compromised, you should also update your password.
                    </div>

                    {/* Browser Sessions List */}
                    {sessions.length > 0 && (
                        <div className="space-y-4">
                            {sessions.map((session, i) => (
                                <Card key={i}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                {session.agent.is_desktop ? (
                                                    <Monitor className="w-8 h-8 text-muted-foreground" />
                                                ) : (
                                                    <Smartphone className="w-8 h-8 text-muted-foreground" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {session.agent.platform} - {session.agent.browser}
                                                    </p>
                                                    {session.is_current_device && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            This device
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    {session.ip_address}
                                                    {!session.is_current_device && (
                                                        <span> • Last active {session.last_active}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <Separator />

                    {/* Logout Button */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="destructive"
                            onClick={confirmLogout}
                            disabled={processing}
                        >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Log out other browser sessions
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Done.</p>
                        </Transition>
                    </div>
                </div>

                {/* Confirmation Modal */}
                <Dialog open={confirmingLogout} onOpenChange={setConfirmingLogout}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Log out other browser sessions</DialogTitle>
                            <DialogDescription>
                                Please enter your password to confirm you would like to log out of
                                your other browser sessions across all of your devices.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={logoutOtherBrowserSessions} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    ref={passwordRef}
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Log out other browser sessions
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </SettingsLayout>
        </AppLayout>
    );
}
