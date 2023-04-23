import React from "react";

interface IPhoto {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
    time: number;
  }

interface PhotoProps {
  photo: IPhoto;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
}

export const Photo : React.FC<PhotoProps> = (
  ({photo, handleOnChange}) => {

    return (
      <>
        <img src={photo.thumbnailUrl} alt={photo.title} />
        <div style={{ flex: 1 }}>
          <input
            style={{ width: "573px", height: "40px", fontSize: "medium" }}
            value={photo.title}
            onChange={(e) => handleOnChange(e, photo.id)}
          />
          <p>{photo.time}</p>
        </div>
      </>
    );
  }
);
