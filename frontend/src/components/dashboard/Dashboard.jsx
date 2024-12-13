import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      dpmo: 0,
      sigma: 0,
      yield: 0,
      totalDefects: 0,
      totalProduction: 0
    },
    defectsByArea: [],
    defectTrend: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de defectos y producción
        const [defectsRes, productionRes] = await Promise.all([
          api.get('/defects'),
          api.get('/production')
        ]);

        const defects = defectsRes.data;
        const production = productionRes.data;

        // Calcular KPIs
        const totalDefects = defects.reduce((sum, defect) => sum + (defect.quantity || 0), 0);
        const totalProduction = production.reduce((sum, prod) => sum + (prod.quantity_produced || 0), 0);
        
        // Calcular DPMO
        const dpmo = totalProduction > 0 
          ? Math.round((totalDefects / totalProduction) * 1000000) 
          : 0;

        // Calcular Yield
        const yieldRate = 100 - (dpmo / 10000);

        // Calcular Sigma
        const sigma = calculateSigmaLevel(dpmo);

        // Procesar datos para gráficos
        const defectsByArea = processDefectsByArea(defects);
        const defectTrend = processDefectTrend(defects, production);

        setDashboardData({
          kpis: {
            dpmo,
            sigma: sigma.toFixed(2),
            yield: yieldRate.toFixed(2),
            totalDefects,
            totalProduction
          },
          defectsByArea,
          defectTrend,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error al cargar datos:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar los datos del dashboard'
        }));
      }
    };

    fetchData();
  }, []);

  const calculateSigmaLevel = (dpmo) => {
    if (dpmo === 0) return 6;
    return 0.8406 + Math.sqrt(29.37 - 2.221 * Math.log(dpmo));
  };

  const processDefectsByArea = (defects) => {
    const areaCount = {};
    defects.forEach(defect => {
      const area = defect.process_area || 'No especificado';
      areaCount[area] = (areaCount[area] || 0) + (defect.quantity || 1);
    });

    return Object.entries(areaCount).map(([area, value]) => ({
      area,
      value
    }));
  };

  const processDefectTrend = (defects, production) => {
    const monthlyData = {};
    
    // Procesar defectos por mes
    defects.forEach(defect => {
      const date = new Date(defect.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { defects: 0, production: 0 };
      }
      monthlyData[monthKey].defects += (defect.quantity || 0);
    });

    // Procesar producción por mes
    production.forEach(prod => {
      const date = new Date(prod.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { defects: 0, production: 0 };
      }
      monthlyData[monthKey].production += (prod.quantity_produced || 0);
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        defects: data.defects,
        dpmo: data.production > 0 
          ? Math.round((data.defects / data.production) * 1000000)
          : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (dashboardData.loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (dashboardData.error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {dashboardData.error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard LSS</h1>
        <Link 
          to="/data-entry"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Registrar Datos
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">DPMO</h3>
          <p className="text-3xl font-bold text-indigo-600">{dashboardData.kpis.dpmo}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Nivel Sigma</h3>
          <p className="text-3xl font-bold text-indigo-600">{dashboardData.kpis.sigma}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Yield</h3>
          <p className="text-3xl font-bold text-indigo-600">{dashboardData.kpis.yield}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Defectos</h3>
          <p className="text-3xl font-bold text-indigo-600">{dashboardData.kpis.totalDefects}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Producción</h3>
          <p className="text-3xl font-bold text-indigo-600">{dashboardData.kpis.totalProduction}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Defectos por Área */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Defectos por Área</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.defectsByArea}
                  dataKey="value"
                  nameKey="area"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {dashboardData.defectsByArea.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tendencia DPMO */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia DPMO</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.defectTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="dpmo" 
                  stroke="#8884d8" 
                  name="DPMO"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;