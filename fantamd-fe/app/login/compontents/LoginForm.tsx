'use client';

import { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Input } from '@heroui/input';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { login } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    try {
        await login(username, password);
        router.push("/"); 
    } catch(error: any) {
        setIsLoading(false)
        addToast({
            title: error.message || 'Accesso fallito',
            color: 'danger'
        });
    }
  };

  return (
    <Card className='min-w-sm p-5 w-full'>
        <CardBody>
            <LockClosedIcon className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tigh">Accedi</h2>
             <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <Input
                id="username"
                name="username"
                label="Username"
                type="text"
                autoComplete="username"
                required
                value={username}
                disabled={isLoading}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
              />
            <Button color='primary' size='lg' className='w-full' isLoading={isLoading} type="submit">Accedi</Button>
        </form>
        </CardBody>
    </Card> 
  );
}
