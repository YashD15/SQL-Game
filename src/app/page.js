// src/app/page.js

import ExorcismGame from '../app/components/ExorcismGame';
// import './globals.css'

export default function HomePage() {
  return (
    <main>
      <ExorcismGame />
    </main>
  );
}

export const metadata = {
  title: 'SQL Exorcism Mystery Game',
  description: 'Learn SQL by solving mysterious exorcism riddles through database queries',
};