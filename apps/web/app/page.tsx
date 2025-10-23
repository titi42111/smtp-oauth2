'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';

const simulationSchema = z.object({
  sender: z.string().email('Adresse expéditeur invalide'),
  recipient: z.string().email('Adresse destinataire invalide')
});

type SimulationForm = z.infer<typeof simulationSchema>;

export default function HomePage() {
  const [result, setResult] = useState<string | null>(null);
  const form = useForm<SimulationForm>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      sender: '',
      recipient: ''
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    setResult(
      `Simulation réussie pour ${values.sender} -> ${values.recipient} (routage non implémenté)`
    );
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-10">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Passerelle SMTP OAuth2</h1>
        <p className="text-muted-foreground">
          Cette interface permet de piloter la conversion SMTP → Microsoft Graph. Les fonctionnalités
          complètes (gestion des connecteurs, audit, sauvegardes) seront développées progressivement.
        </p>
      </section>

      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-medium">Simulateur de routage</h2>
        <form className="mt-4 flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Expéditeur</span>
            <input
              type="email"
              placeholder="admin@example.com"
              className="rounded-md border px-3 py-2"
              {...form.register('sender')}
            />
            {form.formState.errors.sender && (
              <span className="text-sm text-destructive">{form.formState.errors.sender.message}</span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Destinataire</span>
            <input
              type="email"
              placeholder="user@example.com"
              className="rounded-md border px-3 py-2"
              {...form.register('recipient')}
            />
            {form.formState.errors.recipient && (
              <span className="text-sm text-destructive">{form.formState.errors.recipient.message}</span>
            )}
          </label>

          <Button type="submit" className="self-start">
            Lancer la simulation
          </Button>
        </form>
        {result && <p className="mt-4 text-sm text-muted-foreground">{result}</p>}
      </section>
    </main>
  );
}
