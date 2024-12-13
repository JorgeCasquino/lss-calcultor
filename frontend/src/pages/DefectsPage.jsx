import React from 'react';
import DefectForm from '../components/defects/DefectForm';
import DefectList from '../components/defects/DefectList';

const DefectsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Defectos</h1>
      
      {/* Grid de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de registro */}
        <div>
          <DefectForm onDefectAdded={() => {
            // Recargar la lista cuando se agregue un nuevo defecto
            window.location.reload();
          }} />
        </div>
        
        {/* Lista de defectos */}
        <div>
          <DefectList />
        </div>
      </div>
    </div>
  );
};

export default DefectsPage;