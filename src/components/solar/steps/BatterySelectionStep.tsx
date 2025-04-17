import React, { useState } from 'react';
import { Battery, Zap, Sun, Shield, Check, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { batteryOptions } from '../../../data/batteryData';
import type { SolarCalculation } from '../../../types/solar';

interface BatterySelectionStepProps {
  calculation: Partial<SolarCalculation>;
  onUpdate: (data: Partial<SolarCalculation>) => void;
}

// Calculate backup time based on battery capacity and average consumption
const calculateBackupTime = (battery: typeof batteryOptions[0], quantity: number, monthlyConsumption?: number) => {
  const totalCapacity = battery.capacity * quantity;
  
  // Calculate average hourly consumption based on monthly consumption
  // Default to 2 kWh if no consumption data is available
  const avgHourlyConsumption = monthlyConsumption 
    ? monthlyConsumption / 30 / 24 // Convert monthly to hourly
    : 2; // Default 2 kWh per hour
  
  // Calculate backup time in hours
  return totalCapacity / avgHourlyConsumption;
};

// Format large numbers with commas
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const getSelectedComponent = (type: string) => {
  return batteryOptions.find(b => b.type === type);
};

// Card component for consistent styling
const Card: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className }) => (
  <div className={clsx(
    "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
    "transition-all duration-200 hover:shadow-md",
    className
  )}>
    <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
      <div className="mr-3">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

// Specification item component
const SpecItem: React.FC<{
  label: string;
  value: React.ReactNode;
  tooltip?: string;
}> = ({ label, value, tooltip }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <div className="flex items-center text-sm text-gray-600">
      {label}
      {tooltip && (
        <div className="relative group ml-1">
          <Info className="w-4 h-4 text-gray-400" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-48">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
    <div className="font-medium text-gray-900">{value}</div>
  </div>
);

// Progress bar component
const ProgressBar: React.FC<{
  value: number;
  max: number;
  label: string;
  color?: string;
}> = ({ value, max, label, color = "bg-blue-500" }) => (
  <div className="mt-2 mb-4">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}/{max}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={clsx("h-2.5 rounded-full", color)} 
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      ></div>
    </div>
  </div>
);

const BatterySelectionStep: React.FC<BatterySelectionStepProps> = ({ calculation, onUpdate }) => {
  const [selectedInverter, setSelectedInverter] = useState<string>(
    calculation.batteryConfig?.inverterType || "aGate"
  );
  const [selectedBattery, setSelectedBattery] = useState<string>(
    calculation.batteryConfig?.batteryType || "aPower"
  );
  const [quantity, setQuantity] = useState(calculation.batteryConfig?.quantity || 1);
  const [suncomWarranty, setSuncomWarranty] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Calculate total panels and system size
  const totalPanels = (calculation.number_of_panels || 0) + (calculation.adjusted_panels || 0);
  // Use adjusted_system_size (Final System Size) if available, otherwise calculate from panels
  const systemSizeKW = calculation.adjusted_system_size 
    ? calculation.adjusted_system_size.toFixed(2)
    : ((calculation.panel_capacity || 0) * totalPanels / 1000).toFixed(2);
  
  // Calculate microinverter configuration
  const hm2000Count = Math.floor(totalPanels / 4);
  const remainderPanels = totalPanels % 4;
  const hm1500Count = remainderPanels > 0 ? 1 : 0;
  
  // Get selected battery component
  const battery = batteryOptions.find(b => b.type === selectedBattery);
  
  // Calculate battery backup time using monthly consumption
  const backupTime = battery ? calculateBackupTime(battery, quantity, calculation.monthly_consumption) : 0;
  
  // Calculate monthly production
  const monthlyProduction = calculation.total_adjusted_production || 
    (calculation.adjusted_system_size && calculation.sun_hours_per_day ? 
      calculation.adjusted_system_size * calculation.sun_hours_per_day * 30 : 0);
  
  // Calculate production ratio
  const productionRatio = calculation.monthly_consumption && monthlyProduction
    ? ((monthlyProduction / calculation.monthly_consumption) * 100).toFixed(1)
    : "0";

  const handleSubmit = () => {
    if (!selectedBattery || !selectedInverter) return;
    
    const battery = batteryOptions.find(b => b.type === selectedBattery);
    if (!battery) return;

    const config = {
      batteryType: selectedBattery,
      inverterType: selectedInverter,
      quantity,
      totalCapacity: battery.capacity * quantity,
      totalPower: battery.maxPower * quantity,
      estimatedBackupTime: calculateBackupTime(battery, quantity, calculation.monthly_consumption),
      suncomWarranty: suncomWarranty
    };

    onUpdate({ ...calculation, batteryConfig: config });
    setIsConfigured(true);
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 gap-6">
        {/* Panel Configuration */}
        <Card 
          title="Panel Configuration" 
          icon={<Sun className="w-5 h-5 text-yellow-500" />}
          className="bg-gradient-to-br from-white to-yellow-50"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Brand</span>
              <span className="text-base font-semibold text-gray-900">Seraphim</span>
            </div>
            
            <SpecItem 
              label="Total Panels" 
              value={totalPanels} 
              tooltip="Total number of panels in the system"
            />
            
            <SpecItem 
              label="Panel Capacity" 
              value={`${calculation.panel_capacity || 550}W`} 
              tooltip="Power rating of each panel"
            />
            
            <SpecItem 
              label="System Size" 
              value={`${systemSizeKW} kW`} 
              tooltip="Total system capacity"
            />
            
            <SpecItem 
              label="Panel Efficiency" 
              value={`${((calculation.panel_efficiency || 0) * 100).toFixed(1)}%`} 
              tooltip="Efficiency rating of the panels"
            />
          </div>
        </Card>

        {/* Inverter Configuration */}
        <Card 
          title="Inverter Configuration" 
          icon={<Zap className="w-5 h-5 text-blue-500" />}
          className="bg-gradient-to-br from-white to-blue-50"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Brand</span>
              <span className="text-base font-semibold text-gray-900">Hoymiles</span>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Microinverter Configuration</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">HM-2000 (4 panels each)</span>
                  <span className="text-sm font-medium text-blue-900">{hm2000Count} units</span>
                </div>
                {hm1500Count > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">HM-1500 (3 panels each)</span>
                    <span className="text-sm font-medium text-blue-900">{hm1500Count} units</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <span className="text-sm font-medium text-blue-800">Total Inverters</span>
                  <span className="text-sm font-medium text-blue-900">{hm2000Count + hm1500Count} units</span>
                </div>
              </div>
            </div>
            
            <SpecItem 
              label="Inverter Efficiency" 
              value={`${((calculation.inverter_efficiency || 0) * 100).toFixed(1)}%`} 
              tooltip="Efficiency rating of the inverters"
            />
            
            <SpecItem 
              label="Coverage Ratio" 
              value={`${productionRatio}%`} 
              tooltip="Percentage of energy needs covered by the system"
            />
          </div>
        </Card>

        {/* System Performance */}
        <Card 
          title="System Performance" 
          icon={<Battery className="w-5 h-5 text-green-500" />}
          className="bg-gradient-to-br from-white to-green-50"
        >
          <div className="space-y-4">
            <SpecItem 
              label="Monthly Consumption" 
              value={`${calculation.monthly_consumption?.toFixed(2) || 0} kWh`} 
              tooltip="Average monthly energy usage"
            />
            
            <SpecItem 
              label="Monthly Production" 
              value={`${monthlyProduction.toFixed(2)} kWh`} 
              tooltip="Estimated monthly energy production"
            />
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">System Coverage</h4>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={clsx(
                    "h-4 rounded-full",
                    parseFloat(productionRatio) >= 100 ? "bg-green-500" : "bg-yellow-500"
                  )} 
                  style={{ width: `${Math.min(100, parseFloat(productionRatio))}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">0%</span>
                <span className="text-xs text-gray-500">50%</span>
                <span className="text-xs text-gray-500">100%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Your system {parseFloat(productionRatio) >= 100 ? "fully covers" : "covers"} {productionRatio}% of your energy needs
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Battery Selection - Simplified */}
      <Card 
        title="Battery Storage Configuration" 
        icon={<Battery className="w-5 h-5 text-purple-500" />}
        className="bg-gradient-to-br from-white to-purple-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Battery Selection */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Select Battery System</h3>
            
            <div className="space-y-3">
              {batteryOptions.filter(b => b.type === 'aPower' || b.type === 'eVaultMax').map((batteryOption) => (
                <div 
                  key={batteryOption.type}
                  onClick={() => setSelectedBattery(batteryOption.type)}
                  className={clsx(
                    "flex items-center p-3 rounded-lg border transition-all cursor-pointer",
                    selectedBattery === batteryOption.type 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  )}
                >
                  <div className={clsx(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3",
                    selectedBattery === batteryOption.type 
                      ? "border-purple-500" 
                      : "border-gray-300"
                  )}>
                    {selectedBattery === batteryOption.type && (
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{batteryOption.type}</div>
                    <div className="text-sm text-gray-500">{batteryOption.capacity / 1000} kWh | {batteryOption.maxPower / 1000} kW</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quantity Selector */}
            {battery && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Number of Units</label>
                  <span className="text-sm text-gray-500">Max: {battery.specs.maxUnits}</span>
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-l-lg bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <span className="text-xl font-medium">−</span>
                  </button>
                  
                  <div className="h-10 px-4 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                    <span className="text-lg font-medium">{quantity}</span>
                  </div>
                  
                  <button
                    onClick={() => setQuantity(Math.min(battery.specs.maxUnits, quantity + 1))}
                    className="h-10 w-10 rounded-r-lg bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    disabled={quantity >= battery.specs.maxUnits}
                  >
                    <span className="text-xl font-medium">+</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Battery Details */}
          <div>
            {battery ? (
              <>
                <h3 className="text-base font-medium text-gray-900 mb-4">System Specifications</h3>
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-y divide-gray-200">
                    <div className="p-4">
                      <div className="text-sm text-gray-500">Total Capacity</div>
                      <div className="text-xl font-semibold">{((battery.capacity * quantity) / 1000).toFixed(1)} kWh</div>
                    </div>
                    
                    <div className="p-4">
                      <div className="text-sm text-gray-500">Max Power</div>
                      <div className="text-xl font-semibold">{(battery.maxPower / 1000).toFixed(1)} kW</div>
                    </div>
                    
                    <div className="p-4">
                      <div className="text-sm text-gray-500">Efficiency</div>
                      <div className="text-xl font-semibold">{(battery.efficiency * 100).toFixed(1)}%</div>
                    </div>
                    
                    <div className="p-4">
                      <div className="text-sm text-gray-500">Backup Time</div>
                      <div className="text-xl font-semibold">{backupTime.toFixed(1)} hrs</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm">
                  <div className="flex items-center text-gray-700 mb-1">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>{battery.specs.warranty} manufacturer warranty</span>
                  </div>
                  
                  {battery.specs.cycleLife && (
                    <div className="flex items-center text-gray-700 mb-1">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span>{battery.specs.cycleLife}</span>
                    </div>
                  )}
                  
                  {battery.specs.throughput && (
                    <div className="flex items-center text-gray-700">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span>{battery.specs.throughput} total throughput</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Battery className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Battery Selected</h3>
                <p className="text-sm text-gray-500">Select a battery system to view specifications</p>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Warranty Section */}
      <Card 
        title="Warranty & Support" 
        icon={<Shield className="w-5 h-5 text-orange-500" />}
        className="bg-gradient-to-br from-white to-orange-50"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0 md:mr-8">
            <h4 className="text-lg font-medium text-gray-900 mb-2">25-Year Suncom Warranty</h4>
            <p className="text-sm text-gray-600 mb-4">
              Our exclusive 25-year warranty covers all system components, labor, and performance guarantees.
              This comprehensive coverage exceeds industry standards and provides peace of mind for decades to come.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                <span>Performance guarantee (90% at 25 years)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                <span>Parts and labor included</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                <span>Transferable to new homeowners</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                <span>Annual system check-ups</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center bg-white rounded-lg p-6 border border-orange-200 shadow-sm min-w-[200px]">
            <Shield className="w-12 h-12 text-orange-500 mb-3" />
            <h5 className="text-lg font-bold text-gray-900 mb-4">Include Warranty</h5>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={suncomWarranty}
                onChange={() => setSuncomWarranty(!suncomWarranty)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {suncomWarranty ? 'Included' : 'Not Included'}
              </span>
            </label>
            
            {suncomWarranty && (
              <div className="mt-4 text-center">
                <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  25 Years Coverage
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          disabled={!selectedBattery || !selectedInverter}
          className={clsx(
            'px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors',
            (!selectedBattery || !selectedInverter) && 'opacity-50 cursor-not-allowed'
          )}
        >
          Save Configuration
        </button>
      </div>
      
      {/* Configuration Saved Message */}
      {isConfigured && (
        <div className="bg-green-50 rounded-lg p-4 mt-4 border border-green-200">
          <div className="flex items-center text-green-800">
            <Check className="w-5 h-5 mr-2" />
            <span className="font-medium">Configuration Saved</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your battery system configuration has been saved and will be included in the final proposal.
          </p>
        </div>
      )}
    </div>
  );
};

export default BatterySelectionStep;
