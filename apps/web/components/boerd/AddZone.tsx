'use client';

import { useState, useRef, useCallback } from 'react';
import { createBlockFromText } from '@/actions/blocks';

interface AddZoneProps {
  boerdId: string;
  onBlockAdded?: () => void;
}

/**
 * AddZone - Zero-form input for adding content
 * - Handles paste (clipboard images/text/URLs)
 * - Handles drop (files)
 * - Handles typing (text blocks on Enter)
 */
export function AddZone({ boerdId, onBlockAdded }: AddZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData;

    // Check for files first (images)
    if (clipboardData.files.length > 0) {
      e.preventDefault();
      setIsProcessing(true);

      try {
        for (const file of Array.from(clipboardData.files)) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('boerdId', boerdId);

          await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
        }
        onBlockAdded?.();
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Check for text/URLs
    const pastedText = clipboardData.getData('text/plain');
    if (pastedText) {
      // If it looks like a URL, process it immediately
      if (isUrl(pastedText)) {
        e.preventDefault();
        setIsProcessing(true);

        try {
          await createBlockFromText(pastedText, boerdId);
          onBlockAdded?.();
        } finally {
          setIsProcessing(false);
        }
      }
      // Otherwise let it go into the text input
    }
  }, [boerdId, onBlockAdded]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setIsProcessing(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('boerdId', boerdId);

        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
      }
      onBlockAdded?.();
    } finally {
      setIsProcessing(false);
    }
  }, [boerdId, onBlockAdded]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleKeyDown = useCallback(async (e: React.KeyboardEvent) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
      e.preventDefault();
      setIsProcessing(true);

      try {
        await createBlockFromText(text.trim(), boerdId);
        setText('');
        onBlockAdded?.();
      } finally {
        setIsProcessing(false);
      }
    }
  }, [text, boerdId, onBlockAdded]);

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 transition-colors
        ${isDragOver ? 'border-[#6B8E6B] bg-[#6B8E6B]/10' : 'border-zinc-700'}
        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder="Paste URL, drop file, or type text..."
        className="w-full bg-transparent text-white placeholder-zinc-500 resize-none outline-none text-sm"
        rows={2}
        disabled={isProcessing}
      />
      <p className="text-xs text-zinc-600 mt-2">
        {isProcessing ? 'Processing...' : 'Press Enter to add text block'}
      </p>
    </div>
  );
}

function isUrl(str: string): boolean {
  try {
    new URL(str.trim());
    return true;
  } catch {
    return false;
  }
}
