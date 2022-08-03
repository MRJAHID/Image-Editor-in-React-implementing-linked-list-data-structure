import React, { useState } from "react";
import "./style/main.css";
import filterElement from "./filterElement";
import { GrRotateLeft, GrRotateRight } from "react-icons/gr";
import { CgMergeVertical, CgMergeHorizontal } from "react-icons/cg";
import { IoMdUndo, IoMdRedo, IoIosImage } from "react-icons/io";

const Main = () => {
  const [property, setProperty] = useState({
    name: "brightness",
    maxValue: 200,
  });

  const [state, setState] = useState({
    image: "",
    brightness: 100,
    grayscale: 0,
    sepia: 0,
    saturate: 100,
    contrast: 100,
    hueRotate: 0,
    rotate: 0,
    vertical: 0,
    horizontal: 0,
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const leftRotate = () => {
    setState({
      ...state,
      rotate: state.rotate - 90,
    });
  };
  const rightRotate = () => {
    setState({
      ...state,
      rotate: state.rotate + 90,
    });
  };

  const imageHandle = (e) => {
    if (e.target.files.length !== 0) {
      const reader = new FileReader();

      reader.onload = () => {
        setState({
          ...state,
          image: reader.result,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="image_editor">
      <div className="card">
        <div className="card_header">
          <h2>----------- Image Editor ----------</h2>
        </div>
        <div className="card_body">
          <div className="sidebar">
            <div className="side_body">
              {/*filter_section*/}
              <div className="filter_section">
                <span>Filter</span>
                <div className="filter_key">
                  {filterElement.map((v, i) => (
                    <button
                      className={
                        property.name === v.name ? "active" : undefined
                      }
                      onClick={() => setProperty(v)}
                      key={i}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
              {/*filter_slider*/}
              <div className="filter_slider">
                <div className="label_bar">
                  <label htmlFor="range">Rotate</label>
                  <span>100%</span>
                </div>
                <input
                  name={property.name}
                  onChange={inputHandle}
                  value={state[property.name]}
                  max={property.maxValue}
                  type="range"
                />
              </div>

              {/*rotate*/}
              <div className="rotate">
                <div className="label_bar">
                  <label htmlFor="">Rotate & Flip</label>
                </div>
                <div className="icon">
                  <div onClick={leftRotate}>
                    <GrRotateLeft />
                  </div>
                  <div onClick={rightRotate}>
                    <GrRotateRight />
                  </div>
                  <div>
                    <CgMergeVertical />
                  </div>
                  <div>
                    <CgMergeHorizontal />
                  </div>
                </div>
              </div>
            </div>
            <div className="reset">
              <button className="">Reset</button>
              <button className="save">Save Image</button>
            </div>
          </div>
          <div className="image_section">
            <div className="image">
              {state.image ? (
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                  <img
                    style={{
                      filter: `brightness(${state.brightness}%) brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`,
                      transform: `rotate(${state.rotate}deg) scale(${state.vertical},${state.horizontal})`,
                    }}
                    src={state.image}
                    alt=""
                  />
                </ReactCrop>
              ) : (
                <label htmlFor="choose">
                  <IoIosImage />
                  <span>Choose Image</span>
                </label>
              )}
            </div>
            <div className="image_select">
              <button className="undo">
                <IoMdUndo />
              </button>
              <button className="redo">
                <IoMdRedo />
              </button>
              <button className="crop">Crop Image</button>
              <label htmlFor="choose">Choose Image</label>
              <input onChange={imageHandle} type="file" id="choose" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
