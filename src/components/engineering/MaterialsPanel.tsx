import React, { useState } from 'react';
import { Package, Search, Plus, AlertTriangle } from 'lucide-react';
import { materials } from '../../data/materials';
import { useVendorStore } from '../../stores/vendorStore';
import { useUserStore } from '../../stores/userStore';
import { clsx } from 'clsx';

const MaterialsPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { selectedComponents, addComponent, updateComponent, removeComponent } = useVendorStore();
  const { isAdmin } = useUserStore();

  const categories = [
    { id: 'all', name: 'All Materials' },
    { id: 'mounting', name: 'Mounting Components' },
    { id: 'electrical', name: 'Electrical Components' },
    { id: 'conduit', name: 'Conduit Components' },
    { id: 'boxes', name: 'Boxes & Enclosures' },
    { id: 'cabling', name: 'Cables' },
    { id: 'breakers', name: 'Breakers' },
    { id: 'misc', name: 'Miscellaneous' },
  ];

  const filteredMaterials = materials
    .filter(m => 
      (selectedCategory === 'all' || m.category === selectedCategory) &&
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="h-[calc(100vh-16rem)] flex">
      {/* Materials Catalog */}
      <div className="w-1/3 border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={clsx(
                    'px-3 py-1 text-sm rounded-full',
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredMaterials.map((material) => {
                const hasLowStock = material.inStock <= material.reorderPoint;
                
                return (
                  <div
                    key={material.id}
                    className="p-3 rounded-lg border border-gray-200 bg-white hover:border-blue-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {material.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {material.description}
                        </p>
                        {hasLowStock && (
                          <div className="mt-1 flex items-center text-yellow-600 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Low stock: {material.inStock} remaining
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => addComponent(material.id, material.minQuantity)}
                        className="p-1 text-gray-400 hover:text-blue-500"
                        title="Add to selection"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {isAdmin() && (
                      <div className="mt-2 text-xs text-gray-500">
                        ${material.price.toFixed(2)} per {material.unit}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Materials */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Selected Materials</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {selectedComponents.map((component) => {
              const material = materials.find(m => m.id === component.componentId);
              if (!material) return null;

              return (
                <div
                  key={component.componentId}
                  className="p-4 rounded-lg border border-gray-200 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {material.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {material.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeComponent(component.componentId)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="mt-3 flex items-center">
                    <label className="text-sm text-gray-500 mr-2">Quantity:</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateComponent(
                          component.componentId,
                          Math.max(material.minQuantity, component.quantity - 1)
                        )}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={material.minQuantity}
                        value={component.quantity}
                        onChange={(e) => updateComponent(
                          component.componentId,
                          Math.max(material.minQuantity, parseInt(e.target.value) || 0)
                        )}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm text-center"
                      />
                      <button
                        onClick={() => updateComponent(
                          component.componentId,
                          component.quantity + 1
                        )}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-500">
                        {material.unit}(s)
                      </span>
                    </div>
                  </div>

                  {isAdmin() && (
                    <div className="mt-2 text-sm text-gray-500">
                      Total: ${(material.price * component.quantity).toFixed(2)}
                    </div>
                  )}
                </div>
              );
            })}

            {selectedComponents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No materials selected yet</p>
                <p className="text-sm mt-1">
                  Click the + button on materials to add them to your selection
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsPanel;