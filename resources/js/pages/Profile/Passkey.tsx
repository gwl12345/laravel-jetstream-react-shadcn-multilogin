import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SharedData } from '@/types';
import Webpass from '@laragear/webpass'
import dayjs from 'dayjs'
import { Key, Plus, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const breadcrumbs = [
  {
    title: 'Passkeys',
    href: '/settings/passkeys',
  },
];

interface Passkey {
  id: string;
  alias?: string;
  created_at: string;
}

export default function Passkey({passkeys} : { passkeys: Passkey[] }) {
  const { auth, flash } = usePage<SharedData & { flash?: { success?: string; error?: string } }>().props;
  const [alias, setAlias] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [deletingPasskeyId, setDeletingPasskeyId] = useState<string | null>(null);

  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      const { success, error } = await Webpass.attest({path: route('webauthn.register.options'), findCsrfToken: true}, {path: route('webauthn.register'), findCsrfToken: true, body: {alias: alias}})

      if (success) {
        setAlias('');
        toast.success('Passkey added successfully!');
        router.reload();
      } else if (error) {
        toast.error((error as any)?.message || 'Failed to create passkey');
      }
    } catch (err) {
      toast.error('Failed to create passkey');
    }

    setIsRegistering(false);
  };

  const deletePasskey = async (id: string) => {
    setDeletingPasskeyId(id);

    router.delete(route('passkeys.delete', { id }), {
      preserveScroll: true,
      onError: (errors) => {
        toast.error('Failed to delete passkey');
        setDeletingPasskeyId(null);
      },
      onFinish: () => {
        setDeletingPasskeyId(null);
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Passkey settings" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Passkeys" description="Manage your passkeys for passwordless authentication." />

          {/* Add new passkey */}
          {Webpass.isSupported() ? (
            <form onSubmit={submit} className="space-y-4 max-w-md">
              <div className="grid gap-2">
                <Label htmlFor="name">Passkey name</Label>
                <Input
                  id="name"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  required
                  placeholder="e.g. My Laptop, Work Phone"
                />
              </div>
              <Button disabled={isRegistering}>
                {isRegistering ? 'Creating Passkey...' : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Passkey
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-sm text-muted-foreground">Your browser does not support passkeys. Please use a supported browser.</div>
          )}

          {/* List of existing passkeys */}
          <div className="space-y-4">
            {passkeys.length === 0 ? (
              <div className="text-sm text-muted-foreground">No passkeys registered yet.</div>
            ) : (
              <div className="space-y-2">
                {passkeys.map((passkey) => (
                  <Card key={passkey.id}>
                      <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                      <Key className="w-8 h-8 text-muted-foreground" />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2">
                                          <p className="text-sm font-medium text-foreground">
                                              {passkey.alias || `Passkey #${passkey.id}`}
                                          </p>
                                      </div>

                                      <div className="mt-1 text-xs text-muted-foreground">
                                          Created on: {dayjs(passkey.created_at).format('DD/MM/YYYY')}
                                      </div>
                                  </div>
                              </div>

                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    deletePasskey(passkey.id);
                                  }}
                                  disabled={deletingPasskeyId === passkey.id}
                                  className="text-destructive hover:text-destructive"
                              >
                                  {deletingPasskeyId === passkey.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                              </Button>
                          </div>
                      </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
