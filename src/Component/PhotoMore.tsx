import { Button} from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {fetchPhotos, onChangeValue, confirmValue} from "../reduxToolkit/reducer";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const handleSubmit = () => {
    dispatch(confirmValue(updatedValue))
  };

  const handleReset =() => {
    dispatch(onChangeValue(initValue))
  }
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

  // const Photo = React.memo(
  //   ({ photo, handleOnChange }: { photo:any; handleOnChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void }) => (
  //     <div style={{ border: "1px solid #ccc", display: "flex", width: "700px", height: "120px", margin: "10px", background: photo.id % 2 !== 0 ? "#fff" : "grey" }}>
  //       <img src={photo.thumbnailUrl} alt={photo.title} />
  //       <div style={{ flex: 1 }}>
  //         <input style={{ width: '573px', height: '40px', fontSize: 'medium' }} value={photo.title} onChange={e => handleOnChange(e, photo.id)} />
  //         <p>{Date.now()}</p>
  //       </div>
  //     </div>
  //   ),
  //   (prevProps, nextProps) => prevProps.photo === nextProps.photo && prevProps.handleOnChange === nextProps.handleOnChange);
  
  // const renderPhotos = () => {
  //   return updatedValue.map((photo, index) => {
  //     if (index === updatedValue.length - 1) {
  //       return <div key={index} ref={lastPhotoRef}><Photo photo={photo} handleOnChange={handleOnChange} /></div>;
  //     }
  //     return <div key={index}><Photo photo={photo} handleOnChange={handleOnChange} /></div>;
  //   });
  // };
  
  const renderPhotos = () => {
    return updatedValue.map((photo, index) => {
      if (index === updatedValue.length - 1) {
        return (
          <div 
          style={{
                 border: "1px solid #ccc", display: "flex", width: "700px", height: "120px", margin: "10px", background: photo.id % 2 !== 0 ? "#fff" : "grey",
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
          border: "1px solid #ccc", display: "flex", width: "700px", height: "120px", margin: "10px", background: photo.id % 2 !== 0 ? "#fff" : "grey",
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
    <div>
      <div style={{position: "fixed", top: 0, zIndex: "1", width: "100%", padding: "20px 0",background:"#fff"}}>
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
    </div>
  );
};

export default PhotoMore;
