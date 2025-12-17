import "./globals.css";

export const metadata = {
  title: "ChickenJockey Status",
  description: "Status + uptime for ChickenJockey services."
};

const themeInitScript = `
(function () {
  try {
    const stored = localStorage.getItem('theme');
    const useDark = stored ? (stored === 'dark') : true; // default DARK
    document.documentElement.classList.toggle('dark', useDark);
  } catch (e) {
    document.documentElement.classList.add('dark'); // default DARK
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
