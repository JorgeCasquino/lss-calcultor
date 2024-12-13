import React from 'react';
import DefectForm from '../components/defects/DefectForm';
import ProductionForm from '../components/production/ProductionForm';

const DataEntryPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Registro de Datos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionForm />
        <DefectForm />
      </div>
    </div>
  );
};

export default DataEntryPage;