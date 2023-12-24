import Loading from "@/components/atoms/Loading";
import { axiosInstance } from "@/util/instances";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ForumDetail() {
  const [forum, setForum] = useState<Forum | null>(null);
  const params = useParams();

  useEffect(() => {
    axiosInstance
      .get(`/forums/${params.id}`)
      .then(({ data }) => data.data)
      .then((data) => {
        setForum(data);
      });
  }, []);

  if (forum === null) {
    return <Loading />;
  }

  return <Box>{forum.title}</Box>;
}

export default ForumDetail;
