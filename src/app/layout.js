// src/app/layout.js

// import './globals.css'

export const metadata = {
  title: 'SQL Exorcism Mystery Game',
  description: 'Learn SQL by solving mysterious exorcism riddles',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      {/* <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script> */}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}