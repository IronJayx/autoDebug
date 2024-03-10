import React, { useRef, useEffect, useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { AugmentedChatPanel } from '@/components/augmented-chat-pannel'
import { useTheme } from 'next-themes'
import { lintMessageNewCode, refactorMessageNewCode, debugMessageNewCode } from '@/app/strings';

export interface Message {
    content: string;
    fromAssistant: boolean;
    role: string;
}

export interface DiffViewProps extends React.ComponentProps<'div'> {
    id?: string;
    original: string;
    messages: Message[];
    responseInProgress: boolean;
    callLLM: (message: string) => void;
    retry: () => void;
    discard: () => void;
}

export function DiffView({ id, original, messages, responseInProgress, callLLM, discard, retry, ...props }: DiffViewProps) {
    const [rightContent, setRightContent] = useState<string | null>(null);
    const diffEditorRef = useRef(null);
    const [waitingOnUser, setWaitingOnUser] = useState(false);
    const [capturingCode, setCapturingCode] = useState(false);
    const [startIndex, setStartIndex] = useState(0)
    const { theme } = useTheme();

    function handleEditorDidMount(editor, monaco) {
        diffEditorRef.current = editor;
    }

    function getRightContent() {
        if (diffEditorRef.current) {
            return diffEditorRef.current.getModifiedEditor().getValue()
        }
    }

    function getLeftContent() {
        if (diffEditorRef.current) {
            return diffEditorRef.current.getOriginalEditor().getValue()
        }
    }

    const handleAction = (action, value) => {
        console.log(`Handling action: ${action}`, value ? `with value: ${value}` : '');
        switch (action) {
            case 'custom':
                console.log('Executing custom action');
                handleCustom(value)
                break;
            case 'lint':
                console.log('Executing lint action');
                handleLint()
                break;
            case 'refactor':
                console.log('Executing refactor action');
                setWaitingOnUser(false)
                handleRefactor()
                break;
            case 'debug':
                console.log('Executing debug action');
                setWaitingOnUser(false)
                handleDebug()
                break;
            case 'cancel':
                console.log('Executing cancel action');
                break;
            default:
                console.error(`Unhandled action: ${action}`);
                break;
        }
    };


    function handleCustom(prompt: string) {
        let content = ""

        // get the last content
        if (messages && messages.length > 0) {
            // Use the right side (modified) content for linting
            content = getRightContent();
        } else {
            // If there are no messages, use the left side (original) content for linting
            content = getLeftContent();
        }

        // Check if the rightContent has been updated from the last message
        const latestMessage = messages.length > 0 ? messages[messages.length - 1].content : null;

        if (content && !latestMessage) {
            let fullContent = `Here is my code:\n\n${content}\n\n${prompt}`;
            // Call callLLM with either the updated content message or just the prompt
            callLLM(fullContent);

        }

        else if (content && latestMessage && !latestMessage.includes(content)) {
            // Assuming 'preset_message_right_updated' is a preset message to indicate updated content
            let fullContent = `The code has been updated. Here's the new version:\n\n${content}\n\n${prompt}`;
            // Call callLLM with either the updated content message or just the prompt
            callLLM(fullContent);
        }

        else {
            callLLM(prompt);
        }

    }

    function handleLint() {
        let content = '';

        // Check if there are messages in the history
        if (messages && messages.length > 0) {
            // Use the right side (modified) content for linting
            const currentRightContent = getRightContent();
            if (currentRightContent) {
                content = lintMessageNewCode(currentRightContent);
            }
        } else {
            // If there are no messages, use the left side (original) content for linting
            const currentLeftContent = getLeftContent();
            if (currentLeftContent) {
                content = lintMessageNewCode(currentLeftContent);
            }
        }

        // Call the LLM with the constructed content
        if (content) {
            callLLM(content);
        } else {
            console.error('No content available for linting');
        }
    }

    function handleRefactor() {
        let content = '';

        // Check if there are messages in the history
        if (messages && messages.length > 0) {
            // Use the right side (modified) content for linting
            const currentRightContent = getRightContent();
            if (currentRightContent) {
                content = refactorMessageNewCode(currentRightContent);
            }
        } else {
            // If there are no messages, use the left side (original) content for linting
            const currentLeftContent = getLeftContent();
            if (currentLeftContent) {
                content = refactorMessageNewCode(currentLeftContent);
            }
        }

        // Call the LLM with the constructed content
        if (content) {
            callLLM(content);
        } else {
            console.error('No content available for linting');
        }
    }

    function handleDebug() {
        let content = '';

        // Check if there is right-side content available for debugging
        if (messages && messages.length > 0) {
            // Use the right side (modified) content for linting
            const currentRightContent = getRightContent();
            if (currentRightContent) {
                content = debugMessageNewCode(currentRightContent);
            }
        } else {
            // If there are no messages, use the left side (original) content for linting
            const currentLeftContent = getLeftContent();
            if (currentLeftContent) {
                content = debugMessageNewCode(currentLeftContent);
            }
        }

        // If there's content to debug, call the LLM
        if (content) {
            callLLM(content);
        } else {
            console.error('No content available for debug');
        }
    }


    // Listen for changes in messages and update right content if the new message is from the assistant
    useEffect(() => {
        if (messages && messages.length > 0) {
            const latestMessage = messages[messages.length - 1];

            if (latestMessage && latestMessage.role == 'assistant' && !capturingCode) {

                const regexPattern = /```[a-zA-Z]*\n/;
                const match = regexPattern.exec(latestMessage.content);

                if (match) {
                    const startIndexAfterMatch = match.index + match[0].length;

                    console.log('Message', latestMessage)
                    console.log('Index: ', startIndexAfterMatch)
                    console.log(match)

                    setRightContent('')
                    setStartIndex(startIndexAfterMatch)
                    setCapturingCode(true)
                }
            }
        }
    }, [messages]);


    useEffect(() => {
        if (capturingCode) {
            const latestMessage = messages[messages.length - 1];
            // Ensure we have the latest message and a starting index
            if (latestMessage && startIndex >= 0) {
                // Calculate the length of the current rightContent
                const currentLength = rightContent ? rightContent.length : 0

                // isolate new content in new message
                const newContent = latestMessage.content.substring(startIndex + currentLength);

                // Append new content to rightContent if there is any
                if (newContent) {
                    setRightContent((prevContent) => prevContent ? prevContent + newContent : newContent);
                }
            }
        }

        if (!responseInProgress && capturingCode) {

            // get last backtick
            const lastBacktickIndex = rightContent?.lastIndexOf('```') ?? -1;

            // final content is every fthing up to last backtick
            const finalContent = rightContent?.substring(0, lastBacktickIndex) ?? "";
            setRightContent(finalContent);

            // Reset state for next message
            setCapturingCode(false);
            setStartIndex(0)
        }

    }, [messages, responseInProgress, capturingCode, startIndex]);

    return (
        <>
            <DiffEditor
                {...props}
                height="90vh"
                originalLanguage="python"
                modifiedLanguage="python"
                options={{'renderSideBySide':true}}
                original={original}
                modified={rightContent || "// Choose one of option down the page to edit your code."}
                onMount={handleEditorDidMount}
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
            />
            <AugmentedChatPanel
                id={id}
                isLoading={responseInProgress}
                waitingOnUser={waitingOnUser}
                handleAction={handleAction}
            />
        </>
    );
}
