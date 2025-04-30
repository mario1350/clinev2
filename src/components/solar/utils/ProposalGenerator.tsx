import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import type { SolarCalculation } from "../../../types/solar";
import type { Lead } from "../../../types/dashboard";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  COMPANY_STATS,
  INCENTIVE_AMOUNT,
  DEFAULT_CALCULATION,
} from "./proposalConstants";

/**
 * Type for financing data used in proposal generation.
 */
export interface FinancingData {
  loanTerm: number;
  creditScoreRange: string;
  principal: number;
  incentiveType?: "principal" | "other" | "cashback" | undefined;
  reducedMonthly?: number;
  monthly?: number;
  apr?: number;
  reducedPrincipal?: number;
  totalInterest?: number;
  reducedTotalInterest?: number;
  total?: number;
  reducedTotal?: number;
}

// Define icons (simple unicode symbols as placeholders)
const icons = {
  solar: "☀️",
  money: "💰",
  warning: "⚠️",
  chart: "📊",
  check: "✓",
  info: "ℹ️",
  calendar: "📅",
  home: "🏠",
  leaf: "🍃",
  lightbulb: "💡",
  tools: "🔧",
  target: "🎯",
  shield: "🛡️",
  star: "⭐",
  handshake: "🤝",
  document: "📄",
  compare: "⚖️",
};

// Define colors
const colors = {
  primaryOrange: "#e65c00",
  secondaryOrange: "#f9a825",
  tertiaryOrange: "#ffb74d",
  beige: "#fff3e0",
  white: "#ffffff",
  textDark: "#333333",
  textLight: "#666666",
  gray100: "#f5f5f5",
  gray200: "#eeeeee",
  gray300: "#e0e0e0",
  gray800: "#424242",
  blue: "#2196f3",
  green: "#4caf50",
  red: "#f44336",
};

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: colors.white,
    fontFamily: "Helvetica",
  },
  coverPage: {
    backgroundColor: colors.primaryOrange,
    padding: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  coverTitle: {
    fontSize: 52,
    fontWeight: 700,
    color: colors.white,
    textAlign: "center",
    marginBottom: 15,
  },
  coverSubtitle: {
    fontSize: 26,
    color: colors.white,
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 70,
  },
  coverClient: {
    fontSize: 22,
    color: colors.white,
    textAlign: "center",
    marginTop: 25,
  },
  coverTagline: {
    fontSize: 20,
    color: colors.white,
    textAlign: "center",
    marginTop: 90,
    opacity: 0.9,
  },
  executiveSummaryPage: {
    padding: 0,
    margin: 0,
    backgroundColor: colors.secondaryOrange,
    fontFamily: "Helvetica",
  },
  executiveSummaryContent: {
    padding: 40,
  },
  executiveSummaryTitle: {
    fontSize: 38,
    fontWeight: 700,
    color: colors.white,
    marginBottom: 35,
    textAlign: "left",
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
  },
  sectionCardParagraph: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 15,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  missionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  goalsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: colors.green,
  },
  comparisonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  comparisonItemIcon: {
    width: 30,
    textAlign: "center",
    fontSize: 16,
    color: colors.primaryOrange,
  },
  comparisonItemText: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
    paddingLeft: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: colors.textLight,
  },
  section: {
    margin: 10,
    padding: 22,
    backgroundColor: colors.beige,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondaryOrange,
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.primaryOrange,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  column: {
    flex: 1,
    paddingHorizontal: 6,
  },
  label: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: 600,
  },
  value: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 1.4,
  },
});

// Strong type for financing data
export interface FinancingData {
  principal: number;
  incentiveType?: "principal" | "other";
  reducedMonthly?: number;
  monthly?: number;
  apr?: number;
}

// Helper function to ensure numeric values have fallbacks
const ensureNumber = (value: any, fallback: number = 0): number => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return fallback;
  }
  return Number(value);
};

