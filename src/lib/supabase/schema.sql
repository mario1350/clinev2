-- First, drop everything in the correct order
DROP TABLE IF EXISTS public.solar_calculations CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TYPE IF EXISTS panel_type CASCADE;
DROP TYPE IF EXISTS inverter_type CASCADE;
DROP TYPE IF EXISTS battery_type CASCADE;

-- Create the leads table first since it's referenced by solar_calculations
CREATE TABLE public.leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    street_address text NOT NULL,
    postal_address text NOT NULL,
    coordinates jsonb,
    date_of_birth date NOT NULL,
    monthly_income numeric NOT NULL,
    id_type text NOT NULL CHECK (id_type IN ('license', 'realId')),
    id_number text NOT NULL,
    id_expiration date NOT NULL,
    ssn text NOT NULL,
    payment_method text NOT NULL CHECK (payment_method IN ('cash', 'credit', 'financed')),
    financing_option text CHECK (financing_option IN ('sanBlas', 'caribeFederal')),
    status text NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'closed', 'archived')),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_contact timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for leads
CREATE INDEX leads_status_idx ON public.leads(status);
CREATE INDEX leads_created_at_idx ON public.leads(created_at DESC);

-- Create solar calculations table with snake_case column names
CREATE TABLE public.solar_calculations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
    monthly_consumption numeric NOT NULL,
    daily_consumption numeric NOT NULL,
    annual_consumption numeric NOT NULL,
    sun_hours_per_year numeric NOT NULL,
    sun_hours_per_day numeric NOT NULL,
    required_energy_per_hour numeric NOT NULL,
    required_energy_per_day numeric NOT NULL,
    panel_capacity integer NOT NULL,
    panel_efficiency numeric NOT NULL,
    inverter_efficiency numeric NOT NULL,
    number_of_panels integer NOT NULL,
    total_adjusted_production numeric NOT NULL,
    scenario_id text NOT NULL,
    panel_id text NOT NULL,
    inverter_id text NOT NULL,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_consumption CHECK (monthly_consumption > 0),
    CONSTRAINT positive_daily_consumption CHECK (daily_consumption > 0),
    CONSTRAINT positive_annual_consumption CHECK (annual_consumption > 0),
    CONSTRAINT positive_sun_hours CHECK (sun_hours_per_day > 0 AND sun_hours_per_year > 0),
    CONSTRAINT positive_energy_requirements CHECK (required_energy_per_hour > 0 AND required_energy_per_day > 0),
    CONSTRAINT positive_panel_values CHECK (panel_capacity > 0 AND panel_efficiency > 0 AND panel_efficiency <= 1),
    CONSTRAINT positive_inverter_efficiency CHECK (inverter_efficiency > 0 AND inverter_efficiency <= 1),
    CONSTRAINT positive_panels CHECK (number_of_panels > 0),
    CONSTRAINT positive_production CHECK (total_adjusted_production > 0)
);

-- Create indexes for solar_calculations
CREATE INDEX solar_calculations_lead_id_idx ON public.solar_calculations(lead_id);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solar_calculations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all operations for leads" ON public.leads
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for solar_calculations" ON public.solar_calculations
    FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_solar_calculations_updated_at
    BEFORE UPDATE ON public.solar_calculations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();