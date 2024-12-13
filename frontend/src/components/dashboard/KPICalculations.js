// Función para calcular DPMO
export const calculateDPMO = (defects, production) => {
    const totalDefects = defects.reduce((sum, defect) => sum + defect.quantity, 0);
    const totalProduction = production.reduce((sum, prod) => sum + prod.quantity_produced, 0);
    
    if (totalProduction === 0) return 0;
    
    return Math.round((totalDefects / totalProduction) * 1000000);
};

// Función para calcular Yield
export const calculateYield = (dpmo) => {
    return (100 - (dpmo / 10000)).toFixed(2);
};

// Función para calcular nivel Sigma
export const calculateSigma = (dpmo) => {
    if (dpmo === 0) return 6;
    return (0.8406 + Math.sqrt(29.37 - 2.221 * Math.log(dpmo))).toFixed(2);
};