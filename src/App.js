import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from './screens/Main';
import Payment from './screens/Payment';
import Header from "./components/Header";
import Summary from "./screens/Summary";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <ToastContainer />
        <Route exact path="/" component={Main} />
        <Route path="/payment" component={Payment} />
        <Route path="/summary" component={Summary} />
      </Router>
    </div>
  );
}

export default App;
