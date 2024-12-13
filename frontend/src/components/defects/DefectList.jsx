import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const DefectList = () => {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDefects();
  }, []);

  const loadDefects = async () => {
    try {
      const response = await api.get('/defects');
      setDefects(response.data);
    } catch (error) {
      console.error('Error al cargar defectos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Defectos Registrados</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Área
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {defects.map((defect, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(defect.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {defect.processArea}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {defect.defectType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {defect.quantity}
                </td>
                <td className="px-6 py-4">
                  {defect.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DefectList;