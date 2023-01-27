import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichText = ({ height, handleEditorChange, initialContent,error }) => {

  return (
    <div>
      <Editor
        apiKey="0b4h8nc84pz6bw9uoqo9bx1i14awcgxfw8tg2kv1shg647kx"
        initialValue={`<p>${initialContent ? initialContent : ""}</p>`}
        init={{
          height: height ? height : 400,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
          "undo redo | formatselect | link | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help",
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default RichText;
