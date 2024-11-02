import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const Home = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    document.body.style.backgroundImage =
      'url("../../public/assets/menu/background.png")';
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    if (audioRef.current) {
      audioRef.current.volume = 0.1;
    }

    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <div style={styles.container}>
      <audio ref={audioRef} autoPlay loop>
        <source src="../../public/assets/menu/intro.ogg" type="audio/ogg" />
        Tu navegador no soporta el elemento de audio.
      </audio>
      <h1 style={styles.title}>Leap of Legends</h1>
      <h2 style={styles.subtitle}>Selecciona un nivel</h2>
      <div style={styles.buttonContainer}>
        <Link to="/level1">
          <button style={styles.button}>Nivel 1</button>
        </Link>
        <Link to="/level2">
          <button style={styles.button}>Nivel 2</button>
        </Link>
        <Link to="/level3">
          <button style={styles.button}>Nivel 3</button>
        </Link>
        <Link to="/level4">
          <button style={styles.button}>Nivel 4</button>
        </Link>
        <Link to="/level5">
          <button style={styles.button}>Nivel 5</button>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    padding: "25px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "20px",
    width: "70%",
    margin: "auto",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "36px",
    color: "#333",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "24px",
    color: "#666",
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "30px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "#6a0dad",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Home;
