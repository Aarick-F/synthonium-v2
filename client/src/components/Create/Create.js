import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./create.css";
import axios from "axios";
import Tone from "tone";
import Note from "./Note";

class Create extends Component {

  constructor() {
    super();
    this.state = {
      redirect: false,
      title: "",
      notes: [],
      synthType: "synth",
      octave: "4",
      sampleNote: "C4",
      synthActive: true,
      pluckActive: false,
      phaseActive: false,
      duoActive: false,
      octave1Active: false,
      octave2Active: false,
      octave3Active: false,
      octave4Active: true,
      octave5Active: false,
      octave6Active: false,
      octave7Active: false,
      octave8Active: false
    }
  }

  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        if(err) throw err;
        this.setState({ profile });
        console.log(this.state);
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let noteString = "";
    this.state.notes.forEach(note => {
      noteString += note + ","
    });
    noteString = noteString.substring(0, noteString.length - 1);

    // Extremely basic input validation
    if(this.state.title.indexOf("<") !== -1 || this.state.title.indexOf(">") !== -1) {
      alert("Stop That.");
      return;
    }

    if(this.state.title.length === 0 || this.state.title.length > 40) {
      alert("Title is required and must be less than 40 characters in length");
      return;
    }

    if(noteString.length === 0) {
      alert("You must select at least one note");
      return;
    }

    const newPost = {
      title: this.state.title,
      notes: noteString,
      synthType: this.state.synthType,
      username: this.state.profile.nickname,
    }

    axios.post("/api/post/create", newPost)
      .then(res => {
        this.setState({
          redirect: true
        })
      })
      .catch(err => console.log(err.response));
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  selectSynth(e) {
    e.preventDefault();
    const selection = e.target.attributes.getNamedItem('data-synthtype').value
    switch(selection) {
      case "synth":
        this.setState({
          synthType: "synth",
          synthActive: true,
          pluckActive: false,
          phaseActive: false,
          duoActive: false
        });
        this.playSample(selection);
        break;
      case "pluck":
        this.setState({
          synthType: "pluck",
          synthActive: false,
          pluckActive: true,
          phaseActive: false,
          duoActive: false
        });
        this.playSample(selection);
        break;
      case "phase":
        this.setState({
          synthType: "phase",
          synthActive: false,
          pluckActive: false,
          phaseActive: true,
          duoActive: false
        });
        this.playSample(selection);
        break;
      case "duo":
        this.setState({
          synthType: "duo",
          synthActive: false,
          pluckActive: false,
          phaseActive: false,
          duoActive: true
        });
        this.playSample(selection);
        break;
    }
  }

