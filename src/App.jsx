import { useState, useEffect, useCallback } from "react";
import sound from "./sounds/bell sound.mp3";
import Modal from "./components/Modal";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

const playIcon = <FontAwesomeIcon icon={faPlay} />;
const pauseIcon = <FontAwesomeIcon icon={faPause} />;
const lightIcon = <FontAwesomeIcon icon={faSun} />;
const darkIcon = <FontAwesomeIcon icon={faMoon} />;

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [phrase, setPhrase] = useState("Time to focus!");
  const [timerAction, setTimerAction] = useState(playIcon);
  const [darkMode, setDarkMode] = useState(false);

  const [openModal, setOpenModal] = useState(() => {
    const storedValue = localStorage.getItem("modalOpen");

    return storedValue ? JSON.parse(storedValue) : true;
  });

  const playSound = useCallback(() => {
    const audio = new Audio(sound);
    audio.volume = 0.3;
    audio.play();
  }, []);

  const focusTimer = useCallback(() => {
    setMinutes(25);
    setSeconds(0);
    setIsRunning(false);
    setTimerAction(playIcon);
    setPhrase("Time to focus!");
  }, []);

  const shortBreakTimer = useCallback(() => {
    setMinutes(5);
    setSeconds(0);
    setIsRunning(false);
    setTimerAction(playIcon);
    setPhrase("You deserve some rest!");
  }, []);

  const longBreakTimer = useCallback(() => {
    setMinutes(15);
    setSeconds(0);
    setIsRunning(false);
    setTimerAction(playIcon);
    setPhrase("You deserve some rest!");
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme) {
      setDarkMode(JSON.parse(theme));
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      const intervalTimer = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
          setIsRunning(false);
          setTimerAction(playIcon);
          clearInterval(intervalTimer);
          playSound();
          setTimeout(() => {
            setMinutes(25);
            setSeconds(0);
          }, 1000);
          return;
        }
        if (seconds === 0) {
          setSeconds(59);
          setMinutes((prevMinutes) => prevMinutes - 1);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);

      return () => clearInterval(intervalTimer);
    }
  }, [isRunning, minutes, seconds, playSound]);

  const startTimer = useCallback(() => {
    setIsRunning(!isRunning);
    if (isRunning) {
      setTimerAction(playIcon);
    } else {
      setTimerAction(pauseIcon);
    }
  }, [isRunning]);

  const closeAndSaveModal = () => {
    setOpenModal(false);
    localStorage.setItem("modalOpen", JSON.stringify(false));
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", JSON.stringify(!darkMode));
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      {openModal ? (
        <Modal darkMode={darkMode} closeModal={closeAndSaveModal}>
          <h3>What is the Pomodoro Technique?</h3>
          <p>
            The Pomodoro Technique is a time management method based on
            25-minute stretches of focused work broken by five-minute breaks.
            Longer breaks, typically 15 to 30 minutes, are taken after four
            consecutive work intervals. Each work interval is called a pomodoro,
            the Italian word for tomato.
          </p>
        </Modal>
      ) : (
        ""
      )}
      <div className="content-app">
        <div className={`options ${darkMode ? "dark-options" : ""}`}>
          <button onClick={focusTimer}>Focus</button>
          <button onClick={shortBreakTimer}>Short break</button>
          <button onClick={longBreakTimer}>Long break</button>
        </div>

        <div className="timer">
          <p>
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </p>
          <div className="timer-options">
            <button className={`options ${darkMode ? "dark-timer" : ""}`} onClick={startTimer}>{timerAction}</button>
          </div>
        </div>
        <p className="phrase">{phrase}</p>

        <div className="mode">
          {darkMode ? (
            <div onClick={handleThemeChange}>{lightIcon}</div>
          ) : (
            <div onClick={handleThemeChange}>{darkIcon}</div>
          )}
        </div>
        <div className="open-modal">
          <div onClick={() => setOpenModal((prev) => !prev)}>
            What is the pomodoro technique?
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