// PDF Generation Utility
/**
 * Generates a proposal PDF as a Blob using @react-pdf/renderer.
 * This renders the ProposalDocument React component tree to a PDF.
 *
 * @param calculation - Partial solar calculation data
 * @param lead - Lead information
 * @param financingData - Financing details (strongly typed)
 * @returns Promise<Blob> - The generated PDF as a Blob
 */
export const generateProposal = async (
  calculation: Partial<SolarCalculation>,
  lead: Lead,
  financingData: FinancingData
): Promise<Blob> => {
  return pdf(
    <ProposalDocument
      calculation={calculation}
      lead={lead}
      financingData={financingData}
    />
  ).toBlob();
};

// Subcomponents for maintainability

const CoverPage: React.FC<{ lead: Lead; date: Date }> = ({ lead, date }) => {
  const formatDate = (date: Date) => {
    try {
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });
    }
  };
  return (
    <Page size="A4" style={styles.coverPage}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Text style={styles.coverTitle}>PROPUESTA DE SISTEMA SOLAR</Text>
        <Text style={styles.coverSubtitle}>Diseñado específicamente para:</Text>
        <Text style={styles.coverClient}>{lead.name}</Text>
        <View
          style={{
            marginTop: 80,
            padding: 20,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: 15,
            width: "80%",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              color: colors.white,
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            Energía sin Intermediarios. Sin Comisiones. Sin Mentiras.
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.white,
              opacity: 0.8,
            }}
          >
            Generado el {formatDate(date)}
          </Text>
        </View>
      </View>
    </Page>
  );
};

