import { FileBrowser } from "../_components/file-browser";

function Trash() {
  return (
    <div>
      <FileBrowser title="Trash" deletedOnly />
    </div>
  );
}

export default Trash;
