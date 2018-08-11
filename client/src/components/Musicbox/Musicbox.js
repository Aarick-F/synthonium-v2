import React, { Component } from "react";
import Circle from "./Circle";
import axios from "axios";
import Tone from "tone";
import "./musicbox.css";

class Musicbox extends Component {
  constructor() {
    super();
    this.runCanvas = true;
    this.circles = [];
    this.synth = undefined;

    // Function Binding
    this.animate = this.animate.bind(this);
    this.makeCircle = this.makeCircle.bind(this);
    this.clear = this.clear.bind(this);

    this.posts;
    this.postSelector = 0;

    // Component State
    this.state = {
      user: "TestUser",
      postTitle: "Test Post",
      synthType: "phase",
      notes: "A4,D4,G4,C4"
    }
  }

  componentDidMount() {
    this.canvas.height = this.boxSize.clientHeight;
    this.canvas.width = this.boxSize.clientWidth;

    window.addEventListener("resize", () => {
      if(!this.runCanvas) {
        return;
      }
      this.circles = [];
      this.canvas.height = this.boxSize.clientHeight;
      this.canvas.width = this.boxSize.clientWidth;
    });

    axios.get("/api/post")
      .then(res => {
        console.log(res.data);
        this.posts = res.data;
        this.setState({
          user: this.posts[this.postSelector].username,
          postTitle: this.posts[this.postSelector].title,
          synthType: this.posts[this.postSelector].synthType,
          notes: this.posts[this.postSelector].notes
        });
        // Animation entry point for the Canvas
        this.animate();
      })
      .catch(err => err);
  }

  componentWillUnmount() {
    this.runCanvas = false;
    this.circles = [];
  }

  makeCircle(e) {
    e.preventDefault();
    let coords = {
      x: this.canvas.width / 2,
      y: window.innerHeight - this.canvas.height
    }
    let newCircle = new Circle(coords, this.getRadius());
    this.circles.push(newCircle);
  }

  getRadius() {
    return Math.floor(Math.random() * 30) + 10;
  }

  clear(e) {
    e.preventDefault();
    this.circles = [];
  }

  animate() {
    if(!this.runCanvas) {
      return;
    }
    requestAnimationFrame(this.animate);
    let c = this.canvas.getContext("2d");
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circles.forEach(circle => {
      circle.draw(this.canvas);
      circle.update(this.canvas, this.synth, this.state.notes.split(","));
    });
  }

  cycleLeft() {
    if(this.postSelector > 0) {
      this.postSelector--;
      this.setState({
        postTitle: this.posts[this.postSelector].title,
        synthType: this.posts[this.postSelector].synthType,
        notes: this.posts[this.postSelector].notes
      });
    } else {
      console.log("Cycle Left Clicked");
    }
  }

  cycleRight() {
    if(this.postSelector < this.posts.length - 1) {
      this.postSelector++;
      console.log(this.postSelector);
      this.setState({
        postTitle: this.posts[this.postSelector].title,
        synthType: this.posts[this.postSelector].synthType,
        notes: this.posts[this.postSelector].notes
      });
    } else {
      console.log("Cycle Right Clicked");
    }
  }

  render() {

  // Chooses synth type based on component state
  switch(this.state.synthType) {
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

    return (
      <div className="postWrapper">
        <div className="post">
          <div className="cycle">
            <i
            className="fas fa-arrow-left fa-2x"
            onClick={this.cycleLeft.bind(this)}></i>
          </div>
          <div className="postInfo">
            <h1>{this.state.user} - {this.state.postTitle}</h1>
            <div className="clear" onClick={this.clear}>CLEAR</div>
          </div>
          <div className="cycle">
            <i
            className="fas fa-arrow-right fa-2x"
            onClick={this.cycleRight.bind(this)}></i>
          </div>
        </div>
        <div className="canvasWrapper" ref={boxSize => this.boxSize = boxSize}>
          <canvas ref={canvas => this.canvas = canvas} onClick={this.makeCircle}></canvas>
        </div>
      </div>
    );
  }
}

export default Musicbox;