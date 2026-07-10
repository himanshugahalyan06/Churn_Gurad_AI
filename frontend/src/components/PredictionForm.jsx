import React, { useState } from 'react';
import { User, DollarSign, Activity } from 'lucide-react';

const CATEGORICAL_OPTIONS = {
  gender: ['Female', 'Male'],
  SeniorCitizen: [0, 1],
  Partner: ['Yes', 'No'],
  Dependents: ['Yes', 'No'],
  PhoneService: ['Yes', 'No'],
  MultipleLines: ['Yes', 'No', 'No phone service'],
  InternetService: ['DSL', 'Fiber optic', 'No'],
  OnlineSecurity: ['Yes', 'No', 'No internet service'],
  OnlineBackup: ['Yes', 'No', 'No internet service'],
  DeviceProtection: ['Yes', 'No', 'No internet service'],
  TechSupport: ['Yes', 'No', 'No internet service'],
  StreamingTV: ['Yes', 'No', 'No internet service'],
  StreamingMovies: ['Yes', 'No', 'No internet service'],
  Contract: ['Month-to-month', 'One year', 'Two year'],
  PaperlessBilling: ['Yes', 'No'],
  PaymentMethod: [
    'Electronic check',
    'Mailed check',
    'Bank transfer (automatic)',
    'Credit card (automatic)',
  ],
};

const DEFAULT_STATE = {
  gender: 'Female',
  SeniorCitizen: 0,
  Partner: 'No',
  Dependents: 'No',
  tenure: 1,
  PhoneService: 'Yes',
  MultipleLines: 'No',
  InternetService: 'Fiber optic',
  OnlineSecurity: 'No',
  OnlineBackup: 'Yes',
  DeviceProtection: 'No',
  TechSupport: 'No',
  StreamingTV: 'No',
  StreamingMovies: 'No',
  Contract: 'Month-to-month',
  PaperlessBilling: 'Yes',
  PaymentMethod: 'Electronic check',
  MonthlyCharges: 29.85,
  TotalCharges: 29.85,
};

export default function PredictionForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(DEFAULT_STATE);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    
    if (type === 'number') {
      parsedValue = parseFloat(value);
    } else if (name === 'SeniorCitizen') {
      parsedValue = parseInt(value, 10);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Customer Profile</h2>
            <p className="text-xs text-slate-500 font-medium">Enter customer parameters to evaluate retention risk.</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-grow p-6 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 flex-grow">
          
          {/* Numeric Inputs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-400" /> Tenure (months)
            </label>
            <input
              type="number"
              name="tenure"
              value={formData.tenure}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-slate-50/50 hover:bg-white"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Monthly Charges
            </label>
            <input
              type="number"
              name="MonthlyCharges"
              value={formData.MonthlyCharges}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-slate-50/50 hover:bg-white"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Total Charges
            </label>
            <input
              type="number"
              name="TotalCharges"
              value={formData.TotalCharges}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-slate-50/50 hover:bg-white"
              required
            />
          </div>

          {/* Categorical Inputs */}
          {Object.entries(CATEGORICAL_OPTIONS).map(([field, options]) => (
            <div key={field} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider truncate block">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-slate-50/50 hover:bg-white cursor-pointer"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-xl text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2
              ${loading 
                ? 'bg-indigo-400 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Generate Risk Assessment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
