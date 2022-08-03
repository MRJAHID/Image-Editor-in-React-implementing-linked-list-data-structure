import React, { useState } from "react";
import "./style/main.css";
import filterElement from "./filterElement";
import { GrRotateLeft, GrRotateRight } from "react-icons/gr";
import { CgMergeVertical, CgMergeHorizontal } from "react-icons/cg";
import { IoMdUndo, IoMdRedo, IoIosImage } from "react-icons/io";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import storeData from "./linkedList";

const Main = () => {
  const [property, setProperty] = useState({
    name: "brightness",
    maxValue: 200,
  });

  const [details, setDetails] = useState("");
  const [crop, setCrop] = useState("");

  const [state, setState] = useState({
    image: "",
    brightness: 100,
    grayscale: 0,
    sepia: 0,
    saturate: 100,
    contrast: 100,
    hueRotate: 0,
    rotate: 0,
    vertical: 1,
    horizontal: 1,
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
    const stateData = state;
    stateData.rotate = state.rotate - 90;
    storeData.insert(stateData);
  };
  const rightRotate = () => {
    setState({
      ...state,
      rotate: state.rotate + 90,
    });
    const stateData = state;
    stateData.rotate = state.rotate + 90;
    storeData.insert(stateData);
  };

  const leftFlip = () => {
    setState({
      ...state,
      vertical: state.vertical === 1 ? -1 : 1,
    });
    const stateData = state;
    stateData.vertical = state.vertical === 1 ? -1 : 1;
    storeData.insert(stateData);
  };
  const rightFlip = () => {
    setState({
      ...state,
      horizontal: state.horizontal === 1 ? -1 : 1,
    });
    const stateData = state;
    stateData.horizontal = state.horizontal === 1 ? -1 : 1;
    storeData.insert(stateData);
  };

  const redo = () => {
    const data = storeData.redoEdit();
    if (data) {
      setState(data);
    }
  };
  const undo = () => {
    const data = storeData.undoEdit();
    if (data) {
      setState(data);
    }
  };

  const imageHandle = (e) => {
    if (e.target.files.length !== 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setState({
          ...state,
          image: reader.result,
        });
        const stateData = {
          image: reader.result,
          brightness: 100,
          grayscale: 0,
          sepia: 0,
          saturate: 100,
          contrast: 100,
          hueRotate: 0,
          rotate: 0,
          vertical: 1,
          horizontal: 1,
        };
        storeData.insert(stateData);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const imgCrop = () => {
    const canvas = document.createElement("canvas");
    const scaleX = details.naturalWidth / details.width;
    const scaleY = details.naturalHeight / details.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      details,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    const base64Url = canvas.toDataURL("image/jpg");
    setState({
      ...state,
      image: base64Url,
    });
  };

  const saveImg = () => {
    const canvas = document.createElement("canvas");
    canvas.width = details.naturalWidth;
    canvas.height = details.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.filter = `brightness(${state.brightness}%) brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((state.rotate * Math.PI) / 180);
    ctx.scale(state.vertical, state.horizontal);

    ctx.drawImage(
      details,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );
    const link = document.createElement("a");
    link.download = "image_edit.jpg";
    link.href = canvas.toDataURL();
    link.click();
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
                  <div onClick={leftFlip}>
                    <CgMergeVertical />
                  </div>
                  <div onClick={rightFlip}>
                    <CgMergeHorizontal />
                  </div>
                </div>
              </div>
            </div>
            <div className="reset">
              <button className="">Reset</button>
              <button onClick={saveImg} className="save">
                Save Image
              </button>
            </div>
          </div>
          <div className="image_section">
            <div className="image">
              {state.image ? (
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                  <img
                    onLoad={(e) => setDetails(e.currentTarget)}
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
              <button onClick={undo} className="undo">
                <IoMdUndo />
              </button>
              <button onClick={redo} className="redo">
                <IoMdRedo />
              </button>
              {crop && (
                <button onClick={imgCrop} className="crop">
                  Crop Image
                </button>
              )}
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
