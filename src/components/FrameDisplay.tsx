import { formatHexFrame } from '../utils/checksum';
import { exportFrame } from '../utils/export';

interface FrameDisplayProps {
  frame: string;
  format: 'ascii' | 'hex';
  breakdown?: { label: string; value: string }[];
}

export default function FrameDisplay({ frame, format, breakdown }: FrameDisplayProps) {
  const handleExport = (exportFormat: 'text' | 'json') => {
    exportFrame(frame, exportFormat);
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-modbus-dark">
          Generated Frame ({format.toUpperCase()})
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleExport('text')}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            Export TXT
          </button>
          <button 
            onClick={() => handleExport('json')}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            Export JSON
          </button>
        </div>
      </div>
      
      <div className="p-3 bg-white rounded border border-gray-200 font-mono text-sm overflow-x-auto">
        {format === 'hex' ? formatHexFrame(frame) : frame}
      </div>
      
      {breakdown && (
        <>
          <h4 className="mt-4 text-md font-medium text-modbus-dark">Frame Breakdown</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {breakdown.map((item, index) => (
              <li key={index}>
                <span className="font-medium">{item.label}:</span> {item.value}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}