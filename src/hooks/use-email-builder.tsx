"use client";

import { useState, useCallback, useEffect } from "react";
import { EmailBlock } from "@/shared/emailSchema";
import { defaultBlocks, blockTemplates } from "@/lib/email-blocks";

interface UseEmailBuilderProps {
  initialBlocks?: EmailBlock[];
}

export function useEmailBuilder({ initialBlocks }: UseEmailBuilderProps = {}) {
  // Initialize with default blocks if no initialBlocks provided
  const [blocks, setBlocks] = useState<EmailBlock[]>(
    initialBlocks && initialBlocks.length > 0 ? initialBlocks : defaultBlocks
  );
  
  // Set selected block ID, defaulting to the first block if available
  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    () => initialBlocks?.[0]?.id || defaultBlocks[0]?.id || ''
  );
  
  // Update selectedBlockId if it's not set or the selected block doesn't exist
  useEffect(() => {
    if (blocks.length > 0 && (!selectedBlockId || !blocks.some(b => b.id === selectedBlockId))) {
      setSelectedBlockId(blocks[0].id);
    }
  }, [blocks, selectedBlockId]);

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  const addBlock = useCallback((blockType: keyof typeof blockTemplates) => {
    const template = blockTemplates[blockType];
    const newBlock: EmailBlock = {
      id: `${blockType}-${Date.now()}`,
      type: template.type,
      properties: { ...template.properties }
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => {
      const newBlocks = prev.filter(block => block.id !== blockId);
      if (selectedBlockId === blockId && newBlocks.length > 0) {
        setSelectedBlockId(newBlocks[0].id);
      }
      return newBlocks;
    });
  }, [selectedBlockId]);

  const updateBlockProperty = useCallback((blockId: string, property: string, value: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, properties: { ...block.properties, [property]: value } }
        : block
    ));
  }, []);

  const selectBlock = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
  }, []);

  const exportTemplate = useCallback(() => {
    const template = {
      name: 'Email Template',
      blocks: blocks
    };
    
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'email-template.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [blocks]);

  return {
    blocks,
    selectedBlockId,
    selectedBlock,
    addBlock,
    deleteBlock,
    updateBlockProperty,
    selectBlock,
    exportTemplate,
    setBlocks
  };
}
