-- Create enum types for consistent values
CREATE TYPE panel_type AS ENUM ('mono_perc', 'poly', 'mono_high_eff', 'mono_ultra');
CREATE TYPE inverter_type AS ENUM ('string_plus', 'micro_pro', 'hybrid_max');
CREATE TYPE battery_type AS ENUM ('aGate', 'aPower', 'eVaultMax', 'Envy10kW');

-- Main solar calculations table
CREATE TABLE public.solar_calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    monthly_consumption NUMERIC NOT NULL,
    annual_consumption NUMERIC NOT NULL,
    sun_hours_per_year NUMERIC NOT NULL,
    sun_hours_per_day NUMERIC NOT NULL,
    required_energy_per_hour NUMERIC NOT NULL,
    required_energy_per_day NUMERIC NOT NULL,
    panel_capacity INTEGER NOT NULL,
    panel_efficiency NUMERIC NOT NULL,
    inverter_efficiency NUMERIC NOT NULL,
    number_of_panels INTEGER NOT NULL,
    total_adjusted_production NUMERIC NOT NULL,
    scenario_id TEXT,
    panel_id TEXT,
    inverter_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roof analysis data
CREATE TABLE public.roof_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    calculation_id UUID REFERENCES public.solar_calculations(id) ON DELETE CASCADE,
    total_area NUMERIC NOT NULL,
    usable_area NUMERIC NOT NULL,
    shading_percentage NUMERIC NOT NULL,
    orientation TEXT NOT NULL,
    tilt NUMERIC NOT NULL,
    coordinates JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Battery configuration
CREATE TABLE public.battery_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    calculation_id UUID REFERENCES public.solar_calculations(id) ON DELETE CASCADE,
    battery_type battery_type NOT NULL,
    inverter_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    total_capacity NUMERIC NOT NULL,
    total_power NUMERIC NOT NULL,
    estimated_backup_time NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX solar_calculations_lead_id_idx ON public.solar_calculations(lead_id);
CREATE INDEX roof_analysis_calculation_id_idx ON public.roof_analysis(calculation_id);
CREATE INDEX battery_configurations_calculation_id_idx ON public.battery_configurations(calculation_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.solar_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roof_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battery_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (modify based on your security requirements)
CREATE POLICY "Enable all operations for solar_calculations" ON public.solar_calculations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for roof_analysis" ON public.roof_analysis
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for battery_configurations" ON public.battery_configurations
    FOR ALL USING (true) WITH CHECK (true);

-- Create triggers to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_solar_calculations_updated_at
    BEFORE UPDATE ON public.solar_calculations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roof_analysis_updated_at
    BEFORE UPDATE ON public.roof_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_battery_configurations_updated_at
    BEFORE UPDATE ON public.battery_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();