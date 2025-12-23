
import { useState } from 'react'
import ImportModal from './components/ImportModal'
import ScenarioSidebar from './components/ScenarioSidebar'
import './index.css'

function App() {
  const [showModal, setShowModal] = useState(true)
  const [activeScenario, setActiveScenario] = useState(null)

  return (
    <>
      <ScenarioSidebar onSelectScenario={(scenario) => {
        setShowModal(true); // Ensure modal is open
        setActiveScenario(scenario);
      }} />

      <div className="flex flex-col items-center gap-4">
        <h1>Sapo Product Import</h1>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0088FF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 500
          }}
        >
          Open Import Modal
        </button>
      </div>

      {showModal && (
        <ImportModal
          onClose={() => setShowModal(false)}
          externalScenario={activeScenario}
        />
      )}
    </>
  )
}

export default App
