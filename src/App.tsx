import React, { lazy, Suspense } from "react";

const LazyPhotoList = lazy(() => import("./Component/PhotoMore"));

const App: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyPhotoList />
      </Suspense>
    </div>
  );
};

export default App;
