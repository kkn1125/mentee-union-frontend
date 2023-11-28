import Loading from "@/components/atoms/Loading";
import { axiosInstance } from "@/util/instances";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SeminarDetail() {
  const [seminar, setSeminar] = useState<Partial<Seminar>>();
  const params = useParams();

  useEffect(() => {
    axiosInstance.get(`/seminars/${params.id}`).then(({ data: { data } }) => {
      setSeminar((seminar) => data);
    });
  }, []);

  return seminar ? <Box>{seminar.title}</Box> : <Loading />;
}

export default SeminarDetail;
