// audio setup
let keyStrokeSounds = null

const initializeSounds = () => {
  if (!keyStrokeSounds && typeof window !== 'undefined') {
    keyStrokeSounds = [
      new Audio('/sounds/keystroke1.mp3'),
      new Audio('/sounds/keystroke2.mp3'),
      new Audio('/sounds/keystroke3.mp3'),
      new Audio('/sounds/keystroke4.mp3')
    ]
  }

  return keyStrokeSounds
}

function useKeyboardSound() {
  const playRandomKeyStrokeSound = () => {
    const sounds = initializeSounds()
    if (!sounds) return

    const randomSound = sounds[Math.floor(Math.random() * sounds.length)]

    randomSound.currentTime = 0 // this is for a better UX, def add this
    randomSound
      .play()
      .catch(error => console.error('Audio play failed: ', error))
  }

  return { playRandomKeyStrokeSound }
}

export default useKeyboardSound
