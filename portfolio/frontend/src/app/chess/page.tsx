import type { Metadata } from 'next';
import { ChessPage } from './ChessPage';

export const metadata: Metadata = {
  title: 'Chess Engine - Urav Maniar',
  description: 'AI-powered chess engine with multiple difficulty levels and learning algorithms',
};

export default function Chess() {
  return <ChessPage />;
}