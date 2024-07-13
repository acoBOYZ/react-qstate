import './App.css'
import GithubLogo from '/github-mark-white.svg'
import { useTestState } from './state';

function App() {
  const [, setData, resetData] = useTestState('x');

  return (
    <>
      <div>
        <a href="https://github.com/acoBOYZ/react-qstate.git" target="_blank">
          <img src={GithubLogo} className="logo react" alt="Github logo" />
        </a>
      </div>
      <StateHeader />
      <div className="card">
        <input onChange={(e) => setData(e.target.value)} />
        <p>
          <button onClick={resetData} ><h2>RESET QSTATE</h2></button>
        </p>
        <p>
          Change above label input value and you can see the async magic!
        </p>
      </div>
    </>
  )
}

function StateHeader() {
  const [data] = useTestState('x');
  return (
    <>
      <h1>{data}</h1>
    </>
  );
}

export default App
