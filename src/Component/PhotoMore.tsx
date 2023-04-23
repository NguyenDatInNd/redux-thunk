import { Button, Skeleton } from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchPhotos,
  onChangeValue,
  confirmValue,
} from "../reduxToolkit/reducer";
import { RootState, useAppDispatch } from "../index";
import { useSelector } from "react-redux";
import { Photo } from "./Photo";

const Skeletons = () => {
  const skeletons = [];

  for (let i = 0; i < 10; i++) {
    skeletons.push(
      <Skeleton 
        key={i}
        sx={{ margin: "10px 10px" }}
        variant="rounded"
        width={700}
        height={120}
      />
    );
  }
  return <div>{skeletons}</div>;
  };

const PhotoMore: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>(1);

  const {
    originValue: initValue,
    updatedValue,
    isLoading,
  } = useSelector((state: RootState) => state.dataPhotos);

  const handleSubmit = () => {
    dispatch(confirmValue(updatedValue));
  };

  const handleReset = () => {
    dispatch(onChangeValue(initValue));
  };

  const observer = useRef<IntersectionObserver>();
  const lastRowRef = useCallback(
    (node: any) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prePage) => prePage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  useEffect(() => {
    dispatch(fetchPhotos(page));
  }, [page, dispatch]);

  const handleOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
      const value = e.target.value;
      const index = updatedValue.findIndex((photo) => photo.id === id);
      const updatedPhoto = {
        ...updatedValue[index],
        title: value,
        time: Date.now(),
      };
      const newUpdatedValue = [...updatedValue];
      newUpdatedValue[index] = updatedPhoto;
      dispatch(onChangeValue(newUpdatedValue));
    },
    [updatedValue, dispatch]
  );

  const renderPhotos = () => {
    return updatedValue.map((photo, index) => {
      return (
        <div
          key={index}
          ref={index === updatedValue.length - 1 ? lastRowRef : null}
          style={{
            border: "1px solid #ccc",
            display: "flex",
            width: "700px",
            height: "120px",
            margin: "10px",
            background: photo.id % 2 !== 0 ? "#fff" : "grey",
          }}
        >
          <Photo key={photo.id} photo={photo} handleOnChange={handleOnChange} />
        </div>
      );
    });
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          zIndex: "1",
          width: "100%",
          padding: "20px 0",
          background: "#fff",
        }}
      >
        <Button
          disabled={JSON.stringify(initValue) === JSON.stringify(updatedValue)}
          onClick={handleSubmit}
          sx={{ margin: "0 10px" }}
          variant="contained"
        >
          Confirm
        </Button>
        <Button
          disabled={JSON.stringify(initValue) === JSON.stringify(updatedValue)}
          onClick={handleReset}
          variant="contained"
        >
          Reset
        </Button>
      </div>
      <div style={{ marginTop: "65px" }}>{renderPhotos()}</div>
      {isLoading && <Skeletons/>}
    </div>
  );
};

export default PhotoMore;
