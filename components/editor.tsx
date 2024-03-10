'use client'

import { useChat, type Message } from 'ai/react'

import { BaseInput } from '@/components/baseInput'
import { DiffView } from '@/components/diffView'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export interface EditorProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[];
    id?: string;
    onToggleView: () => void;
}

export function Editor({ id, initialMessages, onToggleView }: EditorProps) {
    const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null);
    const [originalInput, setOriginalInput] = useState('');
    const [initFlow, setInitFlow] = useState('none'); // New state to manage initialization flow
    const [debugContent, setDebugContent] = useState<string | null>(null);

    const { messages, append, reload, isLoading, setMessages } = useChat({
        initialMessages,
        id,
        body: {
            id,
            previewToken,
        },
        onResponse(response) {
            if (response.status === 401) {
                toast.error(response.statusText);
            }
        },
    });

    const handleInit = (input: string, initType: 'scratch' | 'baseInput') => {
        setOriginalInput(input);
        setInitFlow(initType);

        if (initType === 'scratch') {
            handleStartFromScratch();
        }
    };

    // When starting from scratch, we set the initFlow to 'scratch' and clear the original input
    const handleStartFromScratch = () => {
        setOriginalInput('');
        setInitFlow('scratch');
    };

    const handleRetry = () => {
        if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
            // Delete the last message if it's from the assistant
            messages.pop();
            // Call the reload function to regenerate the response
            reload();
        }
    };

    const handleDiscard = () => {
        if (messages.length > 0) {
            // Delete the last message regardless of the role
            messages.pop();

            // Update the state to reflect the change
            setMessages([...messages]);
        }
    };

    const handleCallLLm = async (content: string) => {
        // Logic to handle debug content
        setDebugContent(content);

        // Send the content to the chat API
        try {
            await append({
                id,
                content,
                role: 'user'
            });
        } catch (error) {
            console.error('Error sending debug content:', error);
            toast.error('Failed to send debug content');
        }
    };
    // Pass debugContent and handleDebug to DiffView
    return (
        <>
            {(initFlow === 'none') ? (
                <BaseInput handleInit={handleInit} />
            ) : (
                <DiffView
                    id={id}
                    original={originalInput}
                    messages={messages}
                    responseInProgress={isLoading}
                    callLLM={handleCallLLm}
                    retry={handleRetry}
                    discard={handleDiscard}
                />
            )}
        </>
    );
}
