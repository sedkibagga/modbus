import crc from 'crc';

export const calculateLRC = (data: string): string => {
  let lrc = 0;
  for (let i = 0; i < data.length; i++) {
    lrc = (lrc + data.charCodeAt(i)) & 0xff;
  }
  lrc = ((lrc ^ 0xff) + 1) & 0xff;
  return lrc.toString(16).padStart(2, '0').toUpperCase();
};

export const calculateCRC16 = (data: any): string => {
  return crc.crc16modbus(data).toString(16).padStart(4, '0').toUpperCase();
};

export const formatHexFrame = (frame: string, chunkSize = 2): string => {
  return frame.match(new RegExp(`.{1,${chunkSize}}`, 'g'))?.join(' ') || '';
};