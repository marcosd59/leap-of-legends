import { Link } from "react-router-dom";

const History = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Leap of Legends</h1>
      <video style={styles.video} controls>
        <source src="../../public/assets/menu/historia.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>
      <Link to="/menu">
        <button style={styles.button}>Volver al menú</button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100vw",
    backgroundImage: 'url("../../public/assets/menu/fondo.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "40px",
    color: "#fff",
  },
  title: {
    fontSize: "48px",
    color: "#6a0dad",
    textShadow: "0 0 10px #9b5de5, 0 0 20px #560bad, 0 0 30px #560bad",
    marginBottom: "30px",
    fontFamily: "'Orbitron', sans-serif",
  },
  video: {
    width: "50%",
    maxWidth: "1000px",
    borderRadius: "15px",
    boxShadow:
      "0px 0px 20px rgba(106, 13, 173, 0.5), 0px 0px 50px rgba(106, 13, 173, 0.3)",
    border: "2px solid rgba(106, 13, 173, 0.5)",
    marginBottom: "30px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "#6a0dad",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    textDecoration: "none",
    boxShadow:
      "0px 0px 10px rgba(106, 13, 173, 0.5), 0px 0px 20px rgba(106, 13, 173, 0.3)",
    transition: "background-color 0.3s, transform 0.3s",
  },
};

export default History;