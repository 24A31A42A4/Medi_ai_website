import React from 'react';
const Placeholder = ({ title }) => (
  <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>{title}</h1>
    <p style={{ color: '#888', marginTop: '16px' }}>This page is under construction.</p>
  </div>
);

export const AdminDashboard = () => <Placeholder title="Admin Dashboard" />;
export const OrdersPage = () => <Placeholder title="My Orders" />;
export const AboutPage = () => <Placeholder title="About Us" />;
export const HelpCenterPage = () => <Placeholder title="Help Center" />;
export const WarrantyPage = () => <Placeholder title="Warranty" />;
export const ReturnsPage = () => <Placeholder title="Returns" />;
export const ContactPage = () => <Placeholder title="Contact Us" />;
export const PrivacyPage = () => <Placeholder title="Privacy Policy" />;
export const TermsPage = () => <Placeholder title="Terms of Service" />;
export const CookiesPage = () => <Placeholder title="Cookie Policy" />;
export const CareersPage = () => <Placeholder title="Careers" />;
export const NotFoundPage = () => <Placeholder title="404 - Page Not Found" />;
