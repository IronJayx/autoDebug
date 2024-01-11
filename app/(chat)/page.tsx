"use client"
import React, { useState } from 'react';
import { nanoid } from '@/lib/utils';
import { Chat } from '@/components/chat';
import { Editor } from '@/components/editor';

export default function IndexPage() {
  const id = nanoid();
  const [currentView, setCurrentView] = useState("debug");

  const toggleView = () => {
    setCurrentView(currentView === 'chat' ? 'debug' : 'chat');
  };

  return (
    <>
      {currentView === 'chat' ?
        <Chat id={id} onToggleView={toggleView} /> :
        <Editor id={id} onToggleView={toggleView} />}
    </>
  );
}
