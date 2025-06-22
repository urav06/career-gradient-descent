import type { Metadata } from 'next';
import { ResumeGeneratorPage } from './ResumeGeneratorPage';

export const metadata: Metadata = {
  title: 'Resume Generator - Urav Maniar',
  description: 'YAML to ATS-friendly PDF conversion tool with customizable templates',
};

export default function ResumeGenerator() {
  return <ResumeGeneratorPage />;
}