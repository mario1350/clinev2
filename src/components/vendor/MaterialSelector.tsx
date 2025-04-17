import React, { useState } from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { materials } from '../../data/materials';
import { useVendorStore } from '../../stores/vendorStore';
import { useUserStore } from '../../stores/userStore';
import type { MaterialComponent } from '../../types/vendor';
import { clsx } from 'clsx';

const MaterialSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState<MaterialComponent['category']>('mounting');
  const { selectedComponents, addComponent, updateComponent, removeComponent, checkInventory } = useVendorStore();
  const { isAdmin } = useUserStore();

  const categories = [
    { id: 'mounting', name: 'Mounting Components' },
    { id: 'electrical', name: 'Electrical Components' },
    { id: 'conduit', name: 'Conduit Components' },
    { id: 'boxes', name: 'Boxes & Enclosures' },
    { id: 'cabling', name: 'Cables' },
    { id: 'breakers', name: 'Breakers' },
    { id: 'misc', name: 'Miscellaneous' }
  ];

  const filteredMaterials = materials.filter(m => m.category === selectedCategory);

  const handleQuantityChange = (material: MaterialComponent, quantity: number) => {
    if (quantity < 0) return;
    
    const existing = selectedComponents.find(c => c.componentId === material.id);
    if (existing) {
      if (quantity === 0) {
        removeComponent(material.id);
      } else {
        updateComponent(material.id, quantity);
      }
    } else if (quantity > 0) {
      addComponent(material.id, quantity);
    }
  };

  const getQuantity = (materialId: string) => {
    const component = selectedComponents.find(c => c.componentId === materialId);
    return component?.quantity || 0;
  };

  return (
    <div className="space-y-6">
      <div className="sm:hidden">
        <select
          className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as MaterialComponent['category'])}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden sm:block">
        <nav className="flex flex-wrap gap-2" aria-label="Categories">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as MaterialComponent['category'])}
              className={clsx(
                'px-3 py-2 text-sm font-medium rounded-md',
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const quantity = getQuantity(material.id);
          const hasLowStock = material.inStock <= material.reorderPoint;
          
          return (
            <div
              key={material.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {material.name}
                  </h3>
                  <p className="text-sm text-gray-500">{material.description}</p>
                </div>
                <Package className="w-5 h-5 text-gray-400" />
              </div>

              <div className="mt-4">
                {isAdmin() && (
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Price per {material.unit}</span>
                    <span className="font-medium text-gray-900">
                      ${material.price.toFixed(2)}
                    </span>
                  </div>
                )}

                {hasLowStock && (
                  <div className="mt-2 flex items-center text-yellow-600 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Low stock: {material.inStock} remaining
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity ({material.unit})
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(material, quantity - 1)}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(material, parseInt(e.target.value) || 0)}
                      className="block w-full min-w-0 flex-1 px-3 py-2 border border-gray-300 text-center focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(material, quantity + 1)}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialSelector;