// App.js

import React, { useEffect, useRef, useState } from "react";
import * as handTrack from "handtrackjs";

function App() {
  const videoRef = useRef(null);
  // const [model, setModel] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  useEffect(() => {
    const modelParams = {
      flipHorizontal: true, // Flip for webcam
      maxNumBoxes: 1, // Only detect 1 hand
      iouThreshold: 0.5,
      scoreThreshold: 0.6, // Confidence threshold
    };

    const runDetection = (loadedModel) => {
      const detect = async () => {
        const predictions = await loadedModel.detect(videoRef.current);

        if (predictions.length > 0) {
          const label = predictions[0].label.toLowerCase();
          console.log(label);

          if (label.includes("open")) {
            setBackgroundColor("#87CEEB"); // Light Blue
          } else if (label.includes("closed") || label.includes("fist")) {
            setBackgroundColor("#FF6347"); // Tomato Red
          }
        } else {
          setBackgroundColor("#ffffff"); // No hand = white
        }

        requestAnimationFrame(detect); // keep detecting
      };

      detect();
    };

    const startVideo = (loadedModel) => {
      handTrack.startVideo(videoRef.current).then((status) => {
        if (status) {
          console.log("Video started");
          runDetection(loadedModel);
        } else {
          console.log("Please enable video");
        }
      });
    };

    // Load the handtrack model
    handTrack.load(modelParams).then((loadedModel) => {
      // setModel(loadedModel);
      startVideo(loadedModel);
    });
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: backgroundColor,
        transition: "background-color 0.5s ease",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "20px",
            fontWeight: "bold",
            color: "#333333",
          }}
        >
          Gesture Controlled Color Changer 🎨
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "15px",
            color: "#555555",
          }}
        >
          Perform different gestures with your hand to change the background
          color. Try the following:
        </p>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "1.1rem", color: "#333333" }}>
            ✋ Show open palm = Blue
          </p>
          <p style={{ fontSize: "1.1rem", color: "#333333" }}>
            ✊ Show fist = Red
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#f1f1f1",
            padding: "15px",
            borderRadius: "8px",
            fontSize: "1.1rem",
            color: "#666666",
          }}
        >
          <p>Step 1: Allow camera access</p>
          <p>Step 2: Make hand gestures in front of the camera</p>
          <p>Step 3: Enjoy changing colors with your gestures!</p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#777777",
              fontStyle: "italic",
            }}
          >
            Powered by handTrack.js
          </p>
        </div>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "80%",
          borderRadius: "10px",
          marginTop: "30px",
          transform: "scaleX(-1)", // flip camera
          boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}

export default App;
