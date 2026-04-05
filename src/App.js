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
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      books: [],
      mode: "list",
      selectedId: null,
      form: {
        title: "",
        author: "",
      },
      error: "",
    };
  }

  componentDidMount() {
    this.getBooks();
  }

  apiBase = process.env.REACT_APP_API_URL || "http://localhost:5001";

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        [name]: value,
      },
    }));
  };

  getBooks = () => {
    this.setState({ loading: true, error: "" });

    fetch(`${this.apiBase}/books`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load books.");
        }
        return res.json();
      })
      .then((result) => {
        this.setState({ loading: false, books: result });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  };

  startAdd = () => {
    this.setState({
      mode: "add",
      selectedId: null,
      form: { title: "", author: "" },
      error: "",
    });
  };

  startEdit = (book) => {
    this.setState({
      mode: "edit",
      selectedId: book._id,
      form: {
        title: book.title,
        author: book.author,
      },
      error: "",
    });
  };

  cancelForm = () => {
    this.setState({
      mode: "list",
      selectedId: null,
      form: { title: "", author: "" },
      error: "",
    });
  };

  createBook = (event) => {
    event.preventDefault();
    fetch(`${this.apiBase}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.form),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to create book.");
        }
        return res.json();
      })
      .then(() => {
        this.cancelForm();
        this.getBooks();
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  updateBook = (event) => {
    event.preventDefault();
    if (!this.state.selectedId) {
      return;
    }

    fetch(`${this.apiBase}/books/${this.state.selectedId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.form),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to update book.");
        }
        return res.json();
      })
      .then(() => {
        this.cancelForm();
        this.getBooks();
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  deleteBook = (id) => {
    fetch(`${this.apiBase}/books/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to delete book.");
        }
        return res.json();
      })
      .then(() => {
        this.getBooks();
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  renderForm = () => {
    if (this.state.mode === "list") {
      return null;
    }

    const isEdit = this.state.mode === "edit";

    return (
      <div className="book-form-wrapper">
        <h2>{isEdit ? "Edit Book" : "Add Book"}</h2>
        <form onSubmit={isEdit ? this.updateBook : this.createBook}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Book Title</label>
            <input
              id="title"
              type="text"
              name="title"
              className="form-control"
              value={this.state.form.title}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="author" className="form-label">Author</label>
            <input
              id="author"
              type="text"
              name="author"
              className="form-control"
              value={this.state.form.author}
              onChange={this.handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary me-2">Save</button>
          <button type="button" className="btn btn-secondary" onClick={this.cancelForm}>
            Cancel
          </button>
        </form>
      </div>
    );
  };

  renderList = () => {
    if (this.state.loading) {
      return <p>Loading books...</p>;
    }

    return (
      <div>
        <h2>Book List</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-info btn-sm me-2"
                    onClick={() => this.startEdit(book)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    onClick={() => this.deleteBook(book._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    return (
      <div className="app-page">
          {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
          {this.state.mode === "list" && (
            <button type="button" className="btn btn-primary mb-4" onClick={this.startAdd}>
              Add Book
            </button>
          )}
          {this.renderForm()}
          {this.state.mode === "list" && this.renderList()}
      </div>
    );
  }
}

export default App;