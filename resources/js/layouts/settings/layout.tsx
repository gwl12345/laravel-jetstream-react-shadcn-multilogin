import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;
    const { jetstream } = usePage<SharedData>().props;

    const sidebarNavItems: NavItem[] = [
        {
            title: 'Profile',
            href: '/user/profile',
            icon: null,
        },
        {
            title: 'Password',
            href: '/settings/password',
            icon: null,
        },
        ...(jetstream.canManageTwoFactorAuthentication ? [{
            title: 'Two Factor Authentication',
            href: '/settings/two-factor',
            icon: null,
        }] : []),
        {
            title: 'Passkeys',
            href: '/settings/passkeys',
            icon: null,
        },
        {
            title: 'Browser sessions',
            href: '/settings/browser-sessions',
            icon: null,
        },
        {
            title: 'Appearance',
            href: '/settings/appearance',
            icon: null,
        },
    ];

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