  selectOctave(e) {
    const octave = e.target.attributes.getNamedItem('data-octave').value;
    switch(octave) {
      case "1":
        this.setState({
          octave: "1",
          sampleNote: "C1",
          octave1Active: true,
          octave2Active: false,
          octave3Active: false,
          octave4Active: false,
          octave5Active: false,
          octave6Active: false,
          octave7Active: false,
          octave8Active: false
        });
        this.sampleNote += this.state.octave;
        break;
      case "2":
        this.setState({
          octave: "2",
          sampleNote: "C2",
          octave1Active: false,
          octave2Active: true,
          octave3Active: false,
          octave4Active: false,
          octave5Active: false,
          octave6Active: false,
          octave7Active: false,
          octave8Active: false
        });
        break;
      case "3":
        this.setState({
          octave: "3",
          sampleNote: "C3",
          octave1Active: false,
          octave2Active: false,
          octave3Active: true,
          octave4Active: false,
          octave5Active: false,
          octave6Active: false,
          octave7Active: false,
          octave8Active: false
        });
        break;
      case "4":
        this.setState({
          octave: "4",
          sampleNote: "C4",
          octave1Active: false,
          octave2Active: false,
          octave3Active: false,
          octave4Active: true,
          octave5Active: false,
          octave6Active: false,
          octave7Active: false,
          octave8Active: false
        });
        break;
      case "5":
        this.setState({
          octave: "5",
          sampleNote: "C5",
          octave1Active: false,
          octave2Active: false,
          octave3Active: false,
          octave4Active: false,
          octave5Active: true,
          octave6Active: false,
          octave7Active: false,
          octave8Active: false
        });
        break;
      case "6":
        this.setState({
          octave: "6",
          sampleNote: "C6",
          octave1Active: false,
          octave2Active: false,
          octave3Active: false,
          octave4Active: false,
          octave5Active: false,
          octave6Active: true,
          octave7Active: false,
          octave8Active: false
        });
        break;
      case "7":
        this.setState({
          octave: "7",
          sampleNote: "C7",
          octave1Active: false,
          octave2Active: false,
          octave3Active: false,
          octave4Active: false,
          octave5Active: false,
          octave6Active: false,
          octave7Active: true,
          octave8Active: false
        });
        break;
      case "8":
        this.setState({
          octave: "8",
          sampleNote: "C8",
          octave1Active: false,
          octave2Active: false,
          octave3Active: false,
          octave4Active: false,
          octave5Active: false,
          octave6Active: false,
          octave7Active: false,
          octave8Active: true
        });
        break;
    }
  }

  selectNote(e) {
    const note = e.target.attributes.getNamedItem('data-note').value;
    let synth;
    let noteWithOctave = note + this.state.octave;
    switch(this.state.synthType) {
        case "synth":
          synth = new Tone.Synth().toMaster();
          break;
        case "pluck":
          synth = new Tone.PluckSynth().toMaster();
          break;
        case "phase":
          synth = new Tone.FMSynth({
            "modulationIndex" : 12.22,
            "envelope" : {
              "attack" : 0.01,
              "decay" : 0.2
            },
            "modulation" : {
              "type" : "square"
            },
            "modulationEnvelope" : {
              "attack" : 0.2,
              "decay" : 0.01
            }
          }).toMaster();
          break;
        case "duo":
          synth = new Tone.DuoSynth().toMaster();
      }
    if(this.state.notes.length < 8) {
      let newArr = this.state.notes;
      newArr.push(noteWithOctave);
      this.setState({notes: newArr});
      // this.state.notes.push(noteWithOctave);
    }
    synth.triggerAttackRelease(noteWithOctave, "32n");
    console.log(this.state.notes);
  }

  removeNote() {
    let newArr = this.state.notes;
    newArr.pop();
    this.setState({notes: newArr});
  }

  playSample(synth) {
    switch(synth) {
      case "synth":
        this.synth = new Tone.Synth().toMaster();
        break;
      case "pluck":
        this.synth = new Tone.PluckSynth().toMaster();
        break;
      case "phase":
        this.synth = new Tone.FMSynth({
          "modulationIndex" : 12.22,
          "envelope" : {
            "attack" : 0.01,
            "decay" : 0.2
          },
          "modulation" : {
            "type" : "square"
          },
          "modulationEnvelope" : {
            "attack" : 0.2,
            "decay" : 0.01
          }
        }).toMaster();
        break;
      case "duo":
        this.synth = new Tone.DuoSynth().toMaster();
        break;
    }
    this.synth.triggerAttackRelease(this.state.sampleNote, "16n");
  }

