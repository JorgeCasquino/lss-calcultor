import React, { useState } from 'react';
import api from '../../services/api';

const DefectForm = ({ onDefectAdded }) => {
  const [formData, setFormData] = useState({
    processArea: '',
    defectType: '',
    description: '',
    quantity: 1,
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

  const defectTypes = [
    'Dimensiones incorrectas',
    'Acabado deficiente',
    'Componente faltante',
    'Daño superficial',
    'Error de etiquetado',
    'Mal funcionamiento'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/defects', formData);
      if (onDefectAdded) {
        onDefectAdded(response.data);
      }
      // Limpiar el formulario
      setFormData({
        processArea: '',
        defectType: '',
        description: '',
        quantity: 1,
        date: new Date().toISOString().split('T')[0]
      });
      alert('Defecto registrado exitosamente');
    } catch (error) {
      alert('Error al registrar el defecto');
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
      <h2 className="text-2xl font-bold mb-6">Registrar Nuevo Defecto</h2>
      
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
            Tipo de Defecto
          </label>
          <select
            name="defectType"
            value={formData.defectType}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Seleccione un tipo</option>
            {defectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows="3"
            placeholder="Describa el defecto..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
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
            Registrar Defecto
          </button>
        </div>
      </form>
    </div>
  );
};

export default DefectForm;