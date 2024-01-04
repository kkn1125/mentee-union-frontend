import Loading from "@/components/atoms/common/Loading";
import SeminarEditor from "@/components/moleculars/seminar/SeminarEditor";
import Logger from "@/libs/logger";
import { axiosInstance } from "@/util/instances";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const logger = new Logger(UpdateSeminar.name);

function UpdateSeminar() {
  const params = useParams();
  const [seminar, setSeminar] = useState<Seminar | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/seminars/" + params.id)
      .then(({ data }) => data.data)
      .then((data) => {
        setSeminar(data);
      })
      .catch((error) => {
        logger.error("error", error);
      });
  }, []);

  return seminar ? <SeminarEditor seminar={seminar} /> : <Loading />;
}

export default UpdateSeminar;
