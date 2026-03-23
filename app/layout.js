import "./globals.css";

export const metadata = {
  title: "Keteraraw Link Server",
  description: "Dynamic link routing for Keteraraw App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}