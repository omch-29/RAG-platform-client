import './globals.css';

export const metadata = {
  title: 'RAG Platform',
  description: 'Multi-tenant retrieval-augmented Q&A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}