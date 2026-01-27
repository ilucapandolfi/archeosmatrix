"use client";
import React from 'react';

// Questa funzione renderizza QUALUNQUE cosa basandosi sul database
export function MatrixRenderer({ node }) {
  const { ui_schema, data_content } = node;

  return (
    <div className="canvas-root">
      {ui_schema.blocks.map((block: any) => {
        // Se il blocco richiede un dato dinamico (es: Prezzo), lo pesca da data_content
        const dynamicData = data_content[block.mapToField];
        
        return (
          <DynamicComponent 
            key={block.id} 
            type={block.type} 
            props={block.props} 
            data={dynamicData} 
          />
        );
      })}
    </div>
  );
}
