export const exportFrame = (frame: string, format: 'text' | 'json') => {
    const blob = format === 'text'
      ? new Blob([frame], { type: 'text/plain' })
      : new Blob([JSON.stringify({ frame, timestamp: new Date().toISOString() })], 
         { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modbus-frame-${new Date().getTime()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };