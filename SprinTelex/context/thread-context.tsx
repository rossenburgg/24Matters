import * as React from 'react';
import { Thread } from '@/app/types/threads';
import { generateThreads } from '@/app/utils/generate-dummy-data';

export const ThreadContext = React.createContext<Thread[] | null>(null);

export const ThreadProvider = ({
    children,
}:React.PropsWithChildren): JSX.Element => {   
    const [threads, setThreads] = React.useState<Thread[]>([]);
    React.useEffect(() => {setThreads(generateThreads())}, []);
    return <ThreadContext.Provider value={threads}>
        {children}
    </ThreadContext.Provider>

};