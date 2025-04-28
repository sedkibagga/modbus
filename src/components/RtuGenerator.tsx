import { useState } from 'react';
import { calculateCRC16 } from '../utils/checksum';
import { validateHexInput, validateSlaveId } from '../utils/validation';
import FrameDisplay from './FrameDisplay';
import { Buffer } from 'buffer';

export default function RtuGenerator() {
  const [frame, setFrame] = useState({
    slaveId: '01',
    functionCode: '03' as const,
    data: '00000001'
  });
  const [generatedFrame, setGeneratedFrame] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    if (!validateSlaveId(frame.slaveId)) {
      newErrors.slaveId = 'Must be hexadecimal (01-F7)';
    }
    
    if (!validateHexInput(frame.data)) {
      newErrors.data = 'Must be hexadecimal (0-9, A-F)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validateInputs()) return;
    
    try {
      const hexString = frame.slaveId + frame.functionCode + frame.data;
      const buffer = Buffer.from(hexString, 'hex');
      const crc = calculateCRC16(buffer);
      
      // Swap bytes for MODBUS (little-endian)
      const swappedCrc = crc.slice(2, 4) + crc.slice(0, 2);
      const fullFrame = hexString + swappedCrc;
      setGeneratedFrame(fullFrame.toUpperCase());
    } catch (error) {
      setErrors({...errors, general: 'Invalid hexadecimal input'});
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-modbus-dark mb-4">MODBUS RTU Frame</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slave ID</label>
          <input
            type="text"
            value={frame.slaveId}
            onChange={(e) => setFrame({...frame, slaveId: e.target.value.toUpperCase()})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-modbus-blue focus:border-modbus-blue"
            maxLength={2}
          />
          {errors.slaveId && (
            <p className="mt-1 text-sm text-red-600">{errors.slaveId}</p>
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

      {errors.general && (
        <p className="mt-2 text-sm text-red-600">{errors.general}</p>
      )}

      {generatedFrame && (
        <FrameDisplay
          frame={generatedFrame}
          format="hex"
          breakdown={[
            { label: 'Slave ID', value: frame.slaveId },
            { label: 'Function', value: frame.functionCode },
            { label: 'Data', value: frame.data },
            { label: 'CRC-16', value: generatedFrame.slice(-4) }
          ]}
        />
      )}
    </div>
  );
}