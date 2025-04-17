import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ProposalTemplate from './ProposalTemplate';
import type { SolarCalculation } from '../../../types/solar';
import type { Lead } from '../../../types/dashboard';

/**
 * Function to generate a PDF proposal using Puppeteer
 * This replaces the previous React-PDF implementation with an HTML-based approach
 * for better support of charts and proper page breaks
 */
export const generateProposal = async (
  calculation: Partial<SolarCalculation>,
  lead: Lead,
  financingData: any
): Promise<Blob> => {
  try {
    // Step 1: Generate HTML content using our React template
    const proposalElement = (
      <ProposalTemplate 
        calculation={calculation} 
        lead={lead} 
        financingData={financingData} 
      />
    );
    
    // Convert React component to HTML string
    const htmlContent = ReactDOMServer.renderToString(proposalElement);
    
    // Step 2: Send HTML to our Puppeteer service for PDF generation
    const serverUrl = process.env.NODE_ENV === 'production' 
      ? '/api/generate-pdf'  // Production URL
      : 'http://localhost:3001/api/generate-pdf'; // Development URL
      
    const filename = `Solar_Proposal_${lead.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: htmlContent,
        filename
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    // Return the PDF blob
    return await response.blob();
    
  } catch (error) {
    console.error('Error generating proposal PDF:', error);
    throw error;
  }
};

// Export a component that can be used to preview the proposal in the browser
export const ProposalPreview: React.FC<{
  calculation: Partial<SolarCalculation>;
  lead: Lead;
  financingData: any;
}> = ({ calculation, lead, financingData }) => {
  return <ProposalTemplate calculation={calculation} lead={lead} financingData={financingData} />;
};
