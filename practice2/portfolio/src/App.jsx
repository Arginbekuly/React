import Header from './components/Header';
import AboutMe from './components/AboutMe';
import Contacts from './components/Contacts';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <Header />
            <AboutMe />
            <Contacts />
        </div>
    );
}

export default App;