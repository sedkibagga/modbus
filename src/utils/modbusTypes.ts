export type ModbusFunction =
  | '01' // Read Coils
  | '02' // Read Discrete Inputs
  | '03' // Read Holding Registers
  | '04' // Read Input Registers
  | '05' // Write Single Coil
  | '06' // Write Single Register
  | '15' // Write Multiple Coils
  | '16'; // Write Multiple Registers

export interface ModbusFrame {
  slaveId: string;
  functionCode: ModbusFunction;
  data: string;
  checksum?: string;
}

export interface ModbusTcpFrame {
  transactionId: string;
  protocolId: string;
  unitId: string;
  functionCode: ModbusFunction;
  data: string;
}