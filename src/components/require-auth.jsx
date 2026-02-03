/* eslint-disable react/prop-types */

import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {UrlState} from "@/context";

function RequireAuth({children}) {
  const navigate = useNavigate();

  const {loading, isAuthenticated} = UrlState();

  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate("/auth");
  }, [isAuthenticated, loading, navigate]);

  if (loading) return null;

  if (isAuthenticated) return children;
}

export default RequireAuth;
