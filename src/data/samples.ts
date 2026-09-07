export interface SampleData {
  title: string;
  companyText: string;
  offering: string;
  angle: string;
}

export const SAMPLE_DATA: SampleData = {
  title: "Aura Logistics (About Us & Mission)",
  companyText: `At Aura Logistics, our mission is to eliminate friction from global freight. Founded in 2021, we manage end-to-end multi-modal shipping for 450+ high-growth consumer brands across North America and Europe. 

Our core differentiator is our proprietary tracking platform that aggregates carrier updates. However, as international port volumes surged 34% this year, our dispatch operations team has faced unprecedented warehouse cross-dock delays and manual customs declaration bottlenecks. We pride ourselves on 99.2% on-time delivery guarantees, but expanding into refrigerated cargo and pharmaceutical distribution requires tightening our documentation cycle from 48 hours down to real-time.`,
  offering: `DocuSwift AI — an automated customs clearance and cross-dock documentation engine that auto-validates multi-modal manifests in 4 minutes instead of 48 hours, with direct API sync into customs brokers.`,
  angle: "pain_point",
};
