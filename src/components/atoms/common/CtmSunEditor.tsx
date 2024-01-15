import SunEditor from "suneditor-react";
import { SunEditorReactProps } from "suneditor-react/dist/types/SunEditorReactProps";

type CtmSunEditorProps = SunEditorReactProps;

function CtmSunEditor(props: CtmSunEditorProps) {
  return (
    <SunEditor
      setOptions={{
        buttonList: [
          ["undo", "redo"],
          ["font", "fontSize", "formatBlock"],
          ["bold", "underline", "italic", "strike", "subscript", "superscript"],
          ["removeFormat"],
          "/",
          ["fontColor", "hiliteColor"],
          ["outdent", "indent"],
          ["align", "horizontalRule", "list", "table"],
          ["link", "image", "video"],
          ["fullScreen", "showBlocks", "codeView"],
          ["preview", "print"],
          // ["save", "template"],
        ],
      }}
      {...props}
    />
  );
}

export default CtmSunEditor;
