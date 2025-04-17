import React from 'react';
import { Package, AlertTriangle, Check } from 'lucide-react';
import { useVendorStore } from '../../stores/vendorStore';
import { useUserStore } from '../../stores/userStore';
import { materials } from '../../data/materials';

const SystemSummary = () => {
  const { selectedComponents, calculateTotalCost } = useVendorStore();
  const { isAdmin } = useUserStore();

  const getMaterial = (componentId: string) => {
    return materials.find(m => m.id === componentId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const categorizedComponents = selectedComponents.reduce((acc, component) => {
    const material = getMaterial(component.componentId);
    if (material) {
      if (!acc[material.category]) {
        acc[material.category] = [];
      }
      acc[material.category].push({
        ...material,
        quantity: component.quantity,
        total: material.price * component.quantity
      });
    }
    return acc;
  }, {} as Record<string, any[]>);

  const totalCost = calculateTotalCost();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">
            Selected Materials
          </h3>
        </div>

        {Object.entries(categorizedComponents).map(([category, items]) => (
          <div key={category} className="p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-4 capitalize">
              {category} Components
            </h4>
            <div className="space-y-4">
              {items.map((item) => {
                const hasLowStock = item.inStock <= item.reorderPoint;
                
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        {isAdmin() && (
                          <p className="text-sm text-gray-500">
                            {item.quantity} {item.unit}(s) × ${item.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {isAdmin() && (
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.total)}
                        </p>
                      )}
                      {hasLowStock && (
                        <p className="text-xs text-yellow-600 flex items-center mt-1">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Low stock
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {isAdmin() && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Total Cost</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalCost)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Check className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Ready for Installation
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                All necessary components have been selected. You can now proceed
                with the installation following the provided guide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSummary;