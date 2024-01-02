import Loading from "@/components/atoms/common/Loading";
import SeminarEditor from "@/components/moleculars/seminar/SeminarEditor";
import { axiosInstance } from "@/util/instances";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UpdateSeminar() {
  const params = useParams();
  const [seminar, setSeminar] = useState<Seminar | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/seminars/" + params.id)
      .then(({ data }) => data.data)
      .then((data) => {
        // console.log(data);
        setSeminar(data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  return seminar ? <SeminarEditor seminar={seminar} /> : <Loading />;
}

export default UpdateSeminar;
