"use client";

import { useState, useCallback } from "react";
import { EmailBlock } from "@/shared/emailSchema";
import { defaultBlocks, blockTemplates } from "@/lib/email-blocks";

export function useEmailBuilder() {
  const [blocks, setBlocks] = useState<EmailBlock[]>(defaultBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('divider-1');

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
    exportTemplate
  };
}
