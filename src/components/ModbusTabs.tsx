import { useState } from 'react';
import AsciiGenerator from './AsciiGenerator';
import RtuGenerator from './RtuGenerator';
import TcpGenerator from './TcpGenerator';

const tabs = [
  { id: 'ascii', label: 'MODBUS ASCII' },
  { id: 'rtu', label: 'MODBUS RTU' },
  { id: 'tcp', label: 'MODBUS TCP' }
];

export default function ModbusTabs() {
  const [activeTab, setActiveTab] = useState('ascii');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-modbus-blue mb-8">
        MODBUS Frame Generator
      </h1>
      
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === tab.id
                ? 'border-b-2 border-modbus-blue text-modbus-blue'
                : 'text-black-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'ascii' && <AsciiGenerator />}
        {activeTab === 'rtu' && <RtuGenerator />}
        {activeTab === 'tcp' && <TcpGenerator />}
      </div>
    </div>
  );
}