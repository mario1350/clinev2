import React, { useState } from 'react';
import { Plus, Calculator } from 'lucide-react';
import { useAnalysisStore } from '../../stores/analysisStore';
import { useLeadStore } from '../../stores/leadStore';
import RateConfiguration from './RateConfiguration';
import ApplianceForm from './ApplianceForm';
import type { Appliance } from '../../types/analysis';

const ApplianceAnalysis: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Appliance['category']>('kitchen');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);

  const { selectedLead } = useLeadStore();
  const {
    getClientAppliances,
    addClientAppliance,
    updateClientAppliance,
    removeClientAppliance,
    calculateUsage,
    gridRate
  } = useAnalysisStore();

  const categories = [
    { id: 'kitchen', name: 'Kitchen Appliances' },
    { id: 'climate', name: 'Climate Control' },
    { id: 'laundry', name: 'Laundry' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'other', name: 'Other' }
  ];

  const handleAddAppliance = (data: Partial<Appliance>) => {
    if (!selectedLead) return;
    
    const newAppliance: Appliance = {
      id: Date.now().toString(),
      name: data.name!,
      category: data.category!,
      powerRating: data.powerRating!,
      hoursPerDay: data.hoursPerDay!,
      quantity: data.quantity!,
      standbyPower: data.standbyPower || 0
    };

    addClientAppliance(selectedLead.id, newAppliance);
    setShowAddForm(false);
  };

  const handleEditAppliance = (data: Partial<Appliance>) => {
    if (!selectedLead || !editingAppliance) return;

    updateClientAppliance(selectedLead.id, editingAppliance.id, data);
    setEditingAppliance(null);
  };

  const handleDeleteAppliance = (id: string) => {
    if (!selectedLead) return;
    
    if (window.confirm('Are you sure you want to delete this appliance?')) {
      removeClientAppliance(selectedLead.id, id);
    }
  };

  const appliances = selectedLead ? getClientAppliances(selectedLead.id) : [];
  const filteredAppliances = appliances.filter(a => a.category === selectedCategory);
  const usageData = selectedLead ? calculateUsage(selectedLead.id) : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as Appliance['category'])}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <RateConfiguration />
          <button
            onClick={() => setShowAddForm(true)}
            className="btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Appliance
          </button>
        </div>
      </div>

      {/* Appliance List */}
      <div className="space-y-4">
        {filteredAppliances.map(appliance => {
          const usage = usageData.find(u => u.applianceId === appliance.id);
          
          return (
            <div
              key={appliance.id}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {appliance.name}
                  </h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>Power: {appliance.powerRating}W × {appliance.quantity} unit(s)</p>
                    <p>Daily usage: {appliance.hoursPerDay} hours</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingAppliance(appliance)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAppliance(appliance.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {usage && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Monthly Consumption</p>
                      <p className="font-medium text-gray-900">
                        {usage.monthlyConsumption.toFixed(2)} kWh
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monthly Cost</p>
                      <p className="font-medium text-gray-900">
                        ${usage.monthlyCost.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Potential Savings</p>
                      <p className="font-medium text-green-600">
                        ${usage.solarSavings.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredAppliances.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calculator className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appliances added</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add appliances to calculate energy consumption and potential savings
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Forms */}
      {showAddForm && (
        <ApplianceForm
          onSubmit={handleAddAppliance}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {editingAppliance && (
        <ApplianceForm
          initialData={editingAppliance}
          onSubmit={handleEditAppliance}
          onClose={() => setEditingAppliance(null)}
        />
      )}
    </div>
  );
};

export default ApplianceAnalysis;