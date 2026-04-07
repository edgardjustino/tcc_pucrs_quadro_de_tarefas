import { useState, useEffect } from "react"; // useEffect
import axios from "axios"; //axios
import TaskCard from "../components/TaskCard";
import { useAuth } from '../context/AuthContext'; 

// URL base da API para não ficar repetindo
const API_URL = "http://localhost:4000/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();

  // useEffect para buscar as tarefas do backend quando a página carrega
  useEffect(() => {
    // A função que busca os dados
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`);
        setTasks(response.data); // response.data contém o array de tarefas vindo do backend
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };

    fetchTasks(); // Executando a função
  }, []); // array vazio significa só roda UMA VEZ, quando o componente é montado.


  const colors = ["#fde047", "#fca5a5", "#93c5fd", "#86efac", "#f9a8d4"];

  // função para adicionar tarefa
  const addTask = async () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRotation = Math.floor(Math.random() * 4) - 2;

    const newTaskPayload = {
      title,
      description,
      completed: false,
      color: randomColor,
      rotation: randomRotation,
      isDeleting: false // Propriedade para a animação
    };

    try {
      // requisição POST para o backend
      const response = await axios.post(`${API_URL}/tasks`, newTaskPayload);
      const savedTask = response.data; // O backend nos devolve a tarefa salva com o ID

      // Adiciondo a tarefa salva (com ID) ao estado local
      setTasks([...tasks, savedTask]);
      
      setTitle("");
      setDescription("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

    // função para deletar tarefa
  const deleteTask = async (idToDelete) => {
    // Removemos a tarefa do estado imediatamente.
    // Guarda as tarefas antigas caso precise reverter.
    const originalTasks = [...tasks];
    setTasks(prevTasks => prevTasks.filter(task => task.id !== idToDelete));

    // 2. tentando deletar no backend
    try {
      // Chama a API para deletar do banco de dados.
      await axios.delete(`${API_URL}/tasks/${idToDelete}`);
      // Se chegou aqui, o backend confirmou a deleção. Sucesso!
      console.log(`Tarefa ${idToDelete} deletada com sucesso no backend.`);

    } catch (error) {
      // 3. REVERSÃO EM CASO DE ERRO
      console.error("ERRO: O backend não conseguiu deletar a tarefa. Revertendo a interface.", error);
      // Se a chamada à API falhou, restaura o estado original.
      setTasks(originalTasks);
      alert("Não foi possível deletar a tarefa. Por favor, tente novamente.");
    }
  };


  // função de toggle (ainda não implementada no backend, mas o frontend está pronto)
  const toggleTask = (indexToToggle) => {
    // FUNÇÃO AINDA NÃO PERSISTE NO BACKEND, mas a lógica do frontend está aqui
    const updatedTasks = tasks.map((task, index) => {
      if (index === indexToToggle) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  return (
    <>
      {/* TELA PRINCIPAL */}
      <div style={{ padding: "20px", minHeight: "100vh", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
  <h1 style={{ color: "#ffffff", fontSize: "28px", textAlign: 'center', marginBottom: '20px' }}>
    📌 Quadro de Tarefas
  </h1>
</div>

        {/* CARDS */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px", justifyContent: "flex-start" }}>
          {/* id da tarefa como key */}
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id} 
              title={task.title}
              description={task.description}
              completed={task.completed}
              onDelete={() => deleteTask(task.id)} // Passando o ID real
              onToggle={() => toggleTask(index)} // Mantendo o index por enquanto
              color={task.color}
              rotation={task.rotation}
              isDeleting={task.isDeleting}
            />
          ))}
        </div>
      </div>

      {/* BOTÃO FLUTUANTE */}
      <button onClick={() => setIsModalOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", width: "60px", height: "60px", borderRadius: "50%", background: "#facc15", border: "none", fontSize: "30px", fontWeight: "bold", color: "#1f2937", cursor: "pointer", boxShadow: "0 6px 15px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
        +
      </button>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#ffffff", padding: "25px", borderRadius: "12px", width: "320px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", gap: "10px" }}>
            <h2 style={{ margin: 0, marginBottom: "10px", color: "#1f2937" }}>
              Nova Tarefa
            </h2>
            <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", outline: "none" }} />
            <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", outline: "none" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "#e5e7eb", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>
                Cancelar
              </button>
              {/* ATUALIZADO: O botão salvar agora chama nossa nova função assíncrona */}
              <button onClick={addTask} style={{ background: "#22c55e", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