  render() {
    const { profile } = this.state;
    const arr = this.state.notes;

    if(this.state.redirect) {
      return <Redirect to="/" />
    }

    return (
      <div className="createContainer">
        <div className="createHeader">
          {profile.nickname} - Create Post
        </div>
        <ul className="synthTypes">
          <li
          className={this.state.synthActive ? "synth selected" : "synth"}
          data-synthtype="synth"
          onClick={this.selectSynth.bind(this)}>Synth</li>
          <li
          className={this.state.pluckActive ? "synth selected" : "synth"}
          data-synthtype="pluck"
          onClick={this.selectSynth.bind(this)}>Pluck</li>
          <li
          className={this.state.phaseActive ? "synth selected" : "synth"}
          data-synthtype="phase"
          onClick={this.selectSynth.bind(this)}>Phase</li>
          <li
          className={this.state.duoActive ? "synth selected" : "synth"}
          data-synthtype="duo"
          onClick={this.selectSynth.bind(this)}>Duo</li>
        </ul>
        <ul className="octaveContainer">
          <li className="octaveLabel">Octave:</li>
          <li
          className={this.state.octave1Active ? "octave selected" : "octave"}
          data-octave="1"
          onClick={this.selectOctave.bind(this)}>1</li>
          <li className={this.state.octave2Active ? "octave selected" : "octave"}
          data-octave="2"
          onClick={this.selectOctave.bind(this)}>2</li>
          <li className={this.state.octave3Active ? "octave selected" : "octave"}
          data-octave="3"
          onClick={this.selectOctave.bind(this)}>3</li>
          <li className={this.state.octave4Active ? "octave selected" : "octave"}
          data-octave="4"
          onClick={this.selectOctave.bind(this)}>4</li>
          <li className={this.state.octave5Active ? "octave selected" : "octave"}
          data-octave="5"
          onClick={this.selectOctave.bind(this)}>5</li>
          <li className={this.state.octave6Active ? "octave selected" : "octave"}
          data-octave="6"
          onClick={this.selectOctave.bind(this)}>6</li>
          <li className={this.state.octave7Active ? "octave selected" : "octave"}
          data-octave="7"
          onClick={this.selectOctave.bind(this)}>7</li>
          <li className={this.state.octave8Active ? "octave selected" : "octave"}
          data-octave="8"
          onClick={this.selectOctave.bind(this)}>8</li>
        </ul>
        <ul className="keyboardContainer">
          <li className="note white"
          data-note="C"
          onClick={this.selectNote.bind(this)}>C</li>
          <li className="note black"
          data-note="C#"
          onClick={this.selectNote.bind(this)}>C#</li>
          <li className="note white"
          data-note="D"
          onClick={this.selectNote.bind(this)}>D</li>
          <li className="note black"
          data-note="D#"
          onClick={this.selectNote.bind(this)}>D#</li>
          <li className="note white"
          data-note="E"
          onClick={this.selectNote.bind(this)}>E</li>
          <li className="note white"
          data-note="F"
          onClick={this.selectNote.bind(this)}>F</li>
          <li className="note black"
          data-note="F#"
          onClick={this.selectNote.bind(this)}>F#</li>
          <li className="note white"
          data-note="G"
          onClick={this.selectNote.bind(this)}>G</li>
          <li className="note black"
          data-note="G#"
          onClick={this.selectNote.bind(this)}>G#</li>
          <li className="note white"
          data-note="A"
          onClick={this.selectNote.bind(this)}>A</li>
          <li className="note black"
          data-note="A#"
          onClick={this.selectNote.bind(this)}>A#</li>
          <li className="note white"
          data-note="B"
          onClick={this.selectNote.bind(this)}>B</li>
        </ul>
        <div className="selectedNotes">
          <p className="notesLabel">Notes:</p>
          {arr.map(item => <Note key={arr.indexOf(item)} note={item} />)}
          <div className="removeNote" onClick={this.removeNote.bind(this)}>
            <i className="fas fa-arrow-left fa-1x"></i>
          </div>
        </div>
        <div className="titleContainer">
          <p className="titleLabel">TITLE:</p>
          <input
          type="text"
          name="title"
          placeholder="1-40 characters"
          onChange={this.onChange.bind(this)}></input>
        </div>
        <div className="submit" onClick={this.handleSubmit.bind(this)}>SUBMIT</div>
      </div>
    );
  }
}

export default Create;