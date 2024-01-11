import React, { useRef, useEffect, useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { ButtonPanel } from '@/components/ui/buttonPanel'
import { useTheme } from 'next-themes'

export interface Message {
    content: string;
    fromAssistant: boolean;
}

export interface DiffViewProps extends React.ComponentProps<'div'> {
    original: string;
    messages: Message[];
    responseInProgress: boolean;
    edit: (message: string) => void;
    retry: () => void;
    discard: () => void;
}

export function DiffView({ original, messages, responseInProgress, edit, discard, retry, ...props }: DiffViewProps) {
    const [rightContent, setRightContent] = useState<string | null>(null);
    const diffEditorRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [waitingOnUser, setWaitingOnUser] = useState(false);
    const [isReadingCode, setIsReadingCode] = useState(false);
    const [codeContent, setCodeContent] = useState('');
    const codeSnippetPattern = /```[a-zA-Z]+\n([\s\S]*?)(?:```|$)/;
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

    const handleAction = (action) => {
        switch (action) {
            case 'edit':
                setIsLoading(!isLoading);
                onEdit()
                break;
            case 'cancel':
                setIsLoading(!isLoading);
                break;
            case 'validate':
                setIsLoading(false)
                setWaitingOnUser(false)
                break;
            case 'discard':
                setIsLoading(false)
                discard()
                break;
            case 'retry':
                retry()
                break;
            default:
            // Handle default case
        }
    };

    function onEdit() {
        const currentRightContent = getRightContent()

        // If right content exists, call onDebug
        if (currentRightContent) {
            setRightContent(currentRightContent)
            edit(currentRightContent);
        } else {
            // If left content, call onDebug with the last left content
            let leftContent = getLeftContent()
            if (leftContent) {
                edit(leftContent);
            }
            else {
                alert('GIMME SOMETHING TO WORK WITH')
            }
        }
    }

    // Listen for changes in messages and update right content if the new message is from the assistant
    useEffect(() => {
        if (messages && messages.length > 0) {
            const latestMessage = messages[messages.length - 1];

            if (latestMessage) {
                console.log('message', latestMessage)
                const codeMarkerCount = (latestMessage.content.match(/```/g) || []).length;

                console.log('codeMarkerCount', codeMarkerCount)

                if (codeMarkerCount === 1 && !isReadingCode) {
                    setIsReadingCode(true);
                    setCodeContent(''); // Reset code content for a new snippet
                }

                if (isReadingCode) {
                    // Extract code snippet using regex
                    const codeSnippetMatch = codeSnippetPattern.exec(latestMessage.content);

                    console.log('codeSnippetMatch', codeSnippetMatch)

                    if (codeSnippetMatch && codeSnippetMatch[1]) {
                        console.log(codeSnippetMatch[1])
                        setCodeContent(codeSnippetMatch[1]); // Use the captured group (code content only)
                    }

                    if (codeMarkerCount === 2) {
                        setIsReadingCode(false);
                        setWaitingOnUser(true);
                    }
                }
            }
        } else {
            setRightContent("");
        }
    }, [messages, isReadingCode]);

    // When codeContent changes, update rightContent
    useEffect(() => {
        if (isReadingCode) {
            setRightContent(codeContent);
        }
    }, [codeContent]);

    return (
        <>
            <DiffEditor
                {...props}
                height="90vh"
                originalLanguage="python"
                modifiedLanguage="python"
                original={original}
                modified={rightContent || "// Enter some comments or pseudo-code on how to edit it."}
                onMount={handleEditorDidMount}
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
            />
            <ButtonPanel
                isLoading={isLoading}
                waitingOnUser={waitingOnUser}
                handleAction={handleAction}
            />
        </>
    );
}
