export const validateHexInput = (input: string): boolean => {
    return /^[0-9A-Fa-f]+$/.test(input);
  };
  
  export const validateSlaveId = (id: string): boolean => {
    return validateHexInput(id) && parseInt(id, 16) >= 1 && parseInt(id, 16) <= 247;
  };
  
  export const validateFunctionCode = (code: string): boolean => {
    const validCodes = ['01', '02', '03', '04', '05', '06', '15', '16'];
    return validCodes.includes(code);
  };