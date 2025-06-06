import { ApolloProvider } from '@apollo/client';
import './App.css'
import { client } from './utils/ApolloCient';
import AskForm from './components/AskForm';

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <header className="app-header">
          <h1>Panda AI 问答</h1>
        </header>
        <main>
          <AskForm />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App
