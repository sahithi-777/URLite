import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {BarLoader} from "react-spinners";

const RedirectLink = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const {loading, data, fn, error} = useFetch(getLongUrl, id);
  const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks);

useEffect(() => {
  if (id) {
    fn(); // Only fetch when the ID is actually present
  }
}, [id]);// Add 'id' as a dependency
// redirect-link.jsx
useEffect(() => {
  if (!loading && data && data.original_url) {
    // Start tracking and redirecting
    fnStats({
      id: data.id,
      originalUrl: data.original_url,
    });
  }
}, [loading, data]); // Simplified dependencies

// useEffect(() => {
//   if (!loading && data && data.original_url) {
//     // Start tracking and redirecting
//     fnStats({
//       id: data.id,
//       originalUrl: data.original_url,
//     });
//   }
// }, [loading, data]); // Simplified dependencies


  if (loading || loadingStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        <p className="text-lg">Redirecting...</p>
      </div>
    );
  }

  if (error || !data || !data.original_url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Link Not Found</h1>
        <p className="text-lg mb-4">
          This short link doesn&apos;t exist or has been deleted.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return null;
};

export default RedirectLink;