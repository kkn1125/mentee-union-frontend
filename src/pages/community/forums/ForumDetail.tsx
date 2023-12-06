import Loading from "@/components/atoms/Loading";
import { axiosInstance } from "@/util/instances";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ForumDetail() {
  const [forum, setForum] = useState<Partial<Forum>>();
  const params = useParams();

  useEffect(() => {
    axiosInstance.get(`/forums/${params.id}`).then(({ data: { data } }) => {
      setForum((forum) => data);
    });
  }, []);

  return forum ? <Box>{forum.title}</Box> : <Loading />;
}

export default ForumDetail;
