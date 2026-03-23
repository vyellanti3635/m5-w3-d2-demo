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
import CreateList from "./CreateList";

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

    handleChange = (event) => {
      let title = this.state.singledata.title;
      let author = this.state.singledata.author;
      if (event.target.name === "title") title = event.target.value;
      else author = event.target.value;

      this.setState({
        singledata: {
          title: title,
          author: author
        }
      });
    }

    createList = () => {
      fetch("http://localhost:5001/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state.singledata)
      }).then(
        this.setState({
          singledata: {
            title: "",
            author: ""
          }
        })
      );
    }

    getList = (event, id) => {
      this.setState(
        {
          singledata: {
            title: "Loading...",
            author: "Loading..."
          }
        },
        () => {
          fetch("http://localhost:5001/posts/" + id)
            .then(res => res.json())
            .then(result => {
              this.setState({
                singledata: {
                  title: result.title,
                  author: result.author ? result.author : ""
                }
              });
            });
        }
      );
    }

    updateList = (event, id) => {
      fetch("http://localhost:5001/posts/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state.singledata)
      })
        .then(res => res.json())
        .then(result => {
          this.setState({
            singledata: {
              title: "",
              author: ""
            }
          });
          this.getLists();
        });
    }

    deleteList = (event, id) => {
      fetch("http://localhost:5001/posts/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(result => {
          this.setState({
            singledata: {
              title: "",
              author: ""
            }
          });
          this.getLists();
        });
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
        <Lists
          alldata={this.state.alldata}
          singledata={this.state.singledata}
          getList={this.getList}
          updateList={this.updateList}
          deleteList={this.deleteList}
          handleChange={this.handleChange}
        />
      );

      return (
        <div className="container">
          <span className="title-bar">Book List</span>
          <br />
          <button type="button" className="btn btn-primary" onClick={this.getLists}>
            Get Lists
          </button>
          <CreateList
            singledata={this.state.singledata}
            handleChange={this.handleChange}
            createList={this.createList}
          />
          {listTable}
        </div>
      );
    }
  }

export default App;