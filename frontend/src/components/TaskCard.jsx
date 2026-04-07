
export default function TaskCard({ title, description, 
    onDelete, onToggle, completed, color, rotation, isDeleting }) {  
    return (
    <div 
    onMouseEnter={(e) => 
  e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1.05)`
}

onMouseLeave={(e) => 
  e.currentTarget.style.transform = `rotate(${rotation}deg)`
}
    
    style={{
  background: color,
  padding: "15px",
  width: "220px",
  borderRadius: "2px",
  boxShadow: "4px 6px 12px rgba(0,0,0,0.3)",
  transform: `rotate(${rotation}deg) scale(1)`,
  transition: "transform 0.2s",
  animation: "dropIn 0.4s ease",
  animation: isDeleting 
  ? "fadeOut 0.3s ease forwards" 
  : "dropIn 0.4s ease",     
}

}
    >
      
      <h3 style={{ textDecoration: completed ? "line-through" : "none" }}>
  {title}
</h3>

<p style={{ textDecoration: completed ? "line-through" : "none" }}>
  {description}
</p>

    <div style={{ 
        display: "flex",
  gap: "20px",
  flexWrap: "wrap",
  marginTop: "20px",
  justifyContent: "center",
animation: "fadeIn 0.3s ease", }}
  >
      <button 
  onClick={onDelete}
  style={{
    marginTop: "10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px"
  }}
>
  Excluir
</button>
<button 
  onClick={onToggle}
  style={{
    marginTop: "10px",
    background: completed ? "#6b7280" : "#22c55e",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px"
  }}
>
  {completed ? "Desfazer" : "Concluir"}
</button>
  </div>
    </div>
  );
}