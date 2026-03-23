// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from "react";
import Lists from "./Lists";

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        alldata: [],
        singledata: {
          title: "",
          author: ""
        }
      };
    }

    getLists = () => {
      this.setState({ loading: true });

      fetch("http://localhost:5001/posts")
        .then((res) => res.json())
        .then((result) =>
          this.setState({
            loading: false,
            alldata: result
          })
        )
        .catch((error) => {
          console.log(error);
          this.setState({ loading: false });
        });
    };

    render() {
      const listTable = this.state.loading ? (
        <span>Loading Data......Please be patience.</span>
      ) : (
        <Lists alldata={this.state.alldata} />
      );

      return (
        <div className="container">
          <span className="title-bar">Book List</span>
          <br />
          <button type="button" className="btn btn-primary" onClick={this.getLists}>
            Get Lists
          </button>
          {listTable}
        </div>
      );
    }
  }

export default App;