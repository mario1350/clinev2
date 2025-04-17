import React from 'react';
import type { SolarCalculation } from '../../../types/solar';
import type { Lead } from '../../../types/dashboard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Define the props interface for our proposal template
interface ProposalTemplateProps {
  calculation: Partial<SolarCalculation>;
  lead: Lead;
  financingData: any;
}

// CSS styles for the proposal
const proposalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Helvetica:wght@400;700&display=swap');
  
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Helvetica', Arial, sans-serif;
    margin: 0;
    padding: 0;
    color: #333333;
    background-color: white;
  }
  
  .page {
    page-break-after: always;
    position: relative;
    width: 100%;
    min-height: 29.7cm;
    padding: 30px;
    background-color: white;
  }
  
  .cover-page {
    background-color: #e65c00;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: white;
    position: relative;
  }
  
  .cover-title {
    font-size: 52px;
    font-weight: 700;
    color: white;
    text-align: center;
    margin-bottom: 15px;
  }
  
  .cover-subtitle {
    font-size: 26px;
    color: white;
    opacity: 0.9;
    text-align: center;
    margin-bottom: 70px;
  }
  
  .cover-client {
    font-size: 22px;
    color: white;
    text-align: center;
    margin-top: 25px;
  }
  
  .cover-tagline {
    font-size: 20px;
    color: white;
    text-align: center;
    margin-top: 90px;
    opacity: 0.9;
  }
  
  .executive-summary-page {
    background-color: #f9a825;
    padding: 0;
    margin: 0;
  }
  
  .executive-summary-content {
    padding: 40px;
  }
  
  .executive-summary-title {
    font-size: 38px;
    font-weight: 700;
    color: white;
    margin-bottom: 35px;
    text-align: left;
  }
  
  .section-card {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 25px;
    border-left: 4px solid;
  }
  
  .section-card-orange {
    border-left-color: #e65c00;
  }
  
  .section-card-blue {
    border-left-color: #2196f3;
  }
  
  .section-card-green {
    border-left-color: #4caf50;
  }
  
  .card-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }
  
  .card-title-orange {
    color: #e65c00;
  }
  
  .card-title-blue {
    color: #2196f3;
  }
  
  .card-title-green {
    color: #4caf50;
  }
  
  .icon-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    color: white;
    font-weight: 700;
    font-size: 14px;
  }
  
  .icon-circle-orange {
    background-color: #e65c00;
  }
  
  .icon-circle-blue {
    background-color: #2196f3;
  }
  
  .icon-circle-green {
    background-color: #4caf50;
  }
  
  .paragraph {
    font-size: 14px;
    color: #333333;
    margin-bottom: 15px;
    line-height: 1.6;
    text-align: justify;
  }
  
  .comparison-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  
  .comparison-item-icon {
    width: 30px;
    text-align: center;
    font-size: 16px;
    color: #e65c00;
  }
  
  .comparison-item-text {
    flex: 1;
    font-size: 15px;
    color: #333333;
    padding-left: 10px;
  }
  
  .incentive-card {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 25px;
    border: 1px solid #e65c00;
  }
  
  .incentive-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .large-icon-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    background-color: #e65c00;
    color: white;
    font-weight: 700;
    font-size: 18px;
  }
  
  .incentive-title {
    font-size: 24px;
    font-weight: 700;
    color: #e65c00;
  }
  
  .stats-container {
    background-color: white;
    border-radius: 12px;
    margin-top: 15px;
    margin-bottom: 10px;
    border: 1px solid #e65c00;
  }
  
  .stats-content {
    padding: 10px;
  }
  
  .stats-title {
    font-size: 18px;
    font-weight: 700;
    color: #e65c00;
    margin-bottom: 12px;
    text-align: center;
  }
  
  .stats-row {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
  }
  
  .stat-value {
    font-size: 22px;
    font-weight: 700;
    color: #e65c00;
  }
  
  .stat-label {
    font-size: 12px;
    color: #333333;
    font-weight: 600;
    text-align: center;
  }
  
  .testimonials-card {
    background-color: white;
    border-radius: 12px;
    margin-top: 25px;
    margin-bottom: 15px;
    border: 1px solid #4caf50;
    padding: 15px;
  }
  
  .testimonials-title {
    font-size: 18px;
    font-weight: 700;
    color: #4caf50;
    margin-bottom: 15px;
    text-align: center;
  }
  
  .testimonial {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .testimonial-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff3e0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 22px;
  }
  
  .testimonial-content {
    flex: 1;
  }
  
  .testimonial-text {
    font-size: 14px;
    font-style: italic;
    color: #333333;
    line-height: 1.3;
  }
  
  .testimonial-author {
    font-size: 12px;
    font-weight: 700;
    color: #e65c00;
    margin-top: 5px;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e65c00;
  }
  
  .header-content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  .header-title {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .header-text {
    font-size: 28px;
    font-weight: 700;
    color: #e65c00;
  }
  
  .header-subtitle {
    font-size: 16px;
    color: #666666;
    margin-top: 5px;
  }
  
  .section-container {
    margin: 10px;
    padding: 22px;
    background-color: #fff3e0;
    border-radius: 12px;
    border: 1px solid #f9a825;
    margin-bottom: 22px;
  }
  
  .section-heading {
    font-size: 18px;
    font-weight: 600;
    color: #e65c00;
    margin-bottom: 18px;
  }
  
  .data-row {
    display: flex;
    margin-bottom: 12px;
  }
  
  .data-column {
    flex: 1;
    padding: 0 6px;
  }
  
  .data-label {
    font-size: 12px;
    color: #666666;
    margin-bottom: 4px;
    font-weight: 600;
  }
  
  .data-value {
    font-size: 14px;
    color: #333333;
    line-height: 1.4;
  }
  
  .page-number {
    position: absolute;
    bottom: 30px;
    right: 30px;
    font-size: 10px;
    color: #666666;
  }
  
  .chart-container {
    width: 100%;
    height: 400px;
    margin: 20px 0;
  }

  @media print {
    .page {
      break-after: page;
    }
    
    .cover-page {
      background-color: #e65c00 !important;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .executive-summary-page {
      background-color: #f9a825 !important;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .section-container {
      background-color: #fff3e0 !important;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

// Helper function to ensure numeric values have fallbacks
const ensureNumber = (value: any, fallback: number = 0): number => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return fallback;
  }
  return Number(value);
};

const ProposalTemplate: React.FC<ProposalTemplateProps> = ({ calculation, lead, financingData }) => {
  const formatDate = (date: Date) => {
    try {
      return format(date, 'd \'de\' MMMM \'de\' yyyy', { locale: es });
    } catch (error) {
      return format(new Date(), 'd \'de\' MMMM \'de\' yyyy', { locale: es });
    }
  };
  const currentDate = new Date();
  
  // Ensure all calculation values have fallbacks
  const safeCalculation = {
    number_of_panels: ensureNumber(calculation.number_of_panels, 10),
    panel_capacity: ensureNumber(calculation.panel_capacity, 400),
    panel_efficiency: ensureNumber(calculation.panel_efficiency, 0.21),
    inverter_efficiency: ensureNumber(calculation.inverter_efficiency, 0.96),
    total_adjusted_production: ensureNumber(calculation.total_adjusted_production, 30),
    sun_hours_per_day: ensureNumber(calculation.sun_hours_per_day, 5.5),
    monthly_consumption: ensureNumber(calculation.monthly_consumption, 800),
    annual_consumption: ensureNumber(calculation.annual_consumption, 9600),
    ...calculation
  };
  
  // Calculate system size in kW
  const systemSizeKW = (safeCalculation.number_of_panels * safeCalculation.panel_capacity / 1000).toFixed(2);
  
  // Calculate monthly production (using adjusted_system_size like in ResultsStep)
  const monthlyProduction = (ensureNumber(safeCalculation.adjusted_system_size, 5.5) * safeCalculation.sun_hours_per_day * 30).toFixed(2);
  
  // Calculate production ratio (monthly production / monthly consumption) * 100
  // This represents what percentage of the client's consumption is covered by solar
  const productionRatio = ((parseFloat(monthlyProduction) / safeCalculation.monthly_consumption) * 100).toFixed(1);

  // Company statistics
  const companyStats = {
    installedKW: 700,
    clients: 600, 
    storedKWh: 2500,
  };

  // Sample data for solar production chart
  const productionData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2025, i, 1).toLocaleString('default', { month: 'short' });
    const baseProduction = parseFloat(monthlyProduction);
    // Adjust production based on seasonal factors
    const seasonalFactor = i >= 3 && i <= 8 ? 1.2 : 0.8; // More production in summer
    
    return {
      month,
      production: Math.round(baseProduction * seasonalFactor),
      consumption: Math.round(safeCalculation.monthly_consumption)
    };
  });

  return (
    <html>
      <head>
        <title>Solar Proposal - {lead.name}</title>
        <style>{proposalStyles}</style>
      </head>
      <body>
        {/* Cover Page */}
        <div className="page cover-page">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}>
            <div className="cover-title">PROPUESTA DE SISTEMA SOLAR</div>
            <div className="cover-subtitle">Diseñado específicamente para:</div>
            <div className="cover-client">{lead.name}</div>
            
            <div style={{
              marginTop: '80px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '15px',
              width: '80%',
            }}>
              <div style={{
                fontSize: '22px',
                color: 'white',
                textAlign: 'center',
                fontWeight: '700',
              }}>
                Energía sin Intermediarios. Sin Comisiones. Sin Mentiras.
              </div>
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
            }}>
              <div style={{
                fontSize: '14px',
                color: 'white',
                opacity: '0.8',
              }}>
                Generado el {formatDate(currentDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Page */}
        <div className="page executive-summary-page">
          <div className="executive-summary-content" style={{ paddingTop: '25px', paddingBottom: '30px' }}>
            <div className="executive-summary-title">RESUMEN EJECUTIVO</div>
            
            {/* Situation Card */}
            <div className="section-card section-card-orange">
              <div className="card-title card-title-orange">
                <div className="icon-circle icon-circle-orange">i</div>
                <div>Situación Actual</div>
              </div>
              
              <div className="paragraph">
                Puerto Rico vive una transformación energética urgente. La mayoría de los hogares están atrapados en contratos de arrendamiento con empresas como Sunrun o Sunnova, que no ofrecen la propiedad real del sistema y esconden costos a largo plazo.
              </div>
              
              <div className="paragraph">
                SunCom rompe el molde ofreciendo una alternativa clara, directa y justa: propiedad total, sin intermediarios ni comisiones ocultas que inflan el precio final.
              </div>
            </div>
            
            {/* Mission Card */}
            <div className="section-card section-card-blue">
              <div className="card-title card-title-blue">
                <div className="icon-circle icon-circle-blue">⦿</div>
                <div>Misión de SunCom</div>
              </div>
              
              <div className="paragraph">
                Nuestra misión es transformar el acceso a la energía solar en Puerto Rico, ofreciendo sistemas de alta calidad con total transparencia y sin intermediarios. Buscamos empoderar a los propietarios para que sean verdaderos dueños de su producción energética, eliminando las barreras financieras y contractuales que han dominado el mercado.
              </div>
            </div>
            
            {/* Goals Card */}
            <div className="section-card section-card-green" style={{ marginTop: '25px' }}>
              <div className="card-title card-title-green">
                <div className="icon-circle icon-circle-green">★</div>
                <div>Objetivos de SunCom</div>
              </div>
              
              <div className="comparison-item">
                <div className="comparison-item-icon">✓</div>
                <div className="comparison-item-text">Democratizar el acceso a la energía solar mediante modelos de propiedad directa</div>
              </div>
              
              <div className="comparison-item">
                <div className="comparison-item-icon">✓</div>
                <div className="comparison-item-text">Eliminar comisiones ocultas y escaladores de precios del mercado solar</div>
              </div>
              
              <div className="comparison-item">
                <div className="comparison-item-icon">✓</div>
                <div className="comparison-item-text">Proporcionar garantías claras y auditables que protejan la inversión del cliente</div>
              </div>
            </div>
            
            {/* Incentive Card */}
            <div className="incentive-card">
              <div className="incentive-header">
                <div className="large-icon-circle">$</div>
                <div className="incentive-title">INCENTIVO DE $6,000</div>
              </div>
              
              <div className="comparison-item">
                <div className="comparison-item-icon">✓</div>
                <div className="comparison-item-text">Se otorga directamente al cliente para reducir el costo o el principal de su préstamo.</div>
              </div>
              
              <div className="comparison-item">
                <div className="comparison-item-icon">✓</div>
                <div className="comparison-item-text">Sin ITC ni estructuras piramidales: tú eres dueño de tu sistema desde el día uno.</div>
              </div>
            </div>
            
            {/* Company Stats */}
            <div className="stats-container">
              <div className="stats-content">
                <div className="stats-title">NUESTRO IMPACTO</div>
                
                <div className="stats-row">
                  <div className="stat-item">
                    <div className="stat-value">+{companyStats.installedKW} kW</div>
                    <div className="stat-label">INSTALADOS</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-value">+{companyStats.clients}</div>
                    <div className="stat-label">CLIENTES</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-value">+{companyStats.storedKWh.toLocaleString()}</div>
                    <div className="stat-label">KWh ALMACENADOS</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Customer Testimonials Section */}
            <div className="testimonials-card">
              <div className="testimonials-title">TESTIMONIOS DE CLIENTES</div>
              
              <div className="testimonial">
                <div className="testimonial-icon">🤝</div>
                <div className="testimonial-content">
                  <div className="testimonial-text">
                    "El proceso fue claro y transparente. Ahora tengo energía limpia y soy dueño de mi sistema."
                  </div>
                  <div className="testimonial-author">
                    — Carlos R., Ponce
                  </div>
                </div>
              </div>
              
              <div className="testimonial">
                <div className="testimonial-icon">💡</div>
                <div className="testimonial-content">
                  <div className="testimonial-text">
                    "Mi factura eléctrica se redujo un 85% desde la instalación. La mejor inversión que he hecho."
                  </div>
                  <div className="testimonial-author">
                    — María S., San Juan
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="page-number">2</div>
        </div>

        {/* System Details Page */}
        <div className="page">
          <div className="page-header">
            <div className="header-content">
              <div className="header-title">
                <div className="large-icon-circle">☀</div>
                <div className="header-text">ESPECIFICACIONES DEL SISTEMA</div>
              </div>
              <div className="header-subtitle">Generado el {formatDate(currentDate)}</div>
            </div>
          </div>
          
          {/* System Details */}
          <div className="section-container">
            <div className="section-heading">Detalles del Sistema</div>
            <div className="data-row">
              <div className="data-column">
                <div className="data-label">Tamaño del Sistema</div>
                <div className="data-value">{systemSizeKW} kW</div>
              </div>
              <div className="data-column">
                <div className="data-label">Cantidad de Paneles</div>
                <div className="data-value">{safeCalculation.number_of_panels}</div>
              </div>
            </div>
            <div className="data-row">
              <div className="data-column">
                <div className="data-label">Capacidad por Panel</div>
                <div className="data-value">{safeCalculation.panel_capacity} W</div>
              </div>
              <div className="data-column">
                <div className="data-label">Eficiencia del Panel</div>
                <div className="data-value">{(safeCalculation.panel_efficiency * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
          
          {/* Production Details */}
          <div className="section-container">
            <div className="section-heading">Producción Estimada</div>
            <div className="data-row">
              <div className="data-column">
                <div className="data-label">Producción Mensual</div>
                <div className="data-value">{monthlyProduction} kWh</div>
              </div>
              <div className="data-column">
                <div className="data-label">Consumo Mensual</div>
                <div className="data-value">{safeCalculation.monthly_consumption.toFixed(1)} kWh</div>
              </div>
            </div>
            <div className="data-row">
              <div className="data-column">
                <div className="data-label">Ratio de Producción</div>
                <div className="data-value">{productionRatio}%</div>
              </div>
              <div className="data-column">
                <div className="data-label">Horas de Sol Promedio</div>
                <div className="data-value">{safeCalculation.sun_hours_per_day.toFixed(1)} horas/día</div>
              </div>
            </div>
            
            {/* Production Chart */}
            <div className="chart-container" id="production-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    name="Producción Solar (kWh)" 
                    dataKey="production" 
                    stroke="#e65c00" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    name="Consumo (kWh)"
                    dataKey="consumption" 
                    stroke="#2196f3" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Financial Overview */}
          <div className="section-container">
            <div className="section-heading">Resumen Financiero</div>
            <div className="data-row">
              <div className="data-column">
                <div className="data-label">Precio del Sistema</div>
                <div className="data-value">${ensureNumber(financingData?.principal, 25000).toLocaleString()}</div>
              </div>
              <div className="data-column">
                <div className="data-label">Incentivo</div>
                <div className="data-value">$6,000</div>
              </div>
            </div>
            <div className="data-row">
              <div className="data-column">
                <div className="data-label">Pago Mensual Estimado</div>
                <div className="data-value">
                  ${financingData?.incentiveType === 'principal' 
                    ? ensureNumber(financingData?.reducedMonthly, 210.50).toFixed(2) 
                    : ensureNumber(financingData?.monthly, 210.50).toFixed(2)}
                </div>
              </div>
              <div className="data-column">
                <div className="data-label">Tasa de Interés (APR)</div>
                <div className="data-value">{ensureNumber(financingData?.apr, 5.99).toFixed(2)}%</div>
              </div>
            </div>
          </div>
          
          <div className="page-number">3</div>
        </div>
      </body>
    </html>
  );
};

export default ProposalTemplate;
