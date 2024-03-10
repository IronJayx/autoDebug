import React, { useState } from 'react';
import { useChat, type Message } from 'ai/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

import { ButtonPanel } from '@/components/ui/buttonPanel'; // Adjust the import path as necessary
import { Wand2, ChevronDown, ChevronUp } from "lucide-react"; // Import icon for the edit button
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary
import { PromptForm } from '@/components/prompt-form';
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { IconRefresh, IconShare, IconStop } from '@/components/ui/icons';
import { FooterText } from '@/components/footer';
import { ChatShareDialog } from '@/components/chat-share-dialog';
import { type UseChatHelpers } from 'ai/react'; // adjust import path as necessary
import { toast } from 'react-hot-toast'

export interface AugmentedChatPanelProps {
    id?: string;
    title?: string;
    isLoading: boolean;
    waitingOnUser: boolean;
    handleAction: (action: string, prompt?: string) => void;
}

export function AugmentedChatPanel({
    id,
    isLoading,
    waitingOnUser,
    handleAction
}: AugmentedChatPanelProps) {
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false); // State to control the visibility of the PromptForm
    const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null);

    const { input, setInput } = useChat({
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

    return (
        <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% animate-in duration-300 ease-in-out dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
            {isLoading || waitingOnUser ? (
                <ButtonPanel
                    isLoading={isLoading}
                    waitingOnUser={waitingOnUser}
                    handleAction={handleAction}
                />
            ) : (
                <div>
                    <ButtonScrollToBottom />
                    <div className="mx-auto sm:max-w-2xl sm:px-4">

                        <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
                            <div className='flex flex-row gap-2.5'>
                                <Button onClick={() => handleAction('lint')}>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Lint
                                </Button>
                                <Button onClick={() => handleAction('refactor')} variant="blue">
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Refactor
                                </Button>
                                <Button onClick={() => handleAction('debug')} variant="green">
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Debug
                                </Button>
                                <Button onClick={() => setShowAdvanced(!showAdvanced)} variant="outline">
                                    Custom prompt (advanced)
                                    {showAdvanced ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
                                </Button>
                            </div>
                            {showAdvanced && ( // Conditionally render the PromptForm
                                <PromptForm
                                    onSubmit={async value => handleAction('custom', value)}
                                    input={input}
                                    setInput={setInput}
                                    isLoading={isLoading}
                                />
                            )}
                            <FooterText className="hidden sm:block" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
