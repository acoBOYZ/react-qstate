import './App.css'
import GithubLogo from '/github-mark-white.svg'
import { useQState } from '@acoboyz/react-qstate';

function App() {
  const [, setData, resetData] = useQState([0], 'App');

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
        {/* <p>
        <input onChange={(e) => setData(e.target.value)} /> {" "} {data}
        </p> */}
        <p>
          Change above label input value and you can see the async magic!
        </p>
      </div>
    </>
  )
}

function StateHeader() {
  const [data] = useQState([0], 'StateHeader');
  return (
    <>
      <h1>{data}</h1>
    </>
  );
}

export default App
