import { Button, Skeleton} from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {fetchPhotos, onChangeValue, confirmValue} from "../reduxToolkit/reducer";
import { RootState, useAppDispatch } from "../index";
import { useSelector } from "react-redux";

const PhotoMore: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const handleSubmit = () => {
    dispatch(confirmValue(updatedValue))
  };

  const handleReset =() => {
    dispatch(onChangeValue(initValue))
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
    },[loading]);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      dispatch(fetchPhotos(page))
      setLoading(false);
    };
    loadPhotos();
    // eslint-disable-next-line
  },[page]);

  const initValue = useSelector((state: RootState) => state.dataPhotos.originValue);
  const updatedValue = useSelector((state: RootState) => state.dataPhotos.updatedValue);

  const handleOnChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const value = e.target.value
    const index = updatedValue.findIndex(photo => photo.id === id);
    const updatedPhoto = { ...updatedValue[index], title: value };
    const newUpdatedValue = [...updatedValue];
    newUpdatedValue[index] = updatedPhoto;
    dispatch(onChangeValue(newUpdatedValue))
  }, [updatedValue, dispatch]);

  const renderPhotos = () => {
    return updatedValue.map((photo, index) => {
      if (index === updatedValue.length - 1) {
        return (
          <div 
          style={{
                 border: "1px solid #ccc", display: "flex", width: "700px", height: "120px", margin: "10px", background: photo.id % 2 !== 0 ? "#ccc" : "grey",
               }}
            key={index} ref={lastPhotoRef} >
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <div style={{ flex: 1 }}>
             <input 
               style={{width: '573px',
               height: '40px',
               fontSize: 'medium'}}
              value={photo.title}
              onChange={e => handleOnChange(e, photo.id)}
              />
             <p>{Date.now()}</p>
          </div>
          </div>
        );
      }
      return (
        <div 
        style={{
          border: "1px solid #ccc", display: "flex", width: "700px", height: "120px", margin: "10px", background: photo.id % 2 !== 0 ? "#ccc" : "grey",
        }}
          key={index} >
          <img src={photo.thumbnailUrl} alt={photo.title} />
          <div style={{ flex: 1 }}>
            <input
              style={{width: '573px',
              height: '40px',
              fontSize: 'medium'}}
              value={photo.title}
              onChange={e => handleOnChange(e, photo.id)}
            />
            <p>{Date.now()}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <div style={{background:"black"}}>
      <div style={{position: "fixed", top: 0, zIndex: "1", width: "100%", padding: "20px 0",background:"black"}}>
        <Button
          disabled={JSON.stringify(initValue) === JSON.stringify(updatedValue)}
          onClick={handleSubmit}
          sx={{ margin: "0 10px" }} variant="contained">
          Confirm
        </Button>
        <Button 
          disabled={JSON.stringify(initValue) === JSON.stringify(updatedValue)}
         onClick={handleReset} variant="contained">
          Reset
        </Button>
      </div>
      <div style={{ marginTop: "65px" }}>{renderPhotos()}</div>
      {loading && <Skeletons />}
    </div>
  );
};

export default PhotoMore;
