import React, { useState, useEffect, useCallback } from 'react';
import './Cutscene.css';

const Cutscene = ({ 
  scene, 
  onComplete, 
  playerName = "Adventurer",
  autoPlay = true,
  speakLines = true 
}) => {
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [canContinue, setCanContinue] = useState(false);

  // Dialogue data with character emotion states
  const dialogues = {
    intro: [
      { 
        character: 'Eldric',
        text: `Welcome, ${playerName}, to the Whisper World.`,
        emotion: 'welcoming',
        position: 'right'
      },
      {
        character: 'Narrator',
        text: 'A world once filled with vibrant voices, now shrouded in magical silence.',
        emotion: 'mysterious',
        position: 'center'
      },
      {
        character: 'Eldric',
        text: 'Queen Murmura has locked away the voices of our people in magical words.',
        emotion: 'concerned',
        position: 'right'
      }
    ],
    levelComplete: [
      {
        character: 'FreedSpirit',
        text: 'Thank you for breaking the spell! My voice... I can speak again!',
        emotion: 'joyful',
        position: 'left'
      },
      {
        character: 'Eldric',
        text: 'Well done! Each freed voice weakens Queen Murmura\'s curse.',
        emotion: 'pleased',
        position: 'right'
      }
    ],
    // Add more scenes as needed
  };

  const currentSceneDialogues = dialogues[scene] || [];

  // Text typing animation effect
  const typeText = useCallback((text, callback) => {
    setIsTyping(true);
    setCanContinue(false);
    let index = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setCanContinue(true);
        if (callback) callback();
      }
    }, 30); // Adjust typing speed here

    return () => clearInterval(interval);
  }, []);

  // Handle text-to-speech
  const speakDialogue = async (text, character) => {
    if (!speakLines) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Different voices for different characters
    const voices = window.speechSynthesis.getVoices();
    switch (character) {
      case 'Eldric':
        utterance.voice = voices.find(voice => voice.name.includes('Male')) || null;
        break;
      case 'FreedSpirit':
        utterance.voice = voices.find(voice => voice.name.includes('Female')) || null;
        break;
      default:
        utterance.voice = voices[0];
    }

    window.speechSynthesis.speak(utterance);
  };

  // Handle dialogue progression
  const progressDialogue = () => {
    if (!canContinue) return;
    
    if (currentDialogue < currentSceneDialogues.length - 1) {
      setCurrentDialogue(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  // Auto-progress dialogue if autoPlay is true
  useEffect(() => {
    if (currentSceneDialogues.length === 0) return;
    
    const currentLine = currentSceneDialogues[currentDialogue];
    typeText(currentLine.text, () => {
      speakDialogue(currentLine.text, currentLine.character);
    });

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentDialogue, scene]);

  if (!currentSceneDialogues.length) return null;

  const currentLine = currentSceneDialogues[currentDialogue];

  return (
    <div className="cutscene-container">
      <div className="scene-background"></div>
      
      <div className="character-container">
        {currentLine.character !== 'Narrator' && (
          <div className={`character ${currentLine.position} ${currentLine.emotion}`}>
            <div className="character-name">{currentLine.character}</div>
          </div>
        )}
      </div>

      <div className="dialogue-box" onClick={progressDialogue}>
        {currentLine.character !== 'Narrator' && (
          <div className="speaker-name">{currentLine.character}</div>
        )}
        <div className="dialogue-text">
          {displayedText}
          {isTyping && <span className="typing-cursor">|</span>}
        </div>
        
        {canContinue && (
          <div className="continue-prompt">
            Click to continue...
          </div>
        )}
      </div>

      {!autoPlay && (
        <div className="dialogue-controls">
          <button 
            className="control-button"
            onClick={progressDialogue}
            disabled={!canContinue}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Cutscene;