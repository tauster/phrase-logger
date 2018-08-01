/*
  This React app uses the phrase logger server in order
  to both display and control the database.

  Tausif Sharif
*/

// Importing required packages.
import * as $ from 'jquery';
import * as React from 'react';
import * as Modal from 'react-modal';
import './App.css';

// Types for state variables.
interface IStateTypes {addPhrase: string, phraseList: string[], showModal: boolean};

// Styling properties for add phrase modal.
const customStyles: any = {
  content: {
    bottom: 'auto',
    left: '50%',
    marginRight: '-50%',
    right: 'auto',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
};

// Main App class.
class App extends React.Component<{}, IStateTypes> {
  // Main App constructor.
  constructor(props: any) {
    super(props);

    // State properties.
    this.state = {
      addPhrase: "",
      phraseList: [],
      showModal: false
    }

    // Binding this into avaialbe functions.
    this.handleInput = this.handleInput.bind(this);
    this.writeToStorage = this.writeToStorage.bind(this);
    this.deletePhrase = this.deletePhrase.bind(this);
    
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  // Prepares the list view using the GET /read request from server.
  public prepareList() {
    // Handles requests and responses via AJAX.
    $.ajax({
      dataType: 'json',
      method: "GET",
      url: "http://localhost:8080/read",

      success: (storageList) => {
        const phraseRows: any[] = [];
        const phrases: any[] = storageList.phrases;

        // Checking to see if the database is not empty.
        if(phrases.length > 0 && phrases[0].phrase !== "") {
          // Preparing each table row for each phrase.
          phrases.forEach(phrase => {
            phraseRows.push(
              <tr key={phrase.id}>
                <th scope="row">{phrase.id}</th>
                <td className="phraseText">{phrase.phrase}</td>
                <td><button className="btn btn-danger" value={phrase.id} onClick={this.deletePhrase}><i className="fas fa-trash-alt"/></button></td>
              </tr>
            );
          });
        }

        // If the database is empty.
        else {
          phraseRows.push(
            <tr key={0}>
              <th/>
              <td>No Phrases</td>
              <td/>
            </tr>
          );
        }
        
        // Updating the phrase list state for list view.
        this.setState({phraseList: phraseRows});
      }
    });
  }

  // Handles phrase input field.
  public handleInput(event: any) {
    this.setState({addPhrase: event.target.value});
  }

  // Writes to database with new input.
  public writeToStorage(event: any) {
    $.ajax({
      data: {"phrase": this.state.addPhrase},
      method: "POST",
      url: "http://localhost:8080/write",

      success: () => {
        this.setState({showModal: false});
        this.prepareList();
      }
      
    });
  }

  public deletePhrase(event: any) {
    // Handles requests and responses via AJAX.
    $.ajax({
      dataType: 'json',
      method: "GET",
      url: "http://localhost:8080/delete/" + event.target.value,

      success: (deleteSuccess) => {
        // Updates list if success.
        if(deleteSuccess.success) {
          this.prepareList();
        }
        else {
          // tslint:disable-next-line:no-console
          console.log("Delete Failed");
        }
      }
    });
  }

  // Modal open/close handlers.
  public handleOpenModal () {
    this.setState({showModal: true});
  }
  public handleCloseModal () {
    this.setState({showModal: false});
  }

  // Main TSX (JSX) render.
  public render(this: any) {
    // Updates list.
    this.prepareList();
    return (
      <div className="App container">
        {/* App Title */}
        <h1>Phrase Logger App</h1>
        
        <br/>
        <br/>

        {/* Add Phrase Button */}
        <button className="btn btn-primary" onClick={this.handleOpenModal}>Add Phrase</button>
        
        {/* New Phrase Input Modal */}
        <Modal 
          isOpen={this.state.showModal}
          contentLabel="Add Phrase"
          style={customStyles}>

          {/* Text Input Field; Add Button; Cancel Button; */}
          <input type="text" value={this.value} placeholder="Phrase" onChange={this.handleInput}/>
          <button className="btn btn-success" onClick={this.writeToStorage}>Add</button>
          <button className="btn btn-danger" onClick={this.handleCloseModal}>Cancel</button>
        </Modal>

        <br/>
        <br/>
        <br/>
        <br/>
        
        {/* Main List View Table */}
        <div className="col-sm-12 col-md-8 col-md-offset-2">
          <table className="table table-striped">
            <col width="20%"/>
            <col width="60%"/>
            <col width="20%"/>

            {/* Main Table Headers */}
            <thead>
              <tr>
                <th>Line Number</th>
                <th>Phrase</th>
                <th/>
              </tr>
            </thead>

            {/* Main Table Body */}
            <tbody>
              {/* Phrase List View State */}
              {this.state.phraseList}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