const ExecutiveSummaryPage: React.FC = () => (
  <Page size="A4" style={styles.executiveSummaryPage}>
    <View style={{ ...styles.executiveSummaryContent, paddingTop: 25, paddingBottom: 30 }}>
      <Text style={styles.executiveSummaryTitle}>RESUMEN EJECUTIVO</Text>
      {/* Situation Card */}
      <View style={[styles.sectionCard, { borderLeftColor: colors.primaryOrange }]}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.primaryOrange,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: colors.white, fontSize: 14, fontWeight: 700 }}>i</Text>
          </View>
          <Text style={{ color: colors.primaryOrange, fontSize: 18, fontWeight: 700 }}>
            Situación Actual
          </Text>
        </View>
        <Text style={styles.sectionCardParagraph}>
          Puerto Rico vive una transformación energética urgente. La mayoría de los hogares están atrapados en contratos de arrendamiento con empresas como Sunrun o Sunnova, que no ofrecen la propiedad real del sistema y esconden costos a largo plazo.
        </Text>
        <Text style={styles.sectionCardParagraph}>
          SunCom rompe el molde ofreciendo una alternativa clara, directa y justa: propiedad total, sin intermediarios ni comisiones ocultas que inflan el precio final.
        </Text>
      </View>
      {/* Mission Card */}
      <View style={styles.missionCard}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.blue,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: colors.white, fontSize: 14, fontWeight: 700 }}>⦿</Text>
          </View>
          <Text style={{ color: colors.blue, fontSize: 18, fontWeight: 700 }}>
            Misión de SunCom
          </Text>
        </View>
        <Text style={styles.sectionCardParagraph}>
          Nuestra misión es transformar el acceso a la energía solar en Puerto Rico, ofreciendo sistemas de alta calidad con total transparencia y sin intermediarios. Buscamos empoderar a los propietarios para que sean verdaderos dueños de su producción energética, eliminando las barreras financieras y contractuales que han dominado el mercado.
        </Text>
      </View>
      {/* Goals Card */}
      <View style={{ ...styles.goalsCard, marginTop: 25 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.green,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: colors.white, fontSize: 14, fontWeight: 700 }}>★</Text>
          </View>
          <Text style={{ color: colors.green, fontSize: 18, fontWeight: 700 }}>
            Objetivos de SunCom
          </Text>
        </View>
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonItemIcon}>{icons.check}</Text>
          <Text style={styles.comparisonItemText}>
            Democratizar el acceso a la energía solar mediante modelos de propiedad directa
          </Text>
        </View>
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonItemIcon}>{icons.check}</Text>
          <Text style={styles.comparisonItemText}>
            Eliminar comisiones ocultas y escaladores de precios del mercado solar
          </Text>
        </View>
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonItemIcon}>{icons.check}</Text>
          <Text style={styles.comparisonItemText}>
            Proporcionar garantías claras y auditables que protejan la inversión del cliente
          </Text>
        </View>
      </View>
      {/* Incentive Card */}
      <View
        style={{
          backgroundColor: colors.white,
          borderRadius: 12,
          padding: 20,
          marginBottom: 25,
          borderWidth: 1,
          borderColor: colors.primaryOrange,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.primaryOrange,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: 700 }}>$</Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: colors.primaryOrange,
            }}
          >
            INCENTIVO DE ${INCENTIVE_AMOUNT.toLocaleString()}
          </Text>
        </View>
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonItemIcon}>{icons.check}</Text>
          <Text style={styles.comparisonItemText}>
            Se otorga directamente al cliente para reducir el costo o el principal de su préstamo.
          </Text>
        </View>
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonItemIcon}>{icons.check}</Text>
          <Text style={styles.comparisonItemText}>
            Sin ITC ni estructuras piramidales: tú eres dueño de tu sistema desde el día uno.
          </Text>
        </View>
      </View>
      {/* Company Stats */}
      <View
        style={{
          backgroundColor: colors.white,
          borderRadius: 12,
          marginTop: 15,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: colors.primaryOrange,
        }}
      >
        <View style={{ padding: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: colors.primaryOrange,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            NUESTRO IMPACTO
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View style={{ alignItems: "center", width: "30%" }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.primaryOrange,
                }}
              >
                +{COMPANY_STATS.installedKW} kW
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textDark,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                INSTALADOS
              </Text>
            </View>
            <View style={{ alignItems: "center", width: "30%" }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.primaryOrange,
                }}
              >
                +{COMPANY_STATS.clients}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textDark,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                CLIENTES
              </Text>
            </View>
            <View style={{ alignItems: "center", width: "30%" }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.primaryOrange,
                }}
              >
                +{COMPANY_STATS.storedKWh.toLocaleString()}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textDark,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                KWh ALMACENADOS
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* Customer Testimonials */}
      <View
        style={{
          backgroundColor: colors.white,
          borderRadius: 12,
          marginTop: 25,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: colors.green,
          padding: 15,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: colors.green,
            marginBottom: 15,
            textAlign: "center",
          }}
        >
          TESTIMONIOS DE CLIENTES
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.beige,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 22 }}>{icons.handshake}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontStyle: "italic",
                color: colors.textDark,
                lineHeight: 1.3,
              }}
            >
              "El proceso fue claro y transparente. Ahora tengo energía limpia y soy dueño de mi sistema."
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: colors.primaryOrange,
                marginTop: 5,
              }}
            >
              — Carlos R., Ponce
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.beige,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 22 }}>{icons.lightbulb}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontStyle: "italic",
                color: colors.textDark,
                lineHeight: 1.3,
              }}
            >
              "Mi factura eléctrica se redujo un 85% desde la instalación. La mejor inversión que he hecho."
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: colors.primaryOrange,
                marginTop: 5,
              }}
            >
              — María S., San Juan
            </Text>
          </View>
        </View>
      </View>
    </View>
    <Text
      style={styles.pageNumber}
      render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      fixed
    />
  </Page>
);

/**
 * System details page for the PDF.
 */
const SystemDetailsPage: React.FC<{
  calculation: Partial<SolarCalculation>;
  financingData: FinancingData;
}> = ({ calculation, financingData }) => {
  // Ensure all calculation values have fallbacks
  const safeCalculation = {
    ...DEFAULT_CALCULATION,
    ...calculation,
  };

  const systemSizeKW = (
    ensureNumber(safeCalculation.number_of_panels, DEFAULT_CALCULATION.number_of_panels) *
    ensureNumber(safeCalculation.panel_capacity, DEFAULT_CALCULATION.panel_capacity) /
    1000
  ).toFixed(2);

  const monthlyProduction = (
    ensureNumber(safeCalculation.adjusted_system_size, DEFAULT_CALCULATION.adjusted_system_size) *
    ensureNumber(safeCalculation.sun_hours_per_day, DEFAULT_CALCULATION.sun_hours_per_day) *
    30
  ).toFixed(2);

  const productionRatio = (
    (parseFloat(monthlyProduction) /
      ensureNumber(safeCalculation.monthly_consumption, DEFAULT_CALCULATION.monthly_consumption)) *
    100
  ).toFixed(1);

  return (
    <Page size="A4" style={styles.page}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
          paddingBottom: 15,
          borderBottomWidth: 1,
          borderBottomColor: colors.primaryOrange,
        }}
      >
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.primaryOrange,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ color: colors.white, fontSize: 18, fontWeight: 700 }}>☀</Text>
            </View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: colors.primaryOrange,
              }}
            >
              ESPECIFICACIONES DEL SISTEMA
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: colors.textLight,
              marginTop: 5,
            }}
          >
            Generado el {format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es })}
          </Text>
        </View>
      </View>
      {/* System Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles del Sistema</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Tamaño del Sistema</Text>
            <Text style={styles.value}>{systemSizeKW} kW</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Cantidad de Paneles</Text>
            <Text style={styles.value}>{safeCalculation.number_of_panels}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Capacidad por Panel</Text>
            <Text style={styles.value}>{safeCalculation.panel_capacity} W</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Eficiencia del Panel</Text>
            <Text style={styles.value}>
              {(ensureNumber(safeCalculation.panel_efficiency, DEFAULT_CALCULATION.panel_efficiency) * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
      {/* Production Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Producción Estimada</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Producción Mensual</Text>
            <Text style={styles.value}>{monthlyProduction} kWh</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Consumo Mensual</Text>
            <Text style={styles.value}>
              {ensureNumber(safeCalculation.monthly_consumption, DEFAULT_CALCULATION.monthly_consumption).toFixed(1)} kWh
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Ratio de Producción</Text>
            <Text style={styles.value}>{productionRatio}%</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Horas de Sol Promedio</Text>
            <Text style={styles.value}>
              {ensureNumber(safeCalculation.sun_hours_per_day, DEFAULT_CALCULATION.sun_hours_per_day).toFixed(1)} horas/día
            </Text>
          </View>
        </View>
      </View>
      {/* Financial Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen Financiero</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Precio del Sistema</Text>
            <Text style={styles.value}>
              $
              {ensureNumber(financingData?.principal, 25000).toLocaleString()}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Incentivo</Text>
            <Text style={styles.value}>${INCENTIVE_AMOUNT.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Pago Mensual Estimado</Text>
            <Text style={styles.value}>
              $
              {financingData?.incentiveType === "principal"
                ? ensureNumber(financingData?.reducedMonthly, 210.5).toFixed(2)
                : ensureNumber(financingData?.monthly, 210.5).toFixed(2)}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Tasa de Interés (APR)</Text>
            <Text style={styles.value}>
              {ensureNumber(financingData?.apr, 5.99).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  );
};

// Main PDF Document component
const ProposalDocument: React.FC<{
  calculation: Partial<SolarCalculation>;
  lead: Lead;
  financingData: FinancingData;
}> = ({ calculation, lead, financingData }) => {
  const currentDate = new Date();
  return (
    <Document>
      <CoverPage lead={lead} date={currentDate} />
      <ExecutiveSummaryPage />
      <SystemDetailsPage calculation={calculation} financingData={financingData} />
    </Document>
  );
};

export default ProposalDocument;
