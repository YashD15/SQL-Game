'use client';
import { useEffect, useState } from 'react';

export default function SecurityWrapper({ children, onSecurityViolation }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    let isGameActive = true;
    
    // Fullscreen change handler
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && isGameActive) {
        onSecurityViolation('Fullscreen mode exited');
      }
    };
    
    // Visibility change handler (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden && isGameActive) {
        onSecurityViolation('Tab switched or window lost focus');
      }
    };
    
    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    
    // Prevent F12 and other dev tools shortcuts
    const handleKeyDown = (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
        onSecurityViolation('Developer tools access attempted');
      }
    };
    
    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      isGameActive = false;
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSecurityViolation]);
  
  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };
  
  if (!isFullscreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Security Notice</h2>
          <p className="mb-6">
            This game must run in fullscreen mode for security reasons.
            Exiting fullscreen or switching tabs will end the game.
          </p>
          <button
            onClick={enterFullscreen}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Start Game (Enter Fullscreen)
          </button>
        </div>
      </div>
    );
  }
  
  return children;
}