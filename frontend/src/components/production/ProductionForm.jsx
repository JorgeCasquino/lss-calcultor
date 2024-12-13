import React, { useState } from 'react';
import api from '../../services/api';

const ProductionForm = ({ onProductionAdded }) => {
  const [formData, setFormData] = useState({
    processArea: '',
    quantityProduced: '',
    date: new Date().toISOString().split('T')[0]
  });

  const processAreas = [
    'Corte',
    'Soldadura',
    'Ensamblaje',
    'Pintura',
    'Empaque',
    'Control de Calidad'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/production', formData);
      if (onProductionAdded) {
        onProductionAdded();
      }
      setFormData({
        processArea: '',
        quantityProduced: '',
        date: new Date().toISOString().split('T')[0]
      });
      alert('Producción registrada exitosamente');
    } catch (error) {
      alert('Error al registrar la producción');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Registrar Producción</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Área del Proceso
          </label>
          <select
            name="processArea"
            value={formData.processArea}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Seleccione un área</option>
            {processAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cantidad Producida
          </label>
          <input
            type="number"
            name="quantityProduced"
            value={formData.quantityProduced}
            onChange={handleChange}
            required
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Registrar Producción
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductionForm;