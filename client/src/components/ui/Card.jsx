export default function Card({ children, className = '', dashed = false }) {
  return (
    <div className={`${dashed ? 'litl-card-dashed' : 'litl-card'} ${className}`}>
      {children}
    </div>
  )
}
