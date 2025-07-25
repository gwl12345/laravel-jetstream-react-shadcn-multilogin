import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    photo: File | null;
    _method: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth, jetstream } = usePage<SharedData>().props;
    const photoRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        photo: null,
        _method: 'PUT',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('user-profile-information.update'), {
            preserveScroll: true,
            onSuccess: () => clearPhotoFileInput(),
        });
    };

    const selectNewPhoto = () => {
        photoRef.current?.click();
    };

    const updatePhotoPreview = () => {
        const photo = photoRef.current?.files?.[0];

        if (!photo) {
            return;
        }

        setData('photo', photo);

        const reader = new FileReader();

        reader.onload = (e) => {
            setPhotoPreview(e.target?.result as string);
        };

        reader.readAsDataURL(photo);
    };

    const deletePhoto = () => {
        router.delete(route('current-user-photo.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                setPhotoPreview(null);
                clearPhotoFileInput();
            },
        });
    };

    const clearPhotoFileInput = () => {
        if (photoRef.current?.value) {
            photoRef.current.value = '';
            setData('photo', null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        {jetstream.managesProfilePhotos && (
                            <div className="space-y-4">
                                <Label>Profile Photo</Label>

                                <input
                                    type="file"
                                    className="hidden"
                                    ref={photoRef}
                                    onChange={updatePhotoPreview}
                                />

                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        {photoPreview ? (
                                            <div
                                                className="h-20 w-20 rounded-full bg-cover bg-center bg-no-repeat"
                                                style={{
                                                    backgroundImage: `url('${photoPreview}')`,
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={auth.user.profile_photo_url}
                                                alt={auth.user.name}
                                                className="h-20 w-20 rounded-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={selectNewPhoto}
                                        >
                                            Select A New Photo
                                        </Button>

                                        {auth.user.profile_photo_path && (
                                          <Button
                                              type="button"
                                              variant="outline"
                                              onClick={deletePhoto}
                                          >
                                              Remove Photo
                                          </Button>
                                        )}
                                    </div>
                                </div>

                                <InputError className="mt-2" message={errors.photo} />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
