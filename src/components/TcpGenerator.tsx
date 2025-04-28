import { useState } from 'react';
import { formatHexFrame } from '../utils/checksum';
import { validateHexInput } from '../utils/validation';
import FrameDisplay from './FrameDisplay';

export default function TcpGenerator() {
  const [frame, setFrame] = useState({
    transactionId: '0001',
    protocolId: '0000',
    unitId: '01',
    functionCode: '03' as const,
    data: '00000001'
  });
  const [generatedFrame, setGeneratedFrame] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    if (!validateHexInput(frame.transactionId) || frame.transactionId.length !== 4) {
      newErrors.transactionId = 'Must be 4-digit hexadecimal';
    }
    
    if (!validateHexInput(frame.protocolId) || frame.protocolId.length !== 4) {
      newErrors.protocolId = 'Must be 4-digit hexadecimal (typically 0000)';
    }
    
    if (!validateHexInput(frame.unitId) || frame.unitId.length !== 2) {
      newErrors.unitId = 'Must be 2-digit hexadecimal';
    }
    
    if (!validateHexInput(frame.data)) {
      newErrors.data = 'Must be hexadecimal (0-9, A-F)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validateInputs()) return;
    
    const length = (frame.data.length / 2 + 2).toString(16).padStart(4, '0');
    const mbapHeader = frame.transactionId + frame.protocolId + length + frame.unitId;
    const pdu = frame.functionCode + frame.data;
    const fullFrame = mbapHeader + pdu;
    
    setGeneratedFrame(fullFrame.toUpperCase());
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-modbus-dark mb-4">MODBUS TCP Frame</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
          <input
            type="text"
            value={frame.transactionId}
            onChange={(e) => setFrame({...frame, transactionId: e.target.value.toUpperCase()})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-modbus-blue focus:border-modbus-blue"
            maxLength={4}
          />
          {errors.transactionId && (
            <p className="mt-1 text-sm text-red-600">{errors.transactionId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Protocol ID</label>
          <input
            type="text"
            value={frame.protocolId}
            onChange={(e) => setFrame({...frame, protocolId: e.target.value.toUpperCase()})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-modbus-blue focus:border-modbus-blue"
            maxLength={4}
          />
          {errors.protocolId && (
            <p className="mt-1 text-sm text-red-600">{errors.protocolId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit ID</label>
          <input
            type="text"
            value={frame.unitId}
            onChange={(e) => setFrame({...frame, unitId: e.target.value.toUpperCase()})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-modbus-blue focus:border-modbus-blue"
            maxLength={2}
          />
          {errors.unitId && (
            <p className="mt-1 text-sm text-red-600">{errors.unitId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Function Code</label>
          <select
            value={frame.functionCode}
            onChange={(e) => setFrame({...frame, functionCode: e.target.value as any})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-modbus-blue focus:border-modbus-blue"
          >
            <option value="01">01 - Read Coils</option>
            <option value="02">02 - Read Discrete Inputs</option>
            <option value="03">03 - Read Holding Registers</option>
            <option value="04">04 - Read Input Registers</option>
            <option value="05">05 - Write Single Coil</option>
            <option value="06">06 - Write Single Register</option>
            <option value="15">15 - Write Multiple Coils</option>
            <option value="16">16 - Write Multiple Registers</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
        <textarea
          value={frame.data}
          onChange={(e) => setFrame({...frame, data: e.target.value.toUpperCase()})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-modbus-blue focus:border-modbus-blue"
        />
        {errors.data && (
          <p className="mt-1 text-sm text-red-600">{errors.data}</p>
        )}
      </div>

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-modbus-blue"
      >
        Generate Frame
      </button>

      {generatedFrame && (
        <FrameDisplay
          frame={generatedFrame}
          format="hex"
          breakdown={[
            { 
              label: 'MBAP Header', 
              value: `Transaction: ${frame.transactionId}, Protocol: ${frame.protocolId}, Length: ${(frame.data.length / 2 + 2).toString(16).padStart(4, '0')}, Unit: ${frame.unitId}`
            },
            { 
              label: 'PDU', 
              value: `Function: ${frame.functionCode}, Data: ${frame.data}`
            }
          ]}
        />
      )}
    </div>
  );
}