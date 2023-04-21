import { Button, Skeleton, TextField } from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { addState, fetchPhotos } from "../reduxToolkit/reducer";
import { RootState, useAppDispatch } from "../index";
import { useSelector } from "react-redux";

interface IPhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const PhotoMore: React.FC = () => {
  const dispatch = useAppDispatch();
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [contextState, setContextState] = useState<string>("");
  const [preContextState, setPreContextState] = useState<string>("");
  const [idContent, setIdContent] = useState<number>();

  console.log(preContextState)

  const handleSubmit = () => {
    // dispatch(
    //   addState({
    //     id: idContent,
    //     content: contextState,
    //   })
    // );
    // // setIdContent(undefined);
    // setPreContextState('')
  };

  const handleReset =() => {

  }

  const Skeletons = () => {
    const skeletons = [];

    for (let i = 0; i < 10; i++) {
      skeletons.push(
        <Skeleton
          key={i}
          sx={{ margin: "10px 0" }}
          variant="rounded"
          width={700}
          height={120}
        />
      );
    }
    return <div>{skeletons}</div>;
  };

  const photoList = useSelector((state: RootState) => state.dataPhotos.photos);

  useEffect(() => {
    loadPhotos();
  }, [page]);

  const loadPhotos = async () => {
    setLoading(true);
    dispatch(fetchPhotos(page))
    setPhotos([...photos, ...photoList]);
    setLoading(false);
  };

  // khi scroll đến cuối trang thì sẽ tăng page lên 1
  const observer = useRef<IntersectionObserver>();
  const lastPhotoRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prePage) => prePage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const renderPhotos = () => {
    return photos.map((photo, index) => {
      if (index === photos.length - 1) {
        return (
          <div
            style={{
              border: "1px solid #ccc",
              display: "flex",
              width: "700px",
              height: "120px",
              margin: "10px",
              background: photo.id % 2 !== 0 ? "white" : "grey",
            }}
            key={index}
            ref={lastPhotoRef}
          >
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <span>{photo.title}</span>
            <span>{Date.now()}</span>
          </div>
        );
      }
      return (
        <div
          style={{
            border: "1px solid #ccc",
            display: "flex",
            width: "700px",
            height: "120px",
            margin: "10px",
            background: photo.id % 2 !== 0 ? "white" : "grey",
          }}
          key={index}
        >
          <img src={photo.thumbnailUrl} alt={photo.title} />
          <div style={{ flex: 1 }}>
            <TextField
              size="small"
              fullWidth
              defaultValue={preContextState || photo.title}
              // onChange={(e) => {
              //   const currentValue = e.target.value;
              //   if (!preContextState) {
              //     setPreContextState(currentValue);
              //   }
              //     setContextState(e.target.value);
              //     setIdContent(photo.id);
              // }}
            ></TextField>
            <p>{Date.now()}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          zIndex: "1",
          background: "white",
          width: "100%",
          padding: "20px 0",
        }}
      >
        <Button
          onClick={handleSubmit}
          sx={{ margin: "0 10px" }}
          variant="contained"
          color="primary"
        >
          Confirm
        </Button>
        <Button 
          onClick={handleReset}
          variant="contained" color="primary">
          Reset
        </Button>
      </div>
      <div style={{ marginTop: "65px" }}>{renderPhotos()}</div>
      {loading && <Skeletons />}
    </div>
  );
};

export default PhotoMore;
